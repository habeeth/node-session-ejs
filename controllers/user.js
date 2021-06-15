const csurf = require("csurf");
const productModel = require("../models/product");
const userModel = require("../models/user");
const path = require('path');
const fs = require('fs');
const merge = require('easy-pdf-merge');



let merger = exports.merger = async (req, res, next) => {
    try {
        merge(['public/00882022_December_2020.pdf', 'public/00882022_January_2021.pdf', 'public/00882022_February_2021.pdf', 'public/00882022_March_2021.pdf', 'public/00882022_April_2021.pdf', 'public/00882022_May_2021.pdf'], 'public/payslip.pdf', function (err) {
            if (err) {
                return console.log(err)
            }
            console.log('Successfully merged!')
            res.status(200).json({
                message: "ok"
            })
        });
    } catch (error) {
        console.log(err);
    }
}

let getProducts = exports.getProducts = async (req, res, next) => {
    // res.render('home', { pageTitle: "home page" });
    try {
        let result = await productModel.find();

        if (result) {
            // console.log(result);
            res.render('home', { pageTitle: "home page", products: result });
        }
        else {
            res.render('error');
        }
    }
    catch (err) {
        console.log(err);
    }
};

exports.addProducts = (req, res, next) => {
    res.render('addProduct', { pageTitle: "Add Product", token: req.csrfToken() })
}

exports.postProducts = (req, res, next) => {
    // console.log("insode post");
    let data = new productModel({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price
    })
    data.image = req.file.Originalname;
    data.save().then(
        result => {
            // console.log(result);
            if (result != null) {
                getProducts(req, res, next);
                // res.render('home', { pageTitle: "home page", products: result });
            }
        }
    ).catch(
        error => {
            console.log(error);
            res.render('error');
        }
    )
}

exports.getLogin = async (req, res, next) => {

    // let cookieValue = false;
    // if (req.get('cookie')) {
    //     cookieValue = req.get('cookie').split('=')[1];
    // }
    // res.render('user', { loggedin: cookieValue });

    let sessionvalue = req.session.loggedin;
    // console.log(req.session);
    res.render('user', { loggedin: sessionvalue, token: req.csrfToken() });

}
exports.getLogout = async (req, res, next) => {
    // res.clearCookie('loggedin');
    req.session.destroy();
    res.render('user', { loggedin: false });
}


exports.postLogin = async (req, res, next) => {
    try {
        let filter = {
            email: req.body.email,
            password: req.body.password
        }
        let result = await userModel.find(filter);
        // console.log(filter, result);
        if (result && result.length > 0) {
            // res.render('home', { pageTitle: "home page", products: result });
            // res.cookie("loggedin", true);
            // res.cookie("loggedin", true);
            req.session.loggedin = true;
            res.redirect('/home');
        }
        else {
            res.render('error', { msg: 'Password incorrect' });
        }
    }
    catch (err) {
        console.log(err);
        res.render('error', { msg: 'Err occurred' });
    }
}

exports.getImage = (req, res, next) => {
    const fpath = path.join('images', 'group demo.png');
    res.setHeader('Content-Type', 'images/jpg');
    res.setHeader('Content-Disposition', 'inline;filename="group demo.png"')
    fs.readFile(fpath, (err, data) => {
        if (err) {
            res.send(err)
        } else {
            res.send(data)
        }
    })
}
