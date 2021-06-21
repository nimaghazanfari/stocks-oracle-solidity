import { useState, useEffect } from "react";
import axios from 'axios';
import { Col, Container, Row, Card, Button, Form, Alert } from "react-bootstrap";
import ContractHelper from './components/_ContractHelper';

let stocks;
function App() {

  const [name, setName] = useState('');
  const [alert, setAlert] = useState({});

  useEffect(() => {

    (async () => {
      const contracts = await ContractHelper.init();
      stocks = await contracts.Stocks.deployed();
    })()

  }, []);

  const saveDataCallback = () => {

    //call expressjs to fetch data into blockchain
    const url = `http://localhost:3300/query/${name}`;

    axios.get(url)
      .then(data => {

        showCustomAlert('success', data.data);

      }, err => {

        showCustomAlert('danger', err.response.data);

      })

  }

  const fetchDataCallback = () => {
    (async () => {
      const price = await stocks.getStockPrice(window.web3.utils.fromAscii(name));
      const volume = await stocks.getStockVolume(window.web3.utils.fromAscii(name));

      const message = `Price: ${toNumber(price)} /// Volume: ${toNumber(volume)}`;

      showCustomAlert('success', message);

    })();
  }

  const updateName = e => {
    const val = e.target.value;
    setName(val);
  }

  const showCustomAlert = (type, msg) => {
    setAlert({
      type: type,
      msg: msg
    });
    setTimeout(() => {
      setAlert({});
    }, 3000);
  }

  const CustomAlert = () => {
    return (
      alert.type ?
        <Alert variant={alert.type} >
          {alert.msg}
        </Alert> : null
    );
  }

  const toNumber = num => window.web3.utils.BN(num).toNumber();

  return (
    <Container>
      <Row className="m-5">
        <Col>
          <Card>
            <Card.Header>Get / Set</Card.Header>
            <Card.Body>
              <Card.Title>Enter any stock's name to fetch price and volume:</Card.Title>

              <Form.Group>
                <Form.Label>Stock's Name:</Form.Label>
                <Form.Control type="text" placeholder="Enter any name" onChange={e => updateName(e)} />
                <Form.Text className="text-muted">
                  Max 4 characters
                </Form.Text>
              </Form.Group>

              <Form.Group>
                <Button variant="success" type="button" onClick={saveDataCallback}>
                  Save Data
                </Button>

                <Button variant="info" type="button" className="m-lg-3" onClick={fetchDataCallback}>
                  Fetch Data (From Blockchain)
                </Button>
              </Form.Group>
            </Card.Body>
          </Card>

          <CustomAlert />
        </Col>
      </Row>
    </Container>
  );
}

export default App;
