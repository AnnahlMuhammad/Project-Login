// Require modul yang dibutuhkan
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const regis = require("./Model/dbsModel");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

// Konfigurasi express
const app = express();

// Konfigurasi ejs
app.set("view engine", "ejs");

// Konfigurasi ejs-layout
app.use(expressLayouts);

// konfigurasi mongoose
require("./Mongoose/dbs");

// Konfigurasi parse form
app.use(express.urlencoded({ extended: true }));

// Konfigurasi validator
const { body, validationResult, check } = require("express-validator");

// Konfigurasi flash-message
app.use(cookieParser("secret"));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: "secret",
    resave: true,
    saveUnintialized: true,
  })
);
app.use(flash());

// Insialisasi port
const port = 3000;

// Membuat halaman home
app.get("/", (req, res) => {
  res.render("form.ejs", {
    title: "Teamworks",
    layout: "layout/main-layout",
    msg: req.flash("msg"),
  });
});

// Membuat halaman signUp
app.get("/signUp", (req, res) => {
  res.render("sign.ejs", {
    title: "Registrasi",
    layout: "layout/main-layout",
  });
});

// Membuat halaman login
app.get("/logIn", (req, res) => {
  res.render("login.ejs", {
    title: "Login",
    layout: "layout/main-layout",
  });
});

// Membuat signUp form juga dengan validator
app.post(
  "/signUp",
  [
    body("username").custom(async (value) => {
      const duplikat = await regis.findOne({ username: value });
      if (duplikat) {
        throw new Error("Username is already used. Use other username");
      }
      return true;
    }),
    check("email", "Email does not valid").isEmail(),
    check("password", "Password should be min 8 character").isLength({
      min: 8,
    }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(404);
      res.render("sign.ejs", {
        layout: "layout/main-layout",
        title: "Registrasi",
        errors: errors.array(),
      });
    } else {
      regis.insertMany(req.body, (error, result) => {
        req.flash("msg", "Username succesfully added");
        res.redirect("/");
      });
    }
  }
);

// Membuat login form
app.post(
  "/logIn",
  [
    body("username").custom(async (value, { req }) => {
      const duplikat = await regis.findOne({ username: value });
      if (!duplikat) {
        throw new Error("Username does not exist");
      }
      return true;
    }),
    check("password", "Password should be min 8 character").isLength({
      min: 8,
    }),
    body("password").custom(async (value, { req }) => {
      const duplikat = await regis.findOne({ password: value });
      if (!duplikat) {
        throw new Error("Wrong Password!");
      }
      return true;
    }),
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(404);
      res.render("login.ejs", {
        layout: "layout/main-layout",
        title: "Login",
        errors: errors.array(),
      });
    } else {
      res.render('success.ejs', {
        layout : "layout/main-layout",
        title : "Login Success",
        txt : req.body.username,
      });
    }
  }
);

// Listening to port
app.listen(port, () => {
  console.log(
    `Contact login is already connected to port ${port} | http://localhost:${port}`
  );
});
