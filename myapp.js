'use strict'
const express = require('express')
var bodyParser = require('body-parser')
var AWS=require('aws-sdk'),
    decodedBinarySecret,
    secretName = "arn:aws:secretsmanager:us-east-1:738101073940:secret:ProductionDB-giBfnN",
    secret;

const KEY_ID= "ASIA2XWSATAKD4R77G7J"; 
const SECRET_KEY="0308dYVcBPwwUxRhLyfkAysmq8X0T5SmLVmreSuA";
const TOKEN="FwoGZXIvYXdzECAaDIaU1pfEWQZDhfDNliLAAYSzHBGCeESfUcAYZ0zwe0rbWgSfll1hrWLGTE57/B+oVpTUxJOIwPiQaZSGpe4DXQEEh2cj+dYYdDMVqn3oNo47yDz6jhbkajBusaAjqAslMdzlBnY04OaSnAVRjS8cFAuH330npt3VKMTBBBDQM2q1M6te6cqVv4CNgP9ZAk5D2/eQH9YETqlima6+f57RKu9vSKdEVsDVzZweqj4PrBg+cqVpIzw61OTP7Bpa4SSiJNYzlQg7fwwvVFS7pwhKvyion/6RBjItmafbYLci5Np8dxVr47pdHS+Pr1HL7pkDg16KGmTmkmKyAHyS3fJXRdb4stqr";

// to retrieve secret from the secret manager, code is taken from https://us-east-1.console.aws.amazon.com/secretsmanager/home?region=us-east-1#!/secret?name=ProductionDB

// Create a Secrets Manager client
var client = new AWS.SecretsManager({
    accessKeyId:KEY_ID,
    secretAccessKey: SECRET_KEY,
    sessionToken:TOKEN,
    region:"us-east-1",
});

var user;
var password;

client.getSecretValue({SecretId: secretName}, function(err, data) {
    
    if (err) {
        if (err.code === 'DecryptionFailureException')
            // Secrets Manager can't decrypt the protected secret text using the provided KMS key.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw err;
        else if (err.code === 'InternalServiceErrorException')
            // An error occurred on the server side.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw err;
        else if (err.code === 'InvalidParameterException')
            // You provided an invalid value for a parameter.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw err;
        else if (err.code === 'InvalidRequestException')
            // You provided a parameter value that is not valid for the current state of the resource.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw err;
        else if (err.code === 'ResourceNotFoundException')
            // We can't find the resource that you asked for.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw err;
    }
    else {
        // Decrypts secret using the associated KMS key.
        // Depending on whether the secret is a string or binary, one of these fields will be populated.
        if ('SecretString' in data) {
            //secret = JSON.parse(data.SecretString);
            secret = data.SecretString;
        } else {
            let buff = new Buffer(data.SecretBinary, 'base64');
            decodedBinarySecret = buff.toString('ascii');
        }
    }
   
   
});


// Constants
const PORT = 3000

// App
const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


var mysql = require('mysql');
var connection;

 

app.post('/storestudent', async (req, res) => {
  connection = mysql.createConnection({
    host     : 'database-b00884335-instance-1.cgnewppeezrp.us-east-1.rds.amazonaws.com',
    port     : '3306',
    user     :  JSON.parse(secret)['DBUsername'],
    password :  JSON.parse(secret)['DBPassword']
    
  })
  
  console.log(req.body)
  let stmt = `INSERT INTO students.students(first_name,last_name,banner) VALUES ? `
  let values = []
  req.body?.students.map((student) => {
    values.push([student.first_name, student.last_name, student.banner])
  })

 
  connection.query(stmt, [values], (err, results, fields) => {
    if (err) {
      return res.status(400).send(err.message)
    }

    const message = {
      message: 'data inserted successfully into student table',
    }
    return res.status(200).send(message)
  })
})

app.get('/liststudents',async (req, res) => {
  connection.query('SELECT * FROM students.students', (err, rows) => {
    if (err) {
      return res.status(400).send(err.message)
    }

    const ListResponse = rows.map((stundet) => {
      return `<tr>
      <td>${stundet.first_name}</td>
      <td>${stundet.last_name}</td>
      <td>${stundet.banner}</td>
    </tr>`
    })

    const Response = `
    <!DOCTYPE html>
    <html>
    <head>
    
    <body>
    
    <h1>Student Table</h2>
    
    <table>
      <tr>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Banner ID</th>
      </tr>
      ${ListResponse}
    </table>
    
    </body>
    </html>`

    res.send(Response)
  })
})
    
app.listen(PORT)
console.log(`Running on ${PORT}`)