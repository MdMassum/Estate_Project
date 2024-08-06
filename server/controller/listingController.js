import errorHandler from "../utils/errors.js"
import Listing from "../models/Listing.js";

//create listing -->
export const createListing = async(req,res,next) =>{

    try {
        const listing = await Listing.create(req.body);
        res.status(201).json(listing)

    } catch (error) {
        next(error);
    }
}