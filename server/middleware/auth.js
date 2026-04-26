const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

// The ClerkExpressRequireAuth middleware ensures that a valid Clerk session token is present
// If not, it will return a 401 Unauthorized error automatically.
// The user ID will be available at req.auth.userId
const requireAuth = ClerkExpressRequireAuth();

module.exports = requireAuth;
