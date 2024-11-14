const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');  // 이미 pool 객체를 사용하도록 설정
const router = express.Router();

// 회원가입
router.post('/signup', async (req, res) => {
    const { id, username, password } = req.body;

    try {
        // 기존 사용자 확인
        const [existingUser] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
        if (existingUser.length) {
            return res.status(400).json({ msg: "이미 존재하는 유저입니다." });
        }

        // 비밀번호 해싱
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 새로운 사용자 등록
        await db.query("INSERT INTO users (id, username, password) VALUES (?, ?, ?)", [id, username, hashedPassword]);
        res.json({ msg: "User registered successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// 로그인
router.post('/login', async (req, res) => {
    const { id, username, password } = req.body;

    try {
        // 사용자 조회
        const [user] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
        if (!user.length) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        // 비밀번호 비교
        const isMatch = await bcrypt.compare(password, user[0].password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        // JWT 토큰 생성
        const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;