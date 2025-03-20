const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'restricted'));

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'restricted')));

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

const jwtSecret = '4a20ab747d6e0e2afa9a5486ddc279d8d61b4dbd399c9c49ac24d1958082633799478a43d9b74c84f4f610fd8f7855126417cfa809d06d718c4a4d9f80063110';

app.post('/users/login', async (req, res) => {
    const { UserName, Password } = req.body;
    try {
        const [results] = await pool.query('SELECT * FROM UserManagementtbl WHERE UserName = ?', [UserName]);
        if (results.length === 0) {
            res.status(400).json('Cannot find user');
        } else {
            const user = results[0];
            if (await bcrypt.compare(Password, user.Password)) {
                const token = jwt.sign({ id: user.id, username: user.UserName, role: user.Role }, jwtSecret, { expiresIn: '24h' });
                console.log('Login successful, sending token:', token);
                res.json({ token });
            } else {
                res.status(401).json('Not Allowed');
            }
        }
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).json(err);
    }
});

// app.post('/users/refresh-token', verifyToken, (req, res) => {
//     const { id, username, role } = req.user;
//     const newToken = jwt.sign({ id, username, role }, jwtSecret, { expiresIn: '1h' });
//     res.json({ token: newToken });
// });

//token verification middleware
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        console.log('Token is required');
        return res.status(403).send('Token is required');
    }

    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            console.log('Invalid token:', err);
            return res.status(401).send('Invalid token');
        }
        req.user = decoded;
        console.log('Decoded token:', decoded);
        next();
    });
};

const verifyRole = (requiredRoles) => {
    return (req, res, next) => {
        if (!requiredRoles.includes(req.user.role)) {
            console.log('Access denied: User role is not in the required roles');
            return (res.status(403).send('You are not allowed to access this resource'));
        }
        console.log('Access granted: User role is in the required roles');
        next();
    };
};

//home-get-post

// app.get('/homenewstbl', async (req, res) => {
//     try {
//         const [rows] = await pool.query('SELECT * FROM HomeNewstbl');
//         res.json(rows);
//     } catch (err) {
//         console.error('Error fetching home news:', err);
//         res.status(500).send(err);
//     }
// });

app.get('/homenewstbl', async (req, res) => {
    let { page = 1, limit = 5 } = req.query; // Default to page 1 and 5 items per page

    // Convert page and limit to integers and validate them
    page = parseInt(page);
    limit = parseInt(limit);
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 5;

    const offset = (page - 1) * limit; // Calculate the offset for SQL query

    try {
        // Fetch the paginated news
        const [rows] = await pool.query(
            'SELECT * FROM HomeNewstbl ORDER BY created_at DESC LIMIT ? OFFSET ?',
            [limit, offset]
        );

        // Fetch the total count of news
        const [totalRows] = await pool.query('SELECT COUNT(*) as total FROM HomeNewstbl');
        const total = totalRows[0].total;

        // Determine if there are more rows to load
        const hasMore = offset + rows.length < total;

        // Send the paginated news along with the "hasMore" flag
        res.json({ news: rows, hasMore });
    } catch (err) {
        console.error('Error fetching home news:', err);
        res.status(500).send('Error fetching home news');
    }
});

