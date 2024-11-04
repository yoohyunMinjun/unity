const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
require('dotenv').config();

const router = express.Router();

// MySQL 데이터베이스 연결
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// 회원가입 라우터
router.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    // 아이디와 비밀번호가 입력되지 않은 경우
    if (!username || !password) {
        return res.status(400).json({ message: '아이디와 비밀번호를 입력해주세요.' });
    }

    try {
        // 비밀번호 해싱
        const hashedPassword = await bcrypt.hash(password, 12);

        // 사용자 정보 저장
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

    // 아이디와 비밀번호가 입력되지 않은 경우
    if (!username || !password) {
        return res.status(400).json({ message: '아이디와 비밀번호를 입력해주세요.' });
    }

    // 사용자 조회
    db.query(
        'SELECT * FROM users WHERE username = ?',
        [username],
        async (err, results) => {
            if (err) {
                return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
            }

            // 사용자가 없을 경우
            if (results.length === 0) {
                return res.status(401).json({ message: '존재하지 않는 사용자입니다.' });
            }

            const user = results[0];

            // 비밀번호 검증
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
            }

            // JWT 토큰 생성
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
                expiresIn: '1h', // 토큰 유효기간 1시간
            });

            res.json({ message: '로그인 성공', token });
        }
    );
});

module.exports = router;