// get the modules
const express = require("express");
const createError = require('http-errors');
const router = express.Router();
const {check, validationResult} = require('express-validator');
// for express-validator
const validationRules = [
    check('name').trim().isLength({min: 3}).escape().withMessage('A name is required'),
    check('email').trim().isEmail().normalizeEmail().withMessage('A email is required'),
    check('name').trim().isLength({min: 3}).escape().withMessage('A name is required'),
    check('title').trim().isLength({min: 3}).escape().withMessage('A title is required'),
    check('message').trim().isLength({min: 5}).escape().withMessage('A message is required'),
];

module.exports = function(params){

    const {feedbackService} = params;

    router.get('/', async function(request, response, next){
      
        try {
            const feedbacks = await feedbackService.getList();
            const errors = request.session.feedback ? request.session.feedback.errors : false;
            const successMessage = request.session.feedback ? request.session.feedback.message : false;
            // reset the session
            request.session.feedback = {}; // blank obj 
            response.render("layout", {pageTitle: "Feedback", template: "feedback", feedbacks, errors, successMessage});
        } catch (error) {
            console.log(error);
            return next(createError(500, "Route Error"));
        }
    });

    router.post( '/', validationRules, async function(request, response, next){

        try {
            const errors = validationResult(request);
            if(!errors.isEmpty()){
                request.session.feedback = {
                    errors: errors.array(),
                };
                return response.redirect('/feedback');
            }
            // at this point the data is sanitized
            // declare
            const { name, email, title, message } = request.body;
            // method in class
            await feedbackService.addEntry(name, email, title, message);
            // success response message
            request.session.feedback = {message: 'Thank you for feedback'};
            // redirect on success or error
            return response.redirect('/feedback');
        } catch (error) {
            console.log(error);
            return next(createError(500, "Post Error"));
        }
    });

    router.post( '/api', validationRules, async function(request, response, next){

        try{
            const errors = validationResult(request);
            if(!errors.isEmpty()){
                return response.json({
                    errors: errors.array()
                });
            }
            // declare
            const { name, email, title, message } = request.body;
            // method in class
            await feedbackService.addEntry(name, email, title, message);
            const feedback = await feedbackService.getList();
            return response.json({feedback});
        } catch (error){
            console.log(error);
            return next(createError(500, "API POST Error"));
        }
       
    });

    return router;
};





 