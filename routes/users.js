const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

// Creating User
router.post("/", checkUser, async (req, res) => {
  const user = new User({
    _id: req.body.userName,
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
router.post("/:id", getUser, async (req, res) => {
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

// Adding user to followed
router.patch("/:id/followed", checkFollow, async (req, res) => {
  res.user.followed = [...res.user.followed, req.body.followed];
  try {
    const updatedFollowList = await res.user.save();
    res.json(updatedFollowList);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Getting followed list
router.get("/:id/followed", getUser, (req, res) => {
  try {
    res.json(res.user.followed);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
      return res.status(401).json({ status: 401, taken: "Username", message: "Username already taken." });
    }
    emailCheck = await User.findOne({ "auth.email": req.body.email });
    if (emailCheck != null) {
      return res.status(402).json({ status: 402, taken: "Email", message: "Email already used." });
    }
  } catch (err) {
    return res.json({ message: err.message });
  }

  next();
}

async function checkFollow(req, res, next) {
  let followNameCheck, user;
  try {
    user = await User.findById(req.params.id);
    followNameCheck = await User.findOne({ userName: req.body.followed });
    if (followNameCheck == null) {
      return res.status(403).json({ status: 403, message: "Cannot find user" });
    }
  } catch (err) {
    return res.json({ message: err.message });
  }
  res.user = user;
  next();
}

module.exports = router;
