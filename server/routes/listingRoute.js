import express from 'express'
import { verifyToken } from '../utils/verifyUser.js';
import { createListing, deleteListing, editListing, getListing } from '../controller/listingController.js';

const router = express.Router();

router.post('/create',verifyToken ,createListing)
router.delete('/delete/:id',verifyToken ,deleteListing)
router.put('/update/:id',verifyToken ,editListing)
router.get('/getListing/:id',getListing)

export default router;