app.post('/homenewstbl', verifyToken, verifyRole(['Owner']), async (req, res) => {
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

app.post('/homecommenttbl', verifyToken, async (req, res) => {
    try {
        const comments = {
            UserName: req.body.UserName,
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

app.post('/policenewstbl', verifyToken, verifyRole(['Owner', 'Police Chief']), async (req, res) => {
    try {
        const news = {
            Title: req.body.Title,
            Content: req.body.Content,
        };
        const [result] = await pool.query('INSERT INTO PoliceNewstbl SET ?', news);
        res.status(201).send('News created successfully');
    } catch (err) {
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

app.post('/policecommenttbl', verifyToken, async (req, res) => {
    try {
        const comments = {
            UserName: req.body.UserName,
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

app.post('/policeannouncementtbl', verifyToken, verifyRole(['Owner', 'Police Chief']), async (req, res) => {
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
});

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

app.post('/emsnewstbl', verifyToken, verifyRole(['Owner', 'EMS Chief']), async (req, res) => {
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

app.post('/emscommenttbl', verifyToken, async (req, res) => {
    try {
        const comments = {
            UserName: req.body.UserName,
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

app.post('/emsannouncementtbl', verifyToken, verifyRole(['Owner', 'EMS Chief']), async (req, res) => {
    try {
        const announcements = {
            Title: req.body.Title,
            Content: req.body.Content,
        }
        const [result] = await pool.query('INSERT INTO EMSAnnouncementtbl SET ?', announcements);
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

app.post('/mechanicsnewstbl', verifyToken, verifyRole(['Owner', 'Mechanics Chief']), async (req, res) => {
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

app.post('/mechanicscommenttbl', verifyToken, async (req, res) => {
    try {
        const comments = {
            UserName: req.body.UserName,
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

app.post('/mechanicsannouncementtbl', verifyToken, verifyRole(['Owner', 'Mechanics Chief']), async (req, res) => {
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

//updating news
app.put('/homenews/:id', verifyToken, verifyRole('Owner'), async (req, res) => {
    const { id } = req.params
    const { Title, Content } = req.body
    try {
        const [result] = await pool.query('UPDATE HomeNewstbl SET Title = ?, Content = ? WHERE id = ?', [Title, Content, id]);
        if (result.affectedRows === 0) {
            return res.status(403).send('You are not allowed to update this news');
        }
        res.send('News updated successfully');
    } catch (err) {
        res.status(500).send('Error updating the news');
    }
});

app.put('/policenews/:id', verifyToken, verifyRole(['Owner', 'Police Chief']), async (req, res) => {
    const { id } = req.params
    const { Title, Content } = req.body
    try {
        const [result] = await pool.query('UPDATE PoliceNewstbl SET Title = ?, Content = ? WHERE id = ?', [Title, Content, id]);
        if (result.affectedRows === 0) {
            return res.status(403).send('You are not allowed to update this news');
        }
        res.send('News updated successfully');
    } catch (err) {
        res.status(500).send('Error updating the news');
    }
});

app.put('/emsnews/:id', verifyToken, verifyRole(['Owner', 'EMS Chief']), async (req, res) => {
    const { id } = req.params
    const { Title, Content } = req.body
    try {
        const [result] = await pool.query('UPDATE EMSNewstbl SET Title = ?, Content = ? WHERE id = ?', [Title, Content, id]);
        if (result.affectedRows === 0) {
            return res.status(403).send('You are not allowed to update this news');
        }
        res.send('News updated successfully');
    } catch (err) {
        res.status(500).send('Error updating the news');
    }
});

app.put('/mechanicsnews/:id', verifyToken, verifyRole(['Owner', 'Mechanics Chief']), async (req, res) => {
    const { id } = req.params
    const { Title, Content } = req.body
    try {
        const [result] = await pool.query('UPDATE MechanicsNewstbl SET Title = ?, Content = ? WHERE id = ?', [Title, Content, id]);
        if (result.affectedRows === 0) {
            return res.status(403).send('You are not allowed to update this news');
        }
        res.send('News updated successfully');
    } catch (err) {
        res.status(500).send('Error updating the news');
    }
});
//deleting news
app.delete('/homenews/:id', verifyToken, verifyRole('Owner'), async (req, res) => {
    const { id } = req.params
    try {
        const [result] = await pool.query('DELETE FROM HomeNewstbl WHERE id = ?', [id]);
        if (result.affectedrows === 0) {
            return res.status(403).send('You are not allowed to delete this news');
        }
        res.send('News deleted successfully');
    } catch (err) {
        res.status(500).send('Error deleting the news');
    }
});

app.delete('/policenews/:id', verifyToken, verifyRole(['Owner', 'Police Chief']), async (req, res) => {
    const { id } = req.params
    try {
        const [result] = await pool.query('DELETE FROM PoliceNewstbl WHERE id = ?', [id]);
        if (result.affectedrows === 0) {
            return res.status(403).send('You are not allowed to delete this news');
        }
        res.send('News deleted successfully');
    } catch (err) {
        res.status(500).send('Error deleting the news');
    }
});

app.delete('/emsnews/:id', verifyToken, verifyRole(['Owner', 'EMS Chief']), async (req, res) => {
    const { id } = req.params
    try {
        const [result] = await pool.query('DELETE FROM EMSNewstbl WHERE id = ?', [id]);
        if (result.affectedrows === 0) {
            return res.status(403).send('You are not allowed to delete this news');
        }
        res.send('News deleted successfully');
    } catch (err) {
        res.status(500).send('Error deleting the news');
    }
});

app.delete('/mechanicsnews/:id', verifyToken, verifyRole(['Owner', 'Mechanics Chief']), async (req, res) => {
    const { id } = req.params
    try {
        const [result] = await pool.query('DELETE FROM MechanicsNewstbl WHERE id = ?', [id]);
        if (result.affectedrows === 0) {
            return res.status(403).send('You are not allowed to delete this news');
        }
        res.send('News deleted successfully');
    } catch (err) {
        res.status(500).send('Error deleting the news');
    }
});

//updating comments
app.put('/homecomments/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { Content } = req.body;
    try {
        const [result] = await pool.query('UPDATE HomeCommenttbl SET Content = ? WHERE id = ? AND UserName = ?', [Content, id, req.user.username]);
        if (result.affectedRows === 0) {
            return res.status(403).send('You are not allowed to update this comment');
        }
        res.send('Comment updated successfully');
    } catch (err) {
        res.status(500).send('Error updating comment');
    }
});

app.put('/policecomments/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { Content } = req.body;
    try {
        const [result] = await pool.query('UPDATE PoliceCommenttbl SET Content = ? WHERE id = ? AND UserName = ?', [Content, id, req.user.username]);
        if (result.affectedRows === 0) {
            return res.status(403).send('You are not allowed to update this comment');
        }
        res.send('Comment updated successfully');
    } catch (err) {
        res.status(500).send('Error updating comment');
    }
});

app.put('/emscomments/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { Content } = req.body;
    try {
        const [result] = await pool.query('UPDATE EMSCommenttbl SET Content = ? WHERE id = ? AND UserName = ?', [Content, id, req.user.username]);
        if (result.affectedRows === 0) {
            return res.status(403).send('You are not allowed to update this comment');
        }
        res.send('Comment updated successfully');
    } catch (err) {
        res.status(500).send('Error updating comment');
    }
});

app.put('/mechanicscomments/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { Content } = req.body;
    try {
        const [result] = await pool.query('UPDATE MechanicsCommenttbl SET Content = ? WHERE id = ? AND UserName = ?', [Content, id, req.user.username]);
        if (result.affectedRows === 0) {
            return res.status(403).send('You are not allowed to update this comment');
        }
        res.send('Comment updated successfully');
    } catch (err) {
        res.status(500).send('Error updating comment');
    }
});

//deleting comments
app.delete('/homecomments/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM HomeCommenttbl WHERE id = ? AND UserName = ?', [id, req.user.username]);
        if (result.affectedRows === 0) {
            return res.status(403).send('You are not allowed to delete this comment');
        }
        res.send('Comment deleted successfully');
    } catch (err) {
        res.status(500).send('Error deleting comment');
    }
});

app.delete('/policecomments/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM PoliceCommenttbl WHERE id = ? AND UserName = ?', [id, req.user.username]);
        if (result.affectedRows === 0) {
            return res.status(403).send('You are not allowed to delete this comment');
        }
        res.send('Comment deleted successfully');
    } catch (err) {
        res.status(500).send('Error deleting comment');
    }
});

app.delete('/emscomments/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM EMSCommenttbl WHERE id = ? AND UserName = ?', [id, req.user.username]);
        if (result.affectedRows === 0) {
            return res.status(403).send('You are not allowed to delete this comment');
        }
        res.send('Comment deleted successfully');
    } catch (err) {
        res.status(500).send('Error deleting comment');
    }
});

app.delete('/mechanicscomments/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM MechanicsCommenttbl WHERE id = ? AND UserName = ?', [id, req.user.username]);
        if (result.affectedRows === 0) {
            return res.status(403).send('You are not allowed to delete this comment');
        }
        res.send('Comment deleted successfully');
    } catch (err) {
        res.status(500).send('Error deleting comment');
    }
});

//updating announcement
app.put('/policeannouncements/:id', verifyToken, verifyRole(['Owner', 'Police Chief']), async (req, res) => {
    const { id } = req.params;
    const { Title, Content } = req.body;
    try {
        const [result] = await pool.query('UPDATE PoliceAnnouncementtbl SET Title = ?, Content = ? WHERE id = ?', [Title, Content, id]);
        if (result.affectedRows === 0) {
            return res.status(403).send('You are not allowed to update this announcement');
        }
        res.send('Announcement updated successfully');
    } catch (err) {
        res.status(500).send('Error updating announcement');
    }
});

app.put('/emsannouncements/:id', verifyToken, verifyRole(['Owner', 'EMS Chief']), async (req, res) => {
    const { id } = req.params;
    const { Title, Content } = req.body;
    try {
        const [result] = await pool.query('UPDATE EMSAnnouncementtbl SET Title = ?, Content = ? WHERE id = ?', [Title, Content, id]);
        if (result.affectedRows === 0) {
            return res.status(403).send('You are not allowed to update this announcement');
        }
        res.send('Announcement updated successfully');
    } catch (err) {
        res.status(500).send('Error updating announcement');
    }
});

app.put('/mechanicsannouncements/:id', verifyToken, verifyRole(['Owner', 'Mechanics Chief']), async (req, res) => {
    const { id } = req.params;
    const { Title, Content } = req.body;
    try {
        const [result] = await pool.query('UPDATE MechanicsAnnouncementtbl SET Title = ?, Content = ? WHERE id = ?', [Title, Content, id]);
        if (result.affectedRows === 0) {
            return res.status(403).send('You are not allowed to update this announcement');
        }
        res.send('Announcement updated successfully');
    } catch (err) {
        res.status(500).send('Error updating announcement');
    }
});

//deleting announcement
app.delete('/policeannouncements/:id', verifyToken, verifyRole(['Owner', 'Police Chief']), async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM PoliceAnnouncementtbl WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(403).send('You are not allowed to delete this announcement');
        }
        res.send('Announcement deleted successfully');
    } catch (err) {
        res.status(500).send('Error deleting announcement');
    }
});

app.delete('/emsannouncements/:id', verifyToken, verifyRole(['Owner', 'EMS Chief']), async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM EMSAnnouncementtbl WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(403).send('You are not allowed to delete this announcement');
        }
        res.send('Announcement deleted successfully');
    } catch (err) {
        res.status(500).send('Error deleting announcement');
    }
});

app.delete('/mechanicsannouncements/:id', verifyToken, verifyRole(['Owner', 'Mechanics Chief']), async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM MechanicsAnnouncementtbl WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(403).send('You are not allowed to delete this announcement');
        }
        res.send('Announcement deleted successfully');
    } catch (err) {
        res.status(500).send('Error deleting announcement');
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

module.exports = app;