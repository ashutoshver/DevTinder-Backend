# DevTinder APIs

POST /signup
POST /login
POST /logout

GET /profile/view
PATCH /profile/edit
PATCH /profile/forgetpassword

POST /request/send/:status/:userId  (status = ignore or interested)
POST /request/review/:status/:requestId  (status = accepted or rejected)

GET /connections
GET /request/received
GET /feed - get profiles of other users