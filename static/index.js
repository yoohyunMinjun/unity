const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const userRouter = require('./src/users');

const app = express();
app.use(express.json());

app.use('/', userRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
