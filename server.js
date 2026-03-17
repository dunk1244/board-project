const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

let posts = [];

// 🔥 유저 저장 (관리자 포함)
let users = [
  { id: "admin", pw: "1234", role: "admin" }
];

// 🔥 회원가입
app.post('/register', (req, res) => {
  const { id, pw } = req.body;

  const exists = users.find(u => u.id === id);
  if (exists) {
    return res.json({ success: false, msg: "이미 존재" });
  }

  users.push({ id, pw, role: "user" });
  res.json({ success: true });
});

// 🔥 로그인
app.post('/login', (req, res) => {
  const { id, pw } = req.body;

  const user = users.find(u => u.id === id && u.pw === pw);

  if (user) {
    res.json({ success: true, id: user.id, role: user.role });
  } else {
    res.json({ success: false });
  }
});

// 게시글 목록
app.get('/posts', (req, res) => {
  res.json(posts);
});

// 글 작성
app.post('/posts', (req, res) => {
  const { title, content, author } = req.body;

  posts.push({
    id: Date.now(),
    title,
    content,
    author,
    views: 0,
    likes: 0,
    dislikes: 0,
    comments: []
  });

  res.sendStatus(200);
});

// 조회수 증가
app.get('/posts/:id/view', (req, res) => {
  const post = posts.find(p => p.id == req.params.id);
  if (post) {
    post.views++;
    res.json(post);
  }
});

// 조회만
app.get('/posts/:id', (req, res) => {
  const post = posts.find(p => p.id == req.params.id);
  res.json(post);
});

// 댓글
app.post('/posts/:id/comment', (req, res) => {
  const post = posts.find(p => p.id == req.params.id);
  if (post) post.comments.push(req.body.comment);
  res.sendStatus(200);
});

// 추천
app.post('/posts/:id/like', (req, res) => {
  const post = posts.find(p => p.id == req.params.id);
  if (post) post.likes++;
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`서버 실행중: ${PORT}`);
});

// 비추천
app.post('/posts/:id/dislike', (req, res) => {
  const post = posts.find(p => p.id == req.params.id);
  if (post) post.dislikes++;
  res.sendStatus(200);
});

// 🔥 삭제 (관리자만 가능)
app.delete('/posts/:id', (req, res) => {
  const { userId } = req.body;

  const user = users.find(u => u.id === userId);

  if (user && user.role === "admin") {
    posts = posts.filter(p => p.id != req.params.id);
    res.sendStatus(200);
  } else {
    res.status(403).send("관리자만 삭제 가능");
  }
});

app.listen(PORT, () => {
  console.log(`서버 실행중: http://localhost:${PORT}`);
});
