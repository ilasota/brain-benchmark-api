const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

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
router.post("/", checkUser, async (req, res) => {
  const user = new User({
    _id: req.body.userName.replace(/ /g, ""),
    userName: req.body.userName,
    auth: {
      password: await bcrypt.hash(req.body.password, 10),
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

// Checking user password
router.get("/:id", getUser, async (req, res) => {
  const loginSuccess = await bcrypt.compare(req.body.password, res.user.auth.password);
  try {
    res.json({ success: loginSuccess });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Getting user scores
router.get("/:id/scores", getUser, (req, res) => {
  try {
    res.json(res.user.scores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update scores
router.patch("/:id/scores", getUser, async (req, res) => {
  if (req.body.numberScore != null) {
    res.user.scores.numberScore = req.body.numberScore;
  }
  if (req.body.reactionScore != null) {
    res.user.scores.reactionScore = req.body.reactionScore;
  }
  if (req.body.speedScore != null) {
    res.user.scores.speedScore = req.body.speedScore;
  }
  if (req.body.chimpScore != null) {
    res.user.scores.chimpScore = req.body.chimpScore;
  }
  try {
    const updatedScore = await res.user.save();
    res.json(updatedScore.scores);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

async function getUser(req, res, next) {
  let user;
  try {
    user = await User.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: "Cannot find user." });
    }
  } catch (err) {
    return status(500).json({ message: err.message });
  }

  res.user = user;
  next();
}

async function checkUser(req, res, next) {
  let userNameCheck, emailCheck;
  try {
    userNameCheck = await User.findOne({ userName: req.body.userName });
    if (userNameCheck != null) {
      return res.status(401).json({ taken: true, message: "Username already taken." });
    }
    emailCheck = await User.findOne({ "auth.email": req.body.email });
    if (emailCheck != null) {
      return res.status(402).json({ taken: true, message: "Email already used." });
    }
  } catch (err) {
    return res.json({ message: err.message });
  }

  next();
}

module.exports = router;
