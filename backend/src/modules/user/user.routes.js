const express = require('express');
const userController = require('./user.controller');
const { protect } = require('../../middleware/auth');

const router = express.Router();

router.use(protect); // All user routes require auth

router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.put('/change-password', userController.changePassword);
router.delete('/account', userController.deleteAccount);
router.get('/subscription', userController.getSubscription);

module.exports = router;
