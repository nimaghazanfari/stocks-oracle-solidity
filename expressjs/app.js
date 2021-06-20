const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const express = require('express');
const axios = require('axios');
const fs = require('fs');
const Web3 = require('web3');
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

const pathToAbi = path.resolve('../blockchain/build/contracts/Stocks.json');
//default ganache-cli setup
const web3 = new Web3('http://localhost:8545');

const getContract = () => {
    const artifact = fs.readFileSync(pathToAbi, 'utf-8');

    const json = JSON.parse(artifact);
    const networks = json.networks;
    const addresss = networks[Object.keys(networks)[0]].address;

    const contract = new web3.eth.Contract(json.abi, addresss);

    return contract;
}

const getOwner = async () => {
    const [owner] = await web3.eth.getAccounts();
    return owner;
}

//express endpoints
app.get('/get-stocks-abi', (req, res) => {
    res.header("Content-Type", 'application/json');
    res.sendFile(pathToAbi);
});

app.get('/query/:what', async (req, res) => {
    res.header("Content-Type", 'application/json');
    const symbol = req.params.what;
    
    if (symbol.length > 4) {
        res.status(400).send('Invalid Length!');
        return;
    }

    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=KEY`;

    const result = await axios.get(url);

    if (result.data && result.data["Global Quote"]) {

        const price = parseInt(result.data["Global Quote"]["05. price"]);
        const volume = parseInt(result.data["Global Quote"]["06. volume"]);

        if (isNaN(price) || isNaN(volume)) {
            res.status(400).send('Invalid Request!');
            return;
        }

        const owner = await getOwner();
        const contract = getContract();

        try {
            //set price on each request into blockchain
            await contract.methods.setStock(web3.utils.fromAscii(symbol), price, volume).send({ from: owner });

            res.send('Query Done!');
        } catch (error) {
            console.log(error);
            res.status(400).send('Error Happened!');
        }
    }
    else res.status(400).send('Empty Result!');
});