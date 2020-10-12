# Introduction

스토리플레이 사전예약 API 를 만들고 나서, 클라이언트에서 graphql을 어떻게 액세스하는지 파악하기 위해 만든 코드.
리스트, 저장, 삭제만 가능하고, 다량의 버그가 함유되어 있습니다!

1. AWS appsync 서버의 endpoint 및 key 설정.

AWS 앱싱크에 로그인하여, StoryplayReservationApi 를 선택하고, javascript 에서 설정 다운로드 버튼을 클릭.
다운로드 받은 js 파일을 src/aws-exports.js 파일로 overwrite.

2. 실행.
npm run start


