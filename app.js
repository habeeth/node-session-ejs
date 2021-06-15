const express = require('express');
const router = require('./routes/router');
const adminRoute = require('./routes/admin/admin');
const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
const cookieparser = require('cookie-parser');
const session = require('express-session');
const mongoDBStore = require('connect-mongodb-session')(session);//to store session in mongo db
const csurf = require('csurf');//CSRF attack
const multer = require('multer');
const app = express();

let sessionStore = new mongoDBStore({
    uri: "mongodb://localhost:27017/shop",
    collection: "sessiondetails"
});

mongoose.connect("mongodb://localhost:27017/shop").then(() => {
    console.log('DB connected');
}).catch(() => {
    console.log('err');
});

app.use(express.urlencoded());

let fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const filefilter = (req, file, cb) => {
    console.log(file.mimetype);
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        cb(null, true);//multer allow seerver to save files
    }
    else {
        cb(null, false);//multer will not allow seerver to save files
    }
}

app.use(multer({ storage: fileStorage, fileFilter: filefilter }).single('image'));

app.use(cookieparser());
app.use(session({ secret: "my secret", resave: false, saveUninitialized: false, store: sessionStore }));
//cookie:{maxAge:2000}
app.set("view engine", "ejs") //engine template name
app.set("views", "views") // folder name

//configure csurf after session and views configuration to app
const csrfprotection = csurf();
app.use(csrfprotection);

app.use('/admin', adminRoute);
app.use('/', router);

// app.listen(1212, () => {
//     console.log("Server started...");
// });

const server = app.listen(1212);
const io = require('socket.io')(server);

io.on('connection', (socket) => {
    console.log('client is ready..');
    socket.on('msg', (data) => {
        console.log(data);
        socket.broadcast.emit('msg', data);
    })
});