const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

const userRuoter = require('./src/users');
app.use('/users', userRouter);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});