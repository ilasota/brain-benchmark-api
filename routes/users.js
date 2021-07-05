const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Getting All Users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Creating User
router.post("/", async (req, res) => {
  const user = new User({
    _id: req.body.userName.replace(/ /g, ""),
    userName: req.body.userName,
    auth: {
      password: req.body.password,
      email: req.body.email,
    },
  });

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
});

module.exports = router;
