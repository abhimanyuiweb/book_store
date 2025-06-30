const express = require('express')
const app = express();
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const responses = require("./helpers/response");


const uri = "mongodb+srv://abhimanyuiweb:Anamika%402025@cluster0.9h0oxdm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

async function run() {
    try {
        console.log('ooooooooooooooooooo');
        // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
        await mongoose.connect(uri, clientOptions);
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (err) {
        console.log('Error in DB connectivity');
    } finally {
        // Ensures that the client will close when you finish/error
        await mongoose.disconnect();
    }
}
run().catch(console.dir);

app.use(express.json());

app.get('/', function (req, res) {
    // while(true) {

    // }
    res.send('Book store')
})

app.get('/books', (req, res) => {
    Book.find({}).then((books) => {
        if (books.length > 0) {
            return responses.successResponseWithData(res, "Books found", books);
        } else {
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
    res.json({
        message: 'This is user POST endpoint'
    });
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

app.listen(4000, () => {
    console.log(`Expres server listening on: 4000`);
});


