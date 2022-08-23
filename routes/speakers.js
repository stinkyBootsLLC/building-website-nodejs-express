// get the modules
const express = require("express");
const createError = require('http-errors');
const router = express.Router();

module.exports = function (params) {

    const { speakerService } = params;

    router.get('/', async function (request, response, next) {
        try {
            const speakers = await speakerService.getList();
            const speakerArtwork = await speakerService.getArtworkForSpeaker();
            response.render("layout", { pageTitle: "Speakers", template: "speakers", speakers, speakerArtwork });
        } catch (error) {
            console.log(error);
            return next(createError(500, "Route Error"));

        }
    });

    router.get('/:shortname', async function (request, response, next) {
        try {
            const speaker = await speakerService.getSpeaker(request.params.shortname);
            const speakerArtwork = await speakerService.getArtworkForSpeaker(request.params.shortname);
            response.render("layout", { pageTitle: "Speakers", template: "speaker-details", speaker, speakerArtwork });
            // return response.send(`Details page of ${request.params.shortname}`);
        } catch (error) {
            console.log(error);
            return next(createError(500, "Route Error"));
        }
    });

    return router;
}; // end module.exports





