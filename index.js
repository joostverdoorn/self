require('datejs');

const jsonld = require('jsonld');
const mongodb = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const tempio = require('tempio');

const MONGODB_URI = "mongodb://localhost:27017/self"

const server = express();

server.use(cors());

server.use(bodyParser.json());

function toDateRange(date, delta = Date.now() - date) {
  console.log(date, delta);
  return [new Date(date - delta/2), new Date(date + delta/2)];
}

mongodb.connect(MONGODB_URI).then(db => {

  console.log('connected');
  const collection = db.collection('self');

  server.post('/', (request, response, next) => {
    collection.save(request.body).then(() => {
      response.json({
        'ok': 'sure!'
      });
    }).catch(error => {
      response.status(400).json(error);
    });
  });

  server.get('/', (request, response, next) => {
    const { query } = request.query;
    const date = tempio(query);
    const [from, to] = toDateRange(date);


    // collection.find({}).toArray().then

    const x = {
      dateCreated: {
        $gte: from.toISOString(),
        $lt: to.toISOString()
      }
    };

    console.log(x);

    collection.find(x, (err, results) => {
      if (err) return console.error(err);
      results.toArray().then(arr => response.send(arr));
    });
  });
}).catch(err => {
  console.error(error);
});


server.listen(3000);
console.log('started');

// const doc = {
//   "http://schema.org/device": "omikron",
//   "http://schema.org/dateCreated": "2016-06-21T02:37:59",
//   "http://schema.org/about": {"@id": "https://github.com/digitalbazaar/jsonld.js"}
// };
