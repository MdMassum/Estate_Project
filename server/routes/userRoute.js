import express from 'express'
import { updateProfile } from '../controller/UserController.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// for updating user profile 
router.post('/update/me/:id',verifyToken,updateProfile)

export default router;