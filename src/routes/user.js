import express from 'express';

import userController from '../app/controllers/UserController.js';

const router = express.Router();

// Show profile info
router.get('/profile', userController.getProfileInfo);
//Update profile info
router.post('/profile', userController.updateProfileInfo);

export default router;