const config =  require('config');
const debug = require('debug')('app:startup');
const Joi = require('joi');
const helmet = require('helmet');
const morgan = require('morgan');
const logger = require('./middleware/logger');
const authennticator = require('./middleware/authendicator');
const home = require('./routes/home');
const courses = require('./routes/courses');
const express = require('express');
const app = express();

// Templating engine
app.set('view engine', 'pug');
app.set('views', './views');

//***** Built-in middleware
app.use(express.json());

// with this a request with key-value pair can be sent (example: in postman)
app.use(express.urlencoded({ extended: true}));

// serves all static content of the application which are in public folder. They can be accessed from the root of the app. (example: localhost:2000/readme.txt)
app.use(express.static('public'));

//***** Custom middlewares
app.use(logger);
app.use(authennticator);
app.use('/api/courses', courses);
app.use('/', home);

//***** Third-party middlewares
// Help secure Express/Connect apps with various HTTP headers
app.use(helmet());

// Configuration
console.log(`Environment: ${app.get('env')}`);
console.log(`Mail Server: ${config.get('mail.host')}`);
console.log(`Password: ${config.get('mail.password')}`);

if(app.get('env') === 'development') {
    //HTTP request logger middleware for node.js
    app.use(morgan('tiny'));
    debug('Morgan enabled...');
}

function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(course, schema);
}

const port = process.env.PORT || 2000;

app.listen(port, ()=> console.log(`Listening on port ${port}...`));