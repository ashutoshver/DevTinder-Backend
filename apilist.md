# DevTinder APIs

POST /signup
POST /login
POST /logout

GET /profile/view
PATCH /profile/edit
PATCH /profile/forgetpassword

POST /request/send/:status/:userId  (status = ignore or interested)

POST /request/review/accepted/:requestId
POST /request/review/rejected/:requestId

GET /connections
GET /request/received
GET /feed - get profiles of other users