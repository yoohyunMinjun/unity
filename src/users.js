const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

const router = express.Router();

// 회원가입 라우터
router.post('/signsup', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: '아이디와 비밀번호를 입력해주세요.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, hashedPassword],
            (err, results) => {
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        return res.status(409).json({ message: '이미 존재하는 아이디입니다.' });
                    }
                    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
                }
                res.status(201).json({ message: '회원가입 성공' });
            }
        );
    } catch (err) {
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

// 로그인 라우터
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: '아이디와 비밀번호를 입력해주세요.' });
    }

    db.query(
        'SELECT * FROM users WHERE username = ?',
        [username],
        async (err, results) => {
            if (err) {
                return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
            }

            if (results.length === 0) {
                return res.status(401).json({ message: '존재하지 않는 사용자입니다.' });
            }

            const user = results[0];
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
            }

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
                expiresIn: '1h',
            });

            res.json({ message: '로그인 성공', token });
        }
    );
});

module.exports = router;