const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

// Include "location" in USER_SAFE_DATA
const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills location";

// Get all the pending connection requests for the logged-in user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

// Get all accepted connection requests for the logged-in user
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({ data });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// User feed (pagination with filtering out already connected/interested users)
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({ data: users });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Search users independently by name, location, or skills
userRouter.get("/user/search", userAuth, async (req, res) => {
  try {
    const { name, location, skill, page = 1, limit = 10 } = req.query;

    const queryConditions = [];

    if (name) {
      const regex = new RegExp(name, "i");
      queryConditions.push({ $or: [{ firstName: regex }, { lastName: regex }] });
    }

    if (location) {
      const regex = new RegExp(location, "i");
      queryConditions.push({ location: regex });
    }

    if (skill) {
      const regex = new RegExp(skill, "i");
      queryConditions.push({ skills: { $elemMatch: regex } });
    }

    const filter = queryConditions.length > 0 ? { $and: queryConditions } : {};

    const skip = (page - 1) * limit;

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(parseInt(limit));

    res.json({ data: users, total, currentPage: page });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = userRouter;
