import express from 'express'
import { SignUp, SignIn, Google, signOut } from '../controller/authController.js';

const router = express.Router();

router.post('/signup',SignUp)
router.post('/signin',SignIn)
router.post('/google',Google)
router.post('/sign-out',signOut)

export default router;