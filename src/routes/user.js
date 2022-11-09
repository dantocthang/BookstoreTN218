import express from 'express';

import UserController from '../app/controllers/UserController.js'

const router = express.Router();

router.get('/profile', UserController.getProfileInfo);
router.post('/profile', UserController.updateProfileInfo);
router.put('/profile/address', UserController.updateAddress);
router.post('/profile/address', UserController.addAddress);
router.delete('/profile/address', UserController.deleteAddress);

export default router;