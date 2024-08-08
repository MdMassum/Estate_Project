import express from 'express'
import { verifyToken } from '../utils/verifyUser.js';
import { createListing, deleteListing, editListing, getAllListing, getListing } from '../controller/listingController.js';

const router = express.Router();

router.post('/create',verifyToken ,createListing)
router.delete('/delete/:id',verifyToken ,deleteListing)
router.put('/update/:id',verifyToken ,editListing)
router.get('/getListing/:id',getListing)
router.get('/getAllListing',getAllListing)

export default router;