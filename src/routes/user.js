import express from 'express';

import userController from '../app/controllers/UserController.js';

const router = express.Router();

// Show profile info
router.get('/info', userController.getProfileInfo);

export default router;