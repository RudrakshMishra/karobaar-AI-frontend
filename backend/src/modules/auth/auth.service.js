const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { prisma } = require('../../config/db');
const AppError = require('../../utils/AppError');

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: '15m'
  });
  const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d'
  });
  return { accessToken, refreshToken };
};

exports.register = async (data) => {
  const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
  if (existingUser) {
    throw new AppError('Email already in use', 400);
  }

  const passwordHash = await bcrypt.hash(data.password, 12);
  
  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      name: data.name,
      businessName: data.businessName,
    }
  });

  const { accessToken, refreshToken } = generateTokens(user.id);
  
  // Save refresh token
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  
  await prisma.refreshToken.create({
    data: { token: refreshToken, userId: user.id, expiresAt }
  });

  const { passwordHash: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, accessToken, refreshToken };
};

exports.login = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new AppError('Incorrect email or password', 401);
  }

  const { accessToken, refreshToken } = generateTokens(user.id);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  
  await prisma.refreshToken.create({
    data: { token: refreshToken, userId: user.id, expiresAt }
  });

  const { passwordHash: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, accessToken, refreshToken };
};

exports.logout = async (refreshToken) => {
  await prisma.refreshToken.deleteMany({
    where: { token: refreshToken }
  });
};

exports.refreshTokens = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    
    // Check if token is in db
    const savedToken = await prisma.refreshToken.findUnique({
      where: { token }
    });

    if (!savedToken) {
      throw new AppError('Refresh token not found or invalidated', 401);
    }

    // Invalidate old token
    await prisma.refreshToken.delete({ where: { token } });

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(decoded.id);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    
    await prisma.refreshToken.create({
      data: { token: newRefreshToken, userId: decoded.id, expiresAt }
    });

    return { accessToken, refreshToken: newRefreshToken };
  } catch (error) {
    throw new AppError('Invalid or expired refresh token', 401);
  }
};
