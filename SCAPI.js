const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

app.use(express.json())

app.use(cors());

const connection = mysql.createConnection({
    host: 'b5dip6jker9pcnf3utnu-mysql.services.clever-cloud.com',
    user: 'us4g92sotpxxbk9o',
    password: 'GDZEvbhGQfKyXAdIlss7',
    database: 'b5dip6jker9pcnf3utnu'
  });

  connection.connect((err) => {
    if (err) {
      console.error('Connection failed:', err);
      return;
    }
    console.log('Connected to MySQL database!');
  });

  app.get('/users', (req, res) => {
    connection.query('SELECT * FROM b5dip6jker9pcnf3utnu.UserManagementtbl', (err, users) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(users);
      }
    });
  });

  app.post('/users', async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.Password, 10);
      const user = {
          UserName: req.body.UserName,
          Password: hashedPassword,
          UserEmail: req.body.UserEmail,
      };
      connection.query('INSERT INTO UserManagementtbl SET ?', user, (err, result) => {
          if (err) {
            console.error('Error inserting user:', err);
              res.status(500).send(err);
          } else {
            console.log('User created successfully:', result);
              res.status(201).send('User created successfully');
          }
      });
  } catch (err) {
    console.error('Error registering user:', err);
      res.status(500).send(err);
  }
});

  app.post('/users/login', async (req, res) => {
    const { UserName, Password } = req.body;
    connection.query('SELECT * FROM UserManagementtbl WHERE UserName = ?', [UserName], async (err, results) => {
      if (err) {
          console.error('Error fetching user:', err);
          res.status(500).send(err);
      } else if (results.length === 0) {
          res.status(400).send('Cannot find user');
      } else {
          const user = results[0];
          try {
              if (await bcrypt.compare(Password, user.Password)) {
                  console.log('Login successful for user:', UserName);
                  res.send('Success');
              } else {
                  console.log('Login failed for user:', UserName);
                  res.send('Not Allowed');
              }
          } catch (err) {
              res.status(500).send(err);
          }
      }
  });
});

app.listen(port, () => {
   console.log(`Server running on http://localhost:${port}/users`);
});

module.exports = app;