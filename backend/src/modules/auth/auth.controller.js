const authService = require('./auth.service');
const AppError = require('../../utils/AppError');
const { z } = require('zod');

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  businessName: z.string().optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

exports.register = async (req, res, next) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const result = await authService.register(validatedData);
    
    res.status(201).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors.map(e => e.message).join(', '), 400));
    }
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const result = await authService.login(email, password);
    
    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0].message, 400));
    }
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return next(new AppError('Refresh token required', 400));
    
    await authService.logout(refreshToken);
    res.status(200).json({ status: 'success', message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return next(new AppError('Refresh token required', 400));

    const result = await authService.refreshTokens(refreshToken);
    res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  // req.user is set by protect middleware
  const user = { ...req.user };
  delete user.passwordHash;
  
  res.status(200).json({
    status: 'success',
    data: { user }
  });
};
