const express = require('express')
const app = express();
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const config = require("./config/config");
const responses = require("./helpers/response");

app.use(express.json());

const Book = require("./models/book.model");
const User = require("./models/user.model");


var mongoDB = `mongodb://${config.HOST}/${config.DB}`;
mongoose.connect(mongoDB, {useNewUrlParser: true});

mongoose.connection
.once('open', () => {
    console.log("MongoDB Connected.");
})
.on("error", (error) => {
    console.log("Your error:", error);
})

app.get('/', function (req, res) {
  res.send('Book store')
})

app.get('/books', (req, res) => {
    Book.find({}).then((books)=>{
        if(books.length > 0){
            return  responses.successResponseWithData(res, "Books found", books);
        }else{
            return responses.successResponseWithData(res, "No books found", []);
        }
    });
});

app.post('/books', (req, res) => {
    try {
        var book = new Book(
        { 
            name: req.body.name,
            author: req.body.author,
            isbn: req.body.isbn
        });

        // TODO: data sanitization before saving, throw error if issue in data
        //Save book.
        book.save((err) => {
            if (err) { 
                return responses.validationErrorWithData(res, "Validation Error.", errors.array());
            }

            return responses.successResponseWithData(res, "Book added successfully.", book);
        });
    } catch (err) {
        return responses.ErrorResponse(res, err);
    }
});

// A service to create user for testing without authentocation. Its not a good practive.
// I am using for creating dummy users.
app.post('/user', (req, res) => {
    try {
        User.findOne({email: req.body.email}).then((user)=> {
            if (user) {
                return responses.validationErrorWithData(res, "User already exists with email: " + user.email); 
            }

            // TODO: data sanitization before saving, throw error if issue in data
            // Hash password and Save user.
            bcrypt.hash(req.body.password, 10, function(err, hash) {
                const user = new User(
                { 
                    name: req.body.name,
                    email: req.body.email,
                    password: hash
                });

                user.save((err) => {
                    if (err) { 
                        return responses.validationErrorWithData(res, "Validation Error.", errors.array());
                    }
        
                    return responses.successResponseWithData(res, "User added successfully.", user);
                });
            })
        });
    } catch (err) {
        return responses.ErrorResponse(res, err);
    }
});

app.post('/authentication', (req, res) => {
    User.findOne({email: req.body.email}).then((user)=>{
        if(user !== null) {
            //Compare given password with db's hash.
            bcrypt.compare(req.body.password, user.password,function (err, same) {
                if (same) {
                    let userData = {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                    };
                    //Prepare JWT token for authentication
                    const jwtPayload = userData;
                    const jwtData = {
                        expiresIn: config.JWT_TIMEOUT_DURATION,
                    };
                    const secret = config.JWT_SECRET;
                    //Generated JWT token with Payload and secret.
                    userData.token = jwt.sign(jwtPayload, secret, jwtData);
                    return responses.successResponseWithData(res, "Authentication Success.", userData);
                } else {
                    return responses.unauthorizedResponse(res, "Email or Password wrong.");
                }
            });
        }else {
            return responses.successResponseWithData(res, "Invalid username or password", {});
        }
    });
});

app.listen(config.PORT, () => {
    console.log(`Expres server listening on: ${config.PORT}`);
});


