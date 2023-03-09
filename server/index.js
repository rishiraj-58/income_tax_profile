const express = require('express');
const mysql = require('mysql');
const validatePhoneNumber = require('validate-phone-number-node-js');
const aadhaarValidator = require('aadhaar-validator');
const cors = require("cors");

// create express app
const app = express();

app.use(cors());
// use express json middleware
app.use(express.json());

// create MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'taxcalculator',
  port: 3307
});

// connect to MySQL
connection.connect((err) => {
  if (err) {
    console.log('Error connecting to MySQL database: ' + err.message);
    return;
  }
  console.log('Connected to MySQL database!');
});

// function to validate phone number
function validatePhoneNumbers(phoneNumber) {
    const result = validatePhoneNumber.validate(phoneNumber);
    return result
}

// function to validate PAN number
function validatePANNumber(panNumber) {
  const regex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;
  return regex.test(panNumber);
}

// function to validate Aadhaar number
function validateAadhaarNumber(aadhaarNumber) {
  return aadhaarValidator.isValidNumber(aadhaarNumber);
}

// insert record into MySQL
app.post('/users', (req, res) => {
  const { name, age, phone_number, pan_number, aadhaar_number, state } = req.body;

  // validate phone number, PAN number, and Aadhaar number
  if (!validatePhoneNumbers(phone_number)) {
    return res.status(400).json({ error: 'Invalid phone number!' });
  }

  if (!validatePANNumber(pan_number)) {
    return res.status(400).json({ error: 'Invalid PAN number!' });
  }

  if (!validateAadhaarNumber(aadhaar_number)) {
    return res.status(400).json({ error: 'Invalid Aadhaar number!' });
  }

  // insert record into MySQL
  const sql = 'INSERT INTO Profile (name, age, phone_number, pan_number, aadhaar_number, state) VALUES (?, ?, ?, ?, ?, ?)';
  connection.query(sql, [name, age, phone_number, pan_number, aadhaar_number, state], (err, result) => {
    if (err) {
      console.log('Error inserting record into MySQL: ' + err.message);
      return res.status(500).json({ error: 'Error inserting record into MySQL!' });
    }
    console.log('Record inserted into MySQL successfully!');
    return res.status(200).json({ message: 'Record inserted into MySQL successfully!' });
  });
});

// update record in MySQL
app.put('/users/:id', (req, res) => {
    const id = req.params.id;
    const { name, age, phone_number, pan_number, aadhaar_number, state } = req.body;
  
    // validate phone number, PAN number, and Aadhaar number
    if (!validatePhoneNumber(phone_number)) {
      return res.status(400).json({ error: 'Invalid phone number!' });
    }
  
    if (!validatePANNumber(pan_number)) {
      return res.status(400).json({ error: 'Invalid PAN number!' });
    }
  
    if (!validateAadhaarNumber(aadhaar_number)) {
      return res.status(400).json({ error: 'Invalid Aadhaar number!' });
    }
  
    // update record in MySQL
    const sql = 'UPDATE Profile SET name = ?, age = ?, phone_number = ?, pan_number = ?, aadhaar_number = ?, state = ? WHERE id = ?';
    connection.query(sql, [name, age, phone_number, pan_number, aadhaar_number, state, id], (err, result) => {
      if (err) {
        console.log('Error updating record in MySQL: ' + err.message);
        return res.status(500).json({ error: 'Error updating record in MySQL!' });
      }
      console.log('Record updated in MySQL successfully!');
      return res.status(200).json({ message: 'Record updated in MySQL successfully!' });
    });
  });
  
  // delete record from MySQL
  app.delete('/users/:id', (req, res) => {
    const id = req.params.id;
  
    // delete record from MySQL
    const sql = 'DELETE FROM Profile WHERE id = ?';
    connection.query(sql, [id], (err, result) => {
      if (err) {
        console.log('Error deleting record from MySQL: ' + err.message);
        return res.status(500).json({ error: 'Error deleting record from MySQL!' });
      }
      console.log('Record deleted from MySQL successfully!');
      return res.status(200).json({ message: 'Record deleted from MySQL successfully!' });
    });
  });
  
  // start server
  app.listen(3300, () => {
    console.log('Server started on port 3300!');
  });
  
