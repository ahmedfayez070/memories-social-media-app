const express = require("express");

const router = express.Router();

// import posts controller functions
const { signin, signup } = require("../controllers/usersController");

router.post("/signin", signin);

router.post("/signup", signup);

module.exports = router;
