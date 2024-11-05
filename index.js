const express = require('express');
require('dotenv').config();
const userRouter = require('./src/users');

const app = express();
app.use(express.json());

app.use('/', userRouter);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});