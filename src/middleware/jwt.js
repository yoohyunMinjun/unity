const authenticateToken = (req, res, next) => { // JWT 토큰 검증 미들웨어
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: '토큰이 필요합니다.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
        }

        req.user = user;
        next();
    });
};

// 예시: 인증이 필요한 라우터
app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: '보호된 경로에 접근하셨습니다.', user: req.user });
});