// get the modules
const express = require("express");
const path = require('path');
const cookieSession = require('cookie-session');
const createError = require('http-errors');
const bodyParser = require('body-parser');
const routes = require('./routes');
const FeedbackService = require('./services/FeedbackService'); // this is the class
const SpeakerService = require('./services/SpeakerService'); // this is the class
// create the instance
const feedbackService = new FeedbackService('./data/feedback.json');// this is instance of the class
const speakerService = new SpeakerService('./data/speakers.json');// this is instance of the class
const app = express();
const port = 3000; 

// EJS is a simple templating language that lets you generate 
// HTML markup with plain JavaScript
app.set("view engine", "ejs"); 
app.set("views", path.join(__dirname, './views'));

// locals are globals and can be used in the ejs files
app.locals.siteName = "ROUX Meetups";
// this make express cookies that are passed thru a reversed proxy such as apache or ngnx
app.set("trust proxy", 1);
// session cookie
app.use(cookieSession({
    name: "session",
    keys: ["12345","klasjdlfjasldjflasdjf"]
}));

app.use(bodyParser.urlencoded({ extended: true}));
// for the API
app.use(bodyParser.json());

/**
 * app.use([path,] callback [, callback...])
 * Mounts the specified middleware function or functions at the specified path: 
 * the middleware function is executed when the base of the requested path matches path.
 * needed to serve up all the static files in the static folders 
 * see the folder structure
 */
app.use(express.static(path.join(__dirname, './static')));

app.use(async function(request, response, next){
 
    try {
        const names = await speakerService.getList();
        response.locals.speakerNames = names;
        return next();
    } catch (error){
        console.log(error);
        return next(createError(500, "Server Error"));
    }
    
});

app.use('/', routes({
    feedbackService,  
    speakerService,
}));

//must be last - IF no other route is matched  THEN
app.use(function(request, response, next){
    return next(createError(404, "File Not Found"));
});

// error handling middleware
app.use(function(error, request, response, next){
    console.error(error);
    response.locals.message = error.message;
    let statusCode = error.status || 500
    response.locals.status = statusCode;
    response.status(statusCode);
    response.render('error');// here we are rendering error.ejs  use single quotes only
});
/**
 * app.listen(path, [callback])
 * Binds and listens for connections on the specified host and port. 
 * This method is identical to Node’s http.Server.listen().
 */
app.listen(port, function(){
    console.log(`Node JS server has started and listening on port ${port}`)
});

// to start this project type "node server.js" which will start this file which is the server