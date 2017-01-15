'use strict';

const express = require('express');

// Constants
const PORT = 8080;

// App
const app = express();

//Couchbase
var couchbase = require('couchbase')
var cluster = new couchbase.Cluster('couchbase://ec2-54-202-147-230.us-west-2.compute.amazonaws.com/');
var bucket = cluster.openBucket('default');
var N1qlQuery = couchbase.N1qlQuery;


app.get('/', function (req, res) {
  res.send('Middleware server is running on port \n' + PORT);
});

app.get('/login', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify('{\"success\": true,\"payload\":{user:madhu}} \n'));
});

app.get('/couchbase/getorupdate/:id', function (req, res) {
var id = req.params.id;
var key = 'key' + id;
var grows;
bucket.manager().createPrimaryIndex(function() {
    bucket.upsert(key, {
            'email': 'madhu.prakasan@emirates.com' + id, 'interests': ['Holy Grail' + id, 'African Swallows']
        },
        function (err, result) {
            bucket.get(key, function (err, result) {				
                console.log('Got result: %j', result.value);	
					
                bucket.query(
                    N1qlQuery.fromString('SELECT * FROM default WHERE $1 in interests LIMIT 100'),
                    ['African Swallows'],
                    function (err, rows) {
                        console.log("Got rows: %j", rows);			
						grows = rows;						
                    });
					
					res.setHeader('Content-Type', 'application/json');
					res.send(JSON.stringify(result.value));
            });
        });
});

});

app.get('/couchbase/keys', function (req, res) {
          
					
                bucket.query(
                    N1qlQuery.fromString('SELECT * FROM default WHERE $1 in interests LIMIT 100'),
                    ['African Swallows'],
                    function (err, rows) {
                        console.log("Got rows: %j", rows);			
						res.setHeader('Content-Type', 'application/json');
						res.send(JSON.stringify(rows));					
                    });
					
				
         
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
