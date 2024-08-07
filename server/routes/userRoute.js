import express from 'express'
import { deleteUser, getUserListing, updateProfile } from '../controller/UserController.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// for updating user profile 
router.post('/update/me/:id',verifyToken,updateProfile)
router.delete('/delete-account/:id',verifyToken,deleteUser)
router.get('/listings/:id',verifyToken,getUserListing)


export default router;