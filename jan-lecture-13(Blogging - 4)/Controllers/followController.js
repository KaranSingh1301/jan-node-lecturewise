const express = require("express");
const FollowRouter = express.Router();
const User = require("../Models/User");
const { followUser } = require("../Models/follow");

FollowRouter.post("/follow-user", async (req, res) => {
  const followerUserId = req.session.user.userId;
  const followingUserId = req.body.followingUserId;

  //validate the id's
  try {
    await User.verifyUserId({ userId: followerUserId });
  } catch (err) {
    return res.send({
      status: 400,
      message: "Invalid Follower UserId",
      error: err,
    });
  }

  try {
    await User.verifyUserId({ userId: followingUserId });
  } catch (err) {
    return res.send({
      status: 400,
      message: "Invalid Following UserId",
      error: err,
    });
  }

  //create a follow entry

  try {
    const followDb = await followUser({ followingUserId, followerUserId });

    return res.send({
      status: 200,
      message: "Follow created Successfully",
      data: followDb,
    });
  } catch (error) {
    return res.send({
      status: 401,
      message: "Database error",
      error: error,
    });
  }

  return res.send(true);
});

module.exports = FollowRouter;

//A--follow-->B
