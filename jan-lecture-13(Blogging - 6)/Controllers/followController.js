const express = require("express");
const FollowRouter = express.Router();
const User = require("../Models/User");
const {
  followUser,
  followingUsersList,
  followersUserList,
  unfollowUser,
} = require("../Models/follow");

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
});

FollowRouter.post("/following-list", async (req, res) => {
  const followerUserId = req.session.user.userId;
  const skip = req.query.skip || 0;

  //validate the userid
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
    const data = await followingUsersList({ followerUserId, skip });
    // console.log(data);

    if (data.length === 0) {
      return res.send({
        status: 200,
        message: "You have not followed anyone yet",
      });
    }

    return res.send({
      status: 200,
      message: "Read Successfull",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res.send({
      status: 400,
      message: "Read Unsuccessfull",
      error: error,
    });
  }
});

FollowRouter.post("/followers-list", async (req, res) => {
  const followingUserId = req.session.user.userId;
  const skip = req.query.skip || 0;

  //validate the userid
  try {
    await User.verifyUserId({ userId: followingUserId });
  } catch (err) {
    return res.send({
      status: 400,
      message: "Invalid UserId",
      error: err,
    });
  }

  try {
    const data = await followersUserList({ followingUserId, skip });

    if (data.length === 0) {
      return res.send({
        status: 200,
        message: "No follows you :(",
      });
    }

    return res.send({
      status: 200,
      message: "Read Successfull",
      data: data,
    });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Read Unsuccessfull",
      error: error,
    });
  }
});

FollowRouter.post("/unfollow-user", async (req, res) => {
  const followerUserId = req.session.user.userId; //test2
  const followingUserId = req.body.followingUserId; //test1

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

  try {
    const unfollowDb = await unfollowUser({ followerUserId, followingUserId });

    return res.send({
      status: 200,
      message: "Unfollowed Successfully",
      data: unfollowDb,
    });
  } catch (error) {
    console.log(error);
    return res.send({
      status: 400,
      message: "Database Error",
      error: error,
    });
  }
});

module.exports = FollowRouter;

//test1--test
//test1->test2
//test1-->test3
//test1-->test4

//test3-->test1
//test4-->test1
//test-->test1
