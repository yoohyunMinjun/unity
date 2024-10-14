## 커밋 룰
|          |                                                    |
| :------: | :------------------------------------------------: |
|   ADD    | 새로운 기능, 컴포넌트 등 새로운 것이 추가되었을 때 |
|   FIX    |      기존의 코드에서 잘못된 부분을 수정할 때       |
| REFACTOR |       기존의 있는 코드를 리팩토링 하였을 때        |
|  DELETE  |          기존의 있던 내용을 삭제하였을 때          |



## 커밋 예시
```bash
git commit -m 'ADD:: 헤더 완성'
git commit -m 'FIX:: 헤더 색상 수정'
git commit -m 'REFACTOR:: 코드 가독성을 높이기 위한 리팩토링'
git commit -m 'DELETE:: 사용하지 않는 태그 삭제'
```

## git push bb방법
```bash
$git status
$git add . 
$git commit -m "(커밋예시에 맞게)" 
$git push -u origin bb
```