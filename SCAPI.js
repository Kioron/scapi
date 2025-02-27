const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const pool = mysql.createPool({
    host: 'b5dip6jker9pcnf3utnu-mysql.services.clever-cloud.com',
    user: 'us4g92sotpxxbk9o',
    password: 'GDZEvbhGQfKyXAdIlss7',
    database: 'b5dip6jker9pcnf3utnu',
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0
});

app.get('/users', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM UserManagementtbl');
        res.json(rows);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).send(err);
    }
});

app.post('/users', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.Password, 10);
        const user = {
            UserName: req.body.UserName,
            Password: hashedPassword,
            UserEmail: req.body.UserEmail,
        };
        const [result] = await pool.query('INSERT INTO UserManagementtbl SET ?', user);
        console.log('User created successfully:', result);
        res.status(201).send('User created successfully');
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).send(err);
    }
});

app.post('/users/login', async (req, res) => {
    const { UserName, Password } = req.body;
    try {
        const [results] = await pool.query('SELECT * FROM UserManagementtbl WHERE UserName = ?', [UserName]);
        if (results.length === 0) {
            res.status(400).send('Cannot find user');
        } else {
            const user = results[0];
            if (await bcrypt.compare(Password, user.Password)) {
                console.log('Login successful for user:', UserName);
                res.send('Success');
            } else {
                console.log('Login failed for user:', UserName);
                res.send('Not Allowed');
            }
        }
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).send(err);
    }
});

//home-get-post
app.get('/homenewstbl', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM HomeNewstbl');
        res.json(rows);
    } catch (err) {
        console.error('Error fetching home news:', err);
        res.status(500).send(err);
    }
});

app.post('/homenewstbl', async (req, res) => {
    try {
        const news = {
            Title: req.body.Title,
            Content: req.body.Content,
        };
        const [result] = await pool.query('INSERT INTO HomeNewstbl SET ?', news);
        res.status(201).send('News created successfully');
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/homecommenttbl', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM HomeCommenttbl');
        res.json(rows);
    } catch (err) {
        console.error('Error fetching home comments:', err);
        res.status(500).send(err);
    }
});

app.post('/homecommenttbl', async (req, res) => {
    try {
        const comments = {
            Content: req.body.Content,
        };
        const [result] = await pool.query('INSERT INTO HomeCommenttbl SET ?', comments);
        res.status(201).send('Comment created successfully');
    } catch (err) {
        res.status(500).send(err);
    }
});

//police-get-post
app.get('/policenewstbl', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM PoliceNewstbl');
        res.json(rows);
    } catch (err) {
        console.error('Error fetching police news:', err);
        res.status(500).send(err);
    }
});

app.post('policenewstbl', async (req, res) => {
    try {
        const news = {
            Title: req.body.Title,
            Content: req.body.Content,
        };
        const [result] = await pool.query('INSERT INTO PoliceNewstbl SET ?', news);
        res.status(201).send('News created successfully');
    } catch(err) {
        res.status(500).send(err);
    }
})

app.get('/policecommenttbl', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM PoliceCommenttbl');
        res.json(rows);
    } catch (err) {
        console.error('Error fetching police comments:', err);
        res.status(500).send(err);
    }
});

app.post('/policecommenttbl', async (req, res) => {
    try {
        const comments = {
            Content: req.body.Content,
        };
        const [result] = await pool.query('INSERT INTO PoliceCommenttbl SET ?', comments);
        res.status(201).send('Comment created successfully');
    } catch (err) {
        res.status(500).send('Error creating comment');
    }
})

app.get('/policeannouncementtbl', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM PoliceAnnouncementtbl');
        res.json(rows);
    } catch (err) {
        console.error('Error fetching police announcements:', err);
        res.status(500).send(err);
    }
});

app.post('/policeannouncementtbl', async (req, res) => {
    try {
        const announcements = {
            Title: req.body.Title,
            Content: req.body.Content,
        };
        const [result] = await pool.query('INSERT INTO PoliceAnnouncementtbl SET ?', announcements);
        res.status(201).send('Announcement created successfully');
    } catch (err) {
        res.status(500).send('Error creating announcement');

    }
})

//ems-get-post
app.get('/emsnewstbl', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM EMSNewstbl');
        res.json(rows);
    } catch (err) {
        console.error('Error fetching EMS news:', err);
        res.status(500).send(err);
    }
});

app.post('/emsnewstbl', async (req, res) => {
    try {
        const news = {
            Title: req.body.Title,
            Content: req.body.Content,
        };
        const [result] = await pool.query('INSERT INTO EMSNewstbl SET ?', news);
        res.status(201).send('News created successfully');
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/emscommenttbl', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM EMSCommenttbl');
        res.json(rows);
    } catch (err) {
        console.error('Error fetching EMS comments:', err);
        res.status(500).send(err);
    }
});

app.post('/emscommenttbl', async (req, res) => {
    try {
        const comments = {
            Content: req.body.Content,
        }
        const [result] = await pool.query('INSERT INTO EMSCommenttbl SET ?', comments);
        res.status(201).send('Comment created successfully');
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/emsannouncementtbl', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM EMSAnnouncementtbl');
        res.json(rows);
    } catch (err) {
        console.error('Error fetching EMS announcements:', err);
        res.status(500).send(err);
    }
});

app.post('/emsannouncementtbl', async (req, res) => {
    try{
        const announcements = {
            Title: req.body.Title,
            Content: req.body.Content,
        }
        const [result] = await pool.query('INSERT INTO EMSAnnouncmenttbl SET ?', announcements);
        res.status(201).send('Announcement created successfully');
    } catch (err) {
        res.status(500).send(err);
    }
});

//mechanics-get-post
app.get('/mechanicsnewstbl', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM MechanicsNewstbl');
        res.json(rows);
    } catch (err) {
        console.error('Error fetching mechanics news:', err);
        res.status(500).send(err);
    }
});

app.post('/mechanicsnewstbl', async (req,res) => {
    try {
        const news = {
            Title: req.body.Title,
            Content: req.body.Content,
        }
        const [result] = await pool.query('INSERT INTO MechanicsNewstbl SET ?', news);
        res.status(201).send('News created successfully');
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/mechanicscommenttbl', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM MechanicsCommenttbl');
        res.json(rows);
    } catch (err) {
        console.error('Error fetching mechanics comments:', err);
        res.status(500).send(err);
    }
});

app.post('/mechanicscommenttbl', async (req, res) => {
    try {
        const comments = {
            Content: req.body.Content,
        }
        const [result] = await pool.query('INSERT INTO MechanicsCommenttbl SET ?', comments);
        res.status(201).send('Comment created successfully');
    } catch (err) {
        res.status(500).send(err);
    }
})

app.get('/mechanicsannouncementtbl', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM MechanicsAnnouncementtbl');
        res.json(rows);
    } catch (err) {
        console.error('Error fetching mechanics announcements:', err);
        res.status(500).send(err);
    }
});

app.post('/mechanicsannouncementtbl', async (req, res) => {
    try {
        const announcements = {
            Title: req.body.Title,
            Content: req.body.Content,
        }
        const [result] = await pool.query('INSERT INTO MechanicsAnnouncementtbl SET ?', announcements);
        res.status(201).send('Announcement created successfully');
    } catch (err) {
        res.status(500).send(err);
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

module.exports = app;