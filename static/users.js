const express = require('express');
const db = require('../config/db');
const router = express.Router();

// 회원가입
router.post('/signup', async (req, res) => {
  try {
    const { username, userId, password, chkpassword } = req.body;

    // 유효성 검사
    if (!username || username.length > 20) {
      return res.status(400).json({ message: '아이디는 20자 이내여야 합니다.' });
    }

    // 아이디 중복 확인
    const existingUser = await db.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: '이미 사용 중인 아이디입니다.' });
    }

    if (!password || password.length < 8 || password.length > 12) {
      return res.status(400).json({ message: '비밀번호는 8~12자여야 합니다.' });
    }

    if (password !== chkpassword) {
      return res.status(400).json({ message: '비밀번호와 비밀번호 확인이 일치하지 않습니다.' });
    }

    // 사용자 생성
    await db.create({
      username,
      password
    });

    // 회원가입 완료 후 login.html로 이동
    res.status(201).redirect('../templates/login.html');
  } catch (error) {
    console.error('회원가입 에러:', error.message);
    res.status(500).json({ message: '회원가입 중 오류가 발생했습니다.', error: error.message });
  }
});

// 로그인
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 사용자 조회
    const user = await db.findOne({ where: { username } });

    // 아이디가 존재하지 않으면
    if (!user) {
      return res.status(401).json({ message: '아이디가 존재하지 않습니다.' });
    }

    // 비밀번호 비교
    if (password !== user.password) {
      return res.status(401).json({ message: '비밀번호가 잘못되었습니다.' });
    }

    // 로그인 성공 시 사용자 정보 반환
    res.status(200).json({
      username: user.username,
      message: '로그인 성공'
    });
  } catch (error) {
    console.error('로그인 에러:', error.message);
    res.status(500).json({ message: '로그인 중 오류가 발생했습니다.', error: error.message });
  }
});

// 사용자 정보 조회
router.get('/user/:username', async (req, res) => {
  try {
    const { username } = req.params;

    // 사용자 정보 조회
    const user = await db.findOne({ where: { username } });

    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    res.json({
      username: user.username,
      password: user.password
    });
  } catch (error) {
    console.error('사용자 정보 조회 에러:', error.message);
    res.status(500).json({ message: '사용자 정보 조회 중 오류가 발생했습니다.', error: error.message });
  }
});

module.exports = router;