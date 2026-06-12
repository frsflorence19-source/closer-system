const express = require('express');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const db = new sqlite3.Database(':memory:');
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'closer-system-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

const isLoggedIn = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res.redirect('/login');
  }
};

app.get('/', (req, res) => {
  if (req.session.userId) {
    res.redirect('/system');
  } else {
    res.redirect('/login');
  }
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

app.post('/api/register', (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  if (!username || !email || !password || password !== confirmPassword) {
    return res.json({ success: false, message: '信息不完整或密码不匹配' });
  }
  const hashedPassword = bcrypt.hashSync(password, 10);
  db.run('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword], function(err) {
    if (err) {
      return res.json({ success: false, message: '用户名或邮箱已存在' });
    }
    res.json({ success: true, message: '注册成功，请登录' });
  });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.json({ success: false, message: '用户名和密码不能为空' });
  }
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err || !user) {
      return res.json({ success: false, message: '用户名或密码错误' });
    }
    if (bcrypt.compareSync(password, user.password)) {
      req.session.userId = user.id;
      req.session.username = user.username;
      res.json({ success: true, message: '登录成功' });
    } else {
      res.json({ success: false, message: '用户名或密码错误' });
    }
  });
});

app.get('/system', isLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'system.html'));
});

app.get('/api/user', isLoggedIn, (req, res) => {
  res.json({ id: req.session.userId, username: req.session.username });
});

app.get('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Closer 系统运行在端口 ${PORT}`);
});
