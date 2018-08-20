const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secretOrKey = require("../../config/keys").secretOrKey;
const passport = require("passport");
//load user model
const User = require("../../models/User");

//input validation
const validateRegisterInput = require("../../validation/register");

router.get("/", (req, res) => {
  res.json({ msg: "users works" });
});

module.exports = router;

//@route POST api/users/register
//@desc Register User
//@access Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const { name, email, password, avatar } = req.body;

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    } else {
      const newUser = new User({ name, email, password, avatar });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

//@route POST api/users/login
//@desc login user / return jwt
//@access Public
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).then(user => {
    if (!user) {
      return res.status(404).json({ email: "User not found" });
    }
    //check pw
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        //user matched

        //create jwt payload
        const payload = { id: user.id, name: user.name, avatar: user.avatar };
        //sign token
        jwt.sign(payload, secretOrKey, { expiresIn: 3600 }, (err, token) => {
          res.json({
            sucess: true,
            token: `Bearer ${token}`,
            err
          });
        });
      } else {
        return res.status(400).json({ password: "Password Incorrect" });
      }
    });
  });
});

//@route POST api/users/current
//@desc Register User
//@access Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { user } = req;
    res.json({ id: user.id, name: user.name, email: user.email });
  }
);
