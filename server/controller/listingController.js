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

export const deleteListing = async(req,res,next)=>{

    const listing = await Listing.findById(req.params.id);

    if(!listing){
        return res.status(404).json("Listing Not Found");
    }

    if(req.user.id !== listing.userRef) return next(errorHandler(401, "You can only delete your own Listings"))

    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json("Listing Deleted Successfully")
    } catch (error) {
        next(error);
    }
}