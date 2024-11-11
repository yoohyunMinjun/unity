const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

// MySQL 연결 풀 생성
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// 데이터베이스 연결 테스트 함수 (비동기)
async function initializeDatabase() {
    try {
        const [rows] = await pool.query('SELECT 1 + 1 AS solution'); // 간단한 쿼리로 연결 테스트
        console.log('MySQL 연결 성공, 응답:', rows);
        return pool;  // 풀 반환
    } catch (err) {
        console.error('MySQL 연결 실패:', err);
        throw err; // 실패 시 예외 던지기
    }
}

module.exports = initializeDatabase;