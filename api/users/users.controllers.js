const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_EXPIRATION_MS, JWT_SECRET } = require("../../config/keys");

// const User = require("../../models/User");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const { JWT_EXPIRATION_MS, JWT_SECRET } = require("../../config/keys");

// exports.signup = async (req, res, next) => {
//   try {
//     const saltRounds = 10; //could be any num. my fav is 7 tho
//     req.body.password = await bcrypt.hash(req.body.password, saltRounds);

//     const newUser = await User.create(req.body);
//     const payload = {
//       id: newUser._id,
//       username: newUser.username,
//       exp: Date.now() + parseInt(JWT_EXPIRATION_MS),
//     };
//     const token = jwt.sign(payload, JWT_SECRET);

//     res.status(201).json({ token });
//   } catch (err) {
//     next(err);
//   }
// };

// exports.signin = async (req, res, next) => {
//   try {
//     if (!req.user) {
//       return res.status(401).json({ error: "Invalid credentials" });
//     }

//     const { _id, username } = req.user;

//     const payload = {
//       id: _id,
//       username,
//       exp: Date.now() + parseInt(process.env.JWT_EXPIRATION_MS),
//     };
//     const token = jwt.sign(payload, process.env.JWT_SECRET);

//     res.json({ token });
//   } catch (err) {
//     next(err);
//   }
// };

// exports.getUsers = async (req, res) => {
//   try {
//     const users = await User.find().populate("urls");
//     res.status(201).json(users);
//   } catch (err) {
//     next(err);
//   }
// };

const generateToken = (user) => {
  const payload = {
    id: user._id,
    username: user.username,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION_MS });
};

exports.signup = async (req, res, next) => {
  try {
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(req.body.password, saltRounds);

    const newUser = await User.create({
      username: req.body.username,
      password: hashPassword,
    });

    const token = generateToken(newUser);

    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};

exports.signin = async (req, res) => {
  const user = req.user;
  if (!user) return res.status(401).json({ message: "unathentication" });
  try {
    const token = generateToken(user);
    return res.status(200).json({ token });
  } catch (err) {
    res.status(500).json("Server Error");
  }
};

// Get Users
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().populate("urls");
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};
