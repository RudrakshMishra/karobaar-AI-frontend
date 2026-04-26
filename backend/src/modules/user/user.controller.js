const { prisma } = require('../../config/db');
const AppError = require('../../utils/AppError');
const bcrypt = require('bcrypt');
const { z } = require('zod');

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  businessName: z.string().optional(),
  businessCategory: z.string().optional(),
});

exports.getProfile = async (req, res, next) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true, email: true, name: true, businessName: true,
      businessCategory: true, phone: true, avatar: true,
      isVerified: true, plan: true, planExpiresAt: true, createdAt: true
    }
  });

  res.status(200).json({ status: 'success', data: { user } });
};

exports.updateProfile = async (req, res, next) => {
  try {
    const validatedData = updateProfileSchema.parse(req.body);
    
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: validatedData,
      select: {
        id: true, email: true, name: true, businessName: true,
        businessCategory: true, phone: true, avatar: true,
        isVerified: true, plan: true, createdAt: true
      }
    });

    res.status(200).json({ status: 'success', data: { user: updatedUser } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors.map(e => e.message).join(', '), 400));
    }
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return next(new AppError('Please provide old and new password', 400));
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!(await bcrypt.compare(oldPassword, user.passwordHash))) {
      return next(new AppError('Incorrect old password', 401));
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: req.user.id },
      data: { passwordHash }
    });

    res.status(200).json({ status: 'success', message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};

exports.deleteAccount = async (req, res, next) => {
  try {
    // Soft delete
    await prisma.user.update({
      where: { id: req.user.id },
      data: { isActive: false }
    });

    // Option: hard delete
    // await prisma.user.delete({ where: { id: req.user.id } });

    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    next(error);
  }
};

exports.getSubscription = async (req, res, next) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { plan: true, planExpiresAt: true }
  });

  res.status(200).json({
    status: 'success',
    data: {
      plan: user.plan,
      expiresAt: user.planExpiresAt,
      features: getFeaturesForPlan(user.plan)
    }
  });
};

const getFeaturesForPlan = (plan) => {
  const base = ['CSV upload', 'Basic analytics', '1 platform'];
  if (plan === 'FREE') return base;
  if (plan === 'STARTER') return [...base, 'AI insights', '3 platforms', 'Profit engine'];
  if (plan === 'PRO') return [...base, 'AI insights', 'All platforms', 'Profit engine', 'Competitor tracking', 'Voice analytics'];
  if (plan === 'ENTERPRISE') return ['All Features', 'White-labeling', 'API Access', 'Dedicated Support'];
  return base;
};
