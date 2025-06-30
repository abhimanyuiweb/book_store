const express = require('express')
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

console.log('Testing.....');

app.use(express.json());

app.get('/', function (req, res) {
    // while(true) {
        
    // }
  res.send('Book store')
})

app.get('/books', (req, res) => {
    res.json({
        name: 'Kumar ABhimanyu'
    });
});

app.post('/books', (req, res) => {
    
});

// A service to create user for testing without authentocation. Its not a good practive.
// I am using for creating dummy users.
app.post('/user', (req, res) => {
    
});

// app.post('/authentication', (req, res) => {
//     User.findOne({email: req.body.email}).then((user)=>{
//         if(user !== null) {
//             //Compare given password with db's hash.
//             bcrypt.compare(req.body.password, user.password,function (err, same) {
//                 if (same) {
//                     let userData = {
//                         _id: user._id,
//                         name: user.name,
//                         email: user.email,
//                     };
//                     //Prepare JWT token for authentication
//                     const jwtPayload = userData;
//                     const jwtData = {
//                         expiresIn: config.JWT_TIMEOUT_DURATION,
//                     };
//                     const secret = config.JWT_SECRET;
//                     //Generated JWT token with Payload and secret.
//                     userData.token = jwt.sign(jwtPayload, secret, jwtData);
//                     return responses.successResponseWithData(res, "Authentication Success.", userData);
//                 } else {
//                     return responses.unauthorizedResponse(res, "Email or Password wrong.");
//                 }
//             });
//         }else {
//             return responses.successResponseWithData(res, "Invalid username or password", {});
//         }
//     });
// });

app.listen(3000, () => {
    console.log(`Expres server listening on: 3000`);
});


