// get the modules
const express = require("express");
const createError = require('http-errors');
const speakersRoute = require("./speakers");
const feedbackRoute = require("./feedback");
const router = express.Router();

module.exports = function(params){

    const {speakerService} = params;

    router.get('/', async function(request, response, next){
        try {
            const topSpeakers = await speakerService.getList();
            const speakerArtwork = await speakerService.getArtworkForSpeaker();
            response.render("layout", {pageTitle: "Welcome", template: "index", topSpeakers, speakerArtwork});
        } catch (error) {
            console.log(error);
            return next(createError(500, "Route Error"));
        }
    });

    router.use("/speakers", speakersRoute(params));
    router.use("/feedback", feedbackRoute(params));
    
    return router;
}; // end module.exports





 