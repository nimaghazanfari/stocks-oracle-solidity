const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const express = require('express');
const axios = require('axios');
const app = express();
const httpServer = require('http').createServer(app);

app.set('views', path.join(__dirname, 'views'));

//middlewares
app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = 3300;

httpServer.listen(port, () => {
    console.log('Listening to port:', port);
});

//express endpoints

const pathToAbi = path.resolve('../blockchain/build/contracts/Stocks.json');

//this will get the api for Stocks contract
app.get('/get-stocks-abi', (req, res) => {
    res.header("Content-Type", 'application/json');
    res.sendFile(pathToAbi);
});

app.get('/query/:what', async (req, res) => {
    res.header("Content-Type", 'application/json');
    const symbol = req.params.what;
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=KEY`;

    const result = await axios.get(url);
    res.send('Query Done!');
});