const express = require('express');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const db = new sqlite3.Database('./closer.db');
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // 创建默认 Admin 账户
  const adminPassword = bcrypt.hashSync('admin123', 10);
  db.run(
    'INSERT OR IGNORE INTO users (id, username, email, password, role, status) VALUES (?, ?, ?, ?, ?, ?)',
    [1, 'admin', 'admin@closer.com', adminPassword, 'admin', 'active']
  );
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

const isAdmin = (req, res, next) => {
  if (req.session.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: '需要 Admin 权限' });
  }
};

app.get('/', (req, res) => {
  if (req.session.userId) {
    if (req.session.role === 'admin') {
      res.redirect('/admin');
    } else {
      res.redirect('/system');
    }
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
  db.run(
    'INSERT INTO users (username, email, password, role, status) VALUES (?, ?, ?, ?, ?)',
    [username, email, hashedPassword, 'user', 'active'],
    function(err) {
      if (err) {
        return res.json({ success: false, message: '用户名或邮箱已存在' });
      }
      res.json({ success: true, message: '注册成功，请登录' });
    }
  );
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.json({ success: false, message: '用户名和密码不能为空' });
  }
  db.get('SELECT * FROM users WHERE username = ? OR email = ?', [username, username], (err, user) => {
    if (err || !user) {
      return res.json({ success: false, message: '用户名或密码错误' });
    }
    if (user.status !== 'active') {
      return res.json({ success: false, message: '账户已被禁用' });
    }
    if (bcrypt.compareSync(password, user.password)) {
      req.session.userId = user.id;
      req.session.username = user.username;
      req.session.role = user.role;
      res.json({ success: true, message: '登录成功' });
    } else {
      res.json({ success: false, message: '用户名或密码错误' });
    }
  });
});

app.get('/system', isLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'system.html'));
});

app.get('/admin', isLoggedIn, isAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/api/user', isLoggedIn, (req, res) => {
  res.json({
    id: req.session.userId,
    username: req.session.username,
    role: req.session.role
  });
});

app.get('/api/users', isLoggedIn, isAdmin, (req, res) => {
  db.all('SELECT id, username, email, role, status FROM users', (err, users) => {
    if (err) {
      return res.json({ success: false, message: '获取用户失败' });
    }
    res.json({ success: true, users });
  });
});

app.put('/api/users/:id/role', isLoggedIn, isAdmin, (req, res) => {
  const { role } = req.body;
  const userId = req.params.id;
  
  if (!['admin', 'user'].includes(role)) {
    return res.json({ success: false, message: '无效的角色' });
  }

  db.run('UPDATE users SET role = ? WHERE id = ?', [role, userId], function(err) {
    if (err) {
      return res.json({ success: false, message: '更新失败' });
    }
    res.json({ success: true, message: '角色已更新' });
  });
});

app.put('/api/users/:id/status', isLoggedIn, isAdmin, (req, res) => {
  const { status } = req.body;
  const userId = req.params.id;

  if (!['active', 'disabled'].includes(status)) {
    return res.json({ success: false, message: '无效的状态' });
  }

  db.run('UPDATE users SET status = ? WHERE id = ?', [status, userId], function(err) {
    if (err) {
      return res.json({ success: false, message: '更新失败' });
    }
    res.json({ success: true, message: '状态已更新' });
  });
});

app.put('/api/users/:id/reset-password', isLoggedIn, isAdmin, (req, res) => {
  const userId = req.params.id;
  const tempPassword = Math.random().toString(36).slice(-8);
  const hashedPassword = bcrypt.hashSync(tempPassword, 10);

  db.run('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId], function(err) {
    if (err) {
      return res.json({ success: false, message: '重置失败' });
    }
    res.json({
      success: true,
      message: '密码已重置',
      tempPassword: tempPassword
    });
  });
});

app.get('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Closer 系统运行在端口 ${PORT}`);
  console.log(`默认 Admin 账户: admin / admin123`);
});
