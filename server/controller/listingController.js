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
        return (errorHandler(404,"Listing Not Found"));
    }

    if(req.user.id !== listing.userRef) return next(errorHandler(401, "You can only delete your own Listings"))

    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json("Listing Deleted Successfully")
    } catch (error) {
        next(error);
    }
}

// edit a list 

export const editListing = async(req, res, next)=>{

    const listing = await Listing.findById(req.params.id);

    if(!listing){
        return (errorHandler(404,"Listing Not Found"));
    }

    if(req.user.id !== listing.userRef) return next(errorHandler(401, "You can only update your own Listings"))

    try {
        
        const updatedList = await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        ) 
        // new : true saves our new infromation else it will save previous value only

        res.status(200).json(updatedList);
    } catch (error) {
        next(error)
    }
}

export const getListing = async(req, res, next)=>{

    try {
        
        const listing = await Listing.findById(req.params.id) 
        res.status(200).json(listing);

    } catch (error) {
        next(error)
    }
}