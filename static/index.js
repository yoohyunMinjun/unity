const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const userRouter = require('../static/users');
const gameRouter = require('../static/game');

const app = express();
app.use(express.json());

app.use('/', userRouter);
app.use('/game', gameRouter);

// Unity WebGL 빌드 파일을 정적 경로로 설정
app.use('/webgl', express.static(path.join(__dirname, 'webgl-build')));

// 기본 페이지 login.html 라우트 설정
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});