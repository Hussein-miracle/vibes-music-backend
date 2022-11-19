// importing the dependencies
require('dotenv').config();
const PORT = process.env.PORT || 5000;
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const root = require('rootrequire');
const YTMusicAPI = require(root+'/helpers/yt_api');
const yt_api = new YTMusicAPI();



// defining the Express app
const app = express();

app.use((req,res,next) => {
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Methods","GET,PUT,PATCH,DELETE,POST,OPTIONS,DELETE");
    // res.setHeader("Access-Control-Allow-Headers","Content-Type,Authorizations");

    if(req.method === "OPTIONS"){
        return res.sendStatus(200);
    }

    next()
})

// function to initialize the yt_api on every api request
async function init_api(req, res, next){
    await yt_api.init();
    next();
};

// call on every request to keep the yt_api fresh
app.use(init_api);

// adding Helmet to enhance your API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
// app.use(bodyParser.json());
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));


// Routes
app.get('/', async (req, res) => {
    res.status(200).json({res:'Hello World!'});
});

app.get('/search', async (req, res) => {
    const searchText = req.body.searchText;
    // console.log(searchText);
    const results = await yt_api.search(searchText);
    console.log(results , "reuslts content");
    res.status(200).json({results});
});

app.get('/song/:id', async (req, res) => {
    const Id = req.body.id;
    const results = await yt_api.getSong(Id);
    res.status(200).json({data:results});
});

app.get('/album/:id', async (req, res) => {
    const results = await yt_api.getAlbum(req);
    res.send(results);
});

app.get('/playlist/:id', async (req, res) => {
    const results = await yt_api.getPlaylist(req);
    res.send(results);
});

app.get('/artist/:id', async (req, res) => {
    const results = await yt_api.getArtist(req);
    res.send(results);
});

// starting the server
app.listen(PORT, () => {
    console.log('listening on port ' + PORT);
});