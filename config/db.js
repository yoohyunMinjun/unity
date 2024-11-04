const mysql = require('mysql');
const dotenv = require('dotenv');
const path = require('path');

// .env 파일 경로 설정 (필요한 경우)
const dotenvPath = path.join(__dirname, '.env');

// .env 파일 로드
dotenv.config({ path: dotenvPath });

// 환경 변수에서 DB 정보 가져오기
const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbDatabase = process.env.DB_DATABASE;

// DB 연결 (에러 처리 추가)
const db = mysql.createConnection({
    host: dbHost,
    user: dbUser,
    password: dbPassword,
    database: dbDatabase,
});

db.connect((err) => {
    if (err) {
        console.error(`Database connection error: ${err.message}`);
        return;
    }
    console.log('Connected to the database.');

    // SQL 쿼리 실행
    db.query('SELECT * FROM users', (error, results) => {
        if (error) {
            console.error(`Query error: ${error.message}`);
        } else {
            results.forEach((row) => {
                console.log(row);
            });
        }

        // DB 연결 종료
        db.end((endErr) => {
            if (endErr) {
                console.error(`Error closing connection: ${endErr.message}`);
            } else {
                console.log('Database connection closed.');
            }
        });
    });
});
