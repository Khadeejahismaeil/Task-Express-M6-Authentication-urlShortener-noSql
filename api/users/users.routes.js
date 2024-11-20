const express = require("express");

const router = express.Router();

const { signup, signin, getUsers } = require("./users.controllers");

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/users", getUsers);

module.exports = router;
