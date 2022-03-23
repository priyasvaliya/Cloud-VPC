'use strict'
const express = require('express')
var bodyParser = require('body-parser')
const AWS=require('aws-sdk');
const KEY_ID= "ASIA2XWSATAKGHDCKUYE"; 
const SECRET_KEY="JybrEc++y19d43lBRT4qxdKseRSrcLin8l80le/r";
const TOKEN="FwoGZXIvYXdzEM7//////////wEaDFyGXZDyms7pUDWagyLAASp0cyTXLY6UEXZ4vaZNFLYbLAct1/CZzqPSgyvkZV1/hk6dhFP9SF8iHAOFfyenodzrF1UiOGWeAYbf7e4VJd2QZI23tg+8MHG/0ybT+f/ASwYZ2icpF8FBmz3Z9cK560wFQ4ajIgVSORuYkfMFwFJYxMl7JsdM82qujcJkFnB+X2TkDHCCpJS3nW2CTt/+SBrO6OHhgyYcg0hxI/vwpRA5V20/PMOGkvE79dmAbkwIPuiKrpIv0SVSzoSmi9wq8yjCsuyRBjIt2WEkkL/NIgtQ+VR7A8b2PObEybXUj4XR4EiRyzq3OGpt1MfFjQz/L3EXnRxB";
const s3= new AWS.S3({  
    accessKeyId:KEY_ID,
    secretAccessKey: SECRET_KEY,
    sessionToken:TOKEN,
    region:"us-east-1"
});




// Constants
const PORT = 3000

// App
const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const uploadFile = (response) => {
   
       
    
  };

// Use this code snippet in your app.
// If you need more information about configurations or implementing the sample code, visit the AWS docs:
// https://aws.amazon.com/developers/getting-started/nodejs/

// Load the AWS SDK


var mysql = require('mysql');

const connection = mysql.createConnection({
  host     : 'database-1-instance-1.cgnewppeezrp.us-east-1.rds.amazonaws.com',
  port     : '3306',
  user     : 'admin',
  password : 'Pr7504.sav',
  
})

connection.connect(err=>{

  if(err){
    console.log(err.message)
    return;
  }
  console.log("connected")
})

app.post('/storestudent', async (req, res) => {
  console.log(req.body)
  let stmt = `INSERT INTO student.students(first_name,last_name,banner) VALUES ? `
  let values = []
  req.body?.students.map((student) => {
    values.push([student.first_name, student.last_name, student.banner])
  })

 
  connection.query(stmt, [values], (err, results, fields) => {
    if (err) {
      return res.status(400).send(err.message)
    }

    const message = {
      message: 'data inserted successfully',
    }
    return res.status(200).send(message)
  })
})

app.get('/liststudents',async (req, res) => {
  connection.query('SELECT * FROM student.students', (err, rows) => {
    if (err) {
      return res.status(400).send(err.message)
    }

    const htmlListResponse = rows.map((stundet) => {
      return `<tr>
      <td>${stundet.first_name}</td>
      <td>${stundet.last_name}</td>
      <td>${stundet.banner}</td>
    </tr>`
    })

    const htmlResponse = `
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
      ${htmlListResponse}
    </table>
    
    </body>
    </html>`

    res.send(htmlResponse)
  })
})
  

    
app.listen(PORT)
console.log(`Running on ${PORT}`)