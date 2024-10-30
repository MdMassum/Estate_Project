import express from 'express'
import { deleteUser, getUser, getUserListing, updateProfile } from '../controller/UserController.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// for updating user profile 
router.post('/update/me/:id',updateProfile)  // removed verifyToken
router.delete('/delete-account/:id',deleteUser) // removed verifyToken
router.get('/listings/:id',getUserListing)
router.get('/:id',getUser)


export default router;