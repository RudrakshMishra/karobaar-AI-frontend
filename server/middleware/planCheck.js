const planCheck = (requiredPlan) => {
  return (req, res, next) => {
    const plans = { 'free': 0, 'pro': 1, 'agency': 2 };
    const userPlan = req.user?.plan || 'free';
    
    if (plans[userPlan] < plans[requiredPlan]) {
      return res.status(403).json({
        success: false,
        message: 'Plan required',
        required_plan: requiredPlan,
        upgrade_url: '/dashboard/settings?tab=billing'
      });
    }
    next();
  };
};

module.exports = planCheck;
