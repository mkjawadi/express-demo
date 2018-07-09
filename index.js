const config =  require('config');
const Joi = require('joi');
const helmet = require('helmet');
const morgan = require('morgan');
const logger = require('./logger');
const authennticator = require('./authendicator');
const express = require('express');
const app = express();

//***** Built-in middleware
app.use(express.json());

// with this a request with key-value pair can be sent (example: in postman)
app.use(express.urlencoded({ extended: true}));

// serves all static content of the application which are in public folder. They can be accessed from the root of the app. (example: localhost:2000/readme.txt)
app.use(express.static('public'));

//***** Custom middlewares
app.use(logger);
app.use(authennticator);

//***** Third-party middlewares
// Help secure Express/Connect apps with various HTTP headers
app.use(helmet());

console.log(`Environment: ${app.get('env')}`);
console.log(`Mail Server: ${config.get('mail.host')}`);
console.log(`Password: ${config.get('mail.password')}`);

if(app.get('env') === 'development') {
    //HTTP request logger middleware for node.js
    app.use(morgan('tiny'));
    console.log('Morgan enabled...');
}



const courses=[
{ id:1, name: 'course1'},
{ id:2, name: 'course2'},
{ id:3, name: 'course3'}
];

function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(course, schema);
}

app.get('/', (req, res) => {
    res.send('Hello world');
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c=> c.id === parseInt(req.params.id));
    if(!course) res.status(404).send('The course with the given ID was not found.');

    res.send(course);
    
    // Printing id's value
    // res.send(req.params.id);

    // Printing prams object
    // res.send(req.params);

    // Printing query strings
    // res.send(req.query);

});

app.post('/api/courses', (req, res)=> {
    // no need for result.error
    const { error } = validateCourse(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req, res)=> {
    const course = courses.find(c=> c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('The course with the given ID was not found.');

    // no need for result.error
    const { error } = validateCourse(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    course.name = req.body.name;
    res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found.');
  
    const index = courses.indexOf(course);
    courses.splice(index, 1);
  
    res.send(course);
  });

const port = process.env.PORT || 2000;

app.listen(port, ()=> console.log(`Listening on port ${port}...`));