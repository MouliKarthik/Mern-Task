const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
require('dotenv').config();
const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');


const app = express();


app.use(bodyParser.json());

const swaggerDocument = YAML.load(path.join(__dirname, './api-docs.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/uploads/images',express.static(path.join('uploads', 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

    next();
})

app.use('/api/places/',placesRoutes);
app.use('/api/users/',usersRoutes);

app.use((req, res, next) => {
    const error = new HttpError('Could not found the route',404);
    throw error;
})

app.use((error,req,res,next)=>{
    if(req.file){
        fs.unlink(req.file.path,(err)=>{
            console.log(err);
        });
    }
    if(res.headerSent){
        return next(error);
    }
    res.status(error.statusCode||500);
    res.json({message:error.message || 'An  Unknown error occurred'});
});
mongoose.connect(`mongodb+srv://smoulikarthik:${process.env.DB_PASSWORD}@cluster0.y92vknd.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`)
    .then(()=>{
        console.log('connections started');
        app.listen(5000);
    })
    .catch((error)=>{
        console.log(error);
    });

