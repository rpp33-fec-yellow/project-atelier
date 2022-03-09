const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const port = 3000;
const { API_URL, API_KEY } = require('./config.js');

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client/dist')));

app.all('/*', (req, res) => {

  const apiPaths = ['/products', '/reviews', '/qa', '/cart', '/interactions'];

  let isApiPath = apiPaths.some(apiPath => req.url.startsWith(apiPath));

  if (isApiPath) {
    axios({
      headers: { 'Authorization': API_KEY },
      baseURL: API_URL,
      url: req.url,
      method: req.method,
      data: req.body
    })
      .then((apiResponse) => {
        res.send({
          data: apiResponse.data,
          status: apiResponse.status
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(404).send('Product not found');
      });

  } else {
    let productID = req.url.substring(1);
    res.redirect(`/?${productID}`);
  }
});

app.listen(port, ()=> {
  console.log(`Listening at localhost:${port}`);
});