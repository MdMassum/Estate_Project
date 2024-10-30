import express from 'express'
import { verifyToken } from '../utils/verifyUser.js';
import { createListing, deleteListing, editListing, getAllListing, getListing } from '../controller/listingController.js';

const router = express.Router();

router.post('/create', createListing)  // removed verifyToken
router.delete('/delete/:id', deleteListing) // removed verifyToken
router.put('/update/:id', editListing) // removed verifyToken
router.get('/getListing/:id',getListing)
router.get('/getAllListing',getAllListing)

export default router;