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

// delete listing
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
// get listing with id
export const getListing = async(req, res, next)=>{

    try {
        
        const listing = await Listing.findById(req.params.id) 
        res.status(200).json(listing);

    } catch (error) {
        next(error)
    }
}

// get all listing along with searching & filters
export const getAllListing = async(req, res, next) =>{
    try {
        const limit = parseInt(req.query.limit) || 6;
        const startIndex = parseInt(req.query.startIndex) || 0;
        let offer = req.query.offer;

        if(offer === undefined || offer ==='false'){ // then we have to show all listing with and without offer
            offer = {$in:[false,true]}
        }

        let furnished = req.query.furnished;
        if(furnished === undefined || furnished ==='false'){
            // then we have to show all listing with and without furnished
            furnished = {$in:[false,true]}
        }
        let parking = req.query.parking;
        if(parking === undefined || parking ==='false'){
            // then we have to show all listing with and without parking
            parking = {$in:[false,true]}
        }
        let type = req.query.type;
        if(type === undefined || type ==='all'){
            // then we have to show all listing with both rent and sale type
            type = {$in:['rent','sale']}
        }

        const searchKey = req.query.searchKey || '';
        const sort = req.query.sort || 'createdAt';

        const order = req.query.order || 'desc';

        // finding the listing based on parameters
        const listings = await Listing.find({
            description:{$regex:searchKey, $options:'i'},         // i means case inSensitive
            offer,
            furnished,
            parking,
            type,
        }).sort(
            {[sort]:order}
        ).limit(limit).skip(startIndex)  // for pagination

        return res.status(200).json(listings);

    } catch (error) {
        next(error)
    }
}