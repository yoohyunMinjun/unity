import os
from dotenv import load_dotenv
import mysql.connector

# .env 파일 경로 설정 (필요한 경우)
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')

# .env 파일 로드
load_dotenv(dotenv_path)

# 환경 변수에서 DB 정보 가져오기
db_host = os.getenv('DB_HOST')
db_user = os.getenv('DB_USER')
db_password = os.getenv('DB_PASSWORD')
db_database = os.getenv('DB_DATABASE')

# DB 연결 (에러 처리 추가)
try:
    mydb = mysql.connector.connect(
        host=db_host,
        user=db_user,
        password=db_password,
        database=db_database
    )
    mycursor = mydb.cursor()

    # SQL 쿼리 실행 (예시)
    mycursor.execute("SELECT * FROM your_table")
    myresult = mycursor.fetchall()
    for x in myresult:
        print(x)

except mysql.connector.Error as error:
    print(f"Error: {error}")

finally:
    if mydb:
        mydb.close()