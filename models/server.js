const Joi = require('joi');


module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string(),
        country: Joi.string().required(),
        location: Joi.string().required(),
        filter: Joi.string().valid("Mountain", "Boats", "Domes", "Arctic", "Rooms", "Mountain Cities", "Castles", "Amazing Pools", "Camping", "Farms").required(),
        state: Joi.string().valid(
            "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", 
            "Chhattisgarh", "Goa", "Gujarat", "Haryana", 
            "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", 
            "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", 
            "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", 
            "Sikkim", "Tamil Nadu", "Telangana", "Tripura", 
            "Uttar Pradesh", "Uttarakhand", "West Bengal"
        ).required()
    }).required()
});


module.exports.reviewSchema=Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment:Joi.string().required()

    }).required()
})