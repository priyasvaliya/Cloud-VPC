'use strict'
const express = require('express')
var bodyParser = require('body-parser')
const axios = require('axios')
const { response } = require('express')
var AWS=require('aws-sdk'),
    secretName = "arn:aws:secretsmanager:us-east-1:738101073940:secret:ProductionDB-giBfnN",
    secret,
    decodedBinarySecret;

const KEY_ID= "ASIA2XWSATAKHHGWD7EJ"; 
const SECRET_KEY="nlJ6gewfLZuRFF14FlzykG0gEqjMqpGcpkGE1clP";
const TOKEN="FwoGZXIvYXdzENT//////////wEaDLq8Qk+O9rC8NDExCCLAAZQ9lTAqAeww0i/SpmTVNCWLDH0kC1mFkJz6+3bhA4STOWHY9g2qftnNW6zDLQZhVuEWvtpp3nRQaP6nVhOF2I57iTMJ1g/14eT+zj/U2MyOJq6czzZhrqrEvgWH8XMsQUwIzoeXeFJPXJqnl10aNz8/95a/vZdVlkpdjDEfN00/M/s0YCjQVA7mMckkL70BwUOpxSYhUulZlHdzYqf5bE/djJHqQ5gl7dQ2pOCanz+mhGC9+lfF1DbXi/967KEqPyj6xu2RBjItBnI8f3rqdwIaHMe1p6lGO3QpfYF0QvnCurfWacWEQdYpJKuG8DonZSwkVZnk";

// Load the AWS SDK

// Create a Secrets Manager client
var client = new AWS.SecretsManager({
    accessKeyId:KEY_ID,
    secretAccessKey: SECRET_KEY,
    sessionToken:TOKEN,
    region:"us-east-1",
});

// In this sample we only handle the specific exceptions for the 'GetSecretValue' API.
// See https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
// We rethrow the exception by default.

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
            secret = data.SecretString;
            
    
        } else {
            let buff = new Buffer(data.SecretBinary, 'base64');
            decodedBinarySecret = buff.toString('ascii');
        }
    }

    console.log(secret)
    // Your code goes here. 
});
