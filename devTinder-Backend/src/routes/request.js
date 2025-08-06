const express = require("express");
const requestRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const sendEmail = require("../utils/sendEmail");

// SEND REQUEST
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type: " + status });
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: "User not found!" });
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        return res
          .status(400)
          .send({ message: "Connection Request Already Exists!!" });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      // ✅ EMAIL NOTIFICATION ON CONNECTION REQUEST
      try {
  const subject = `💌 DevTinder: ${req.user.firstName} sent you a ${status} request!`;

  const body = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #e91e63;">👋 Hello ${toUser.firstName},</h2>

      <p style="font-size: 16px;">
        You’ve received a <strong style="color: #2196f3;">${status.toUpperCase()}</strong> connection request on <strong>DevTinder</strong> from:
      </p>

      <div style="margin: 20px 0; padding: 15px; background: #f9f9f9; border-radius: 6px;">
        <p><strong>💁 Sender Name:</strong> ${req.user.firstName} ${req.user.lastName || ""}</p>
        <p><strong>📧 Sender Email:</strong> ${req.user.emailId}</p>
      </div>

      <p style="font-size: 15px;">
        Log in to <strong>DevTinder</strong> now and check your <em>Requests</em> page to respond.
      </p>

      <a href="https://yourfrontenddomain.com/requests" target="_blank" style="display: inline-block; padding: 10px 20px; background: #4caf50; color: white; text-decoration: none; border-radius: 4px; margin-top: 20px;">
        ➤ View Request
      </a>

      <p style="margin-top: 30px; font-size: 14px; color: #888;">
        ✨ Thank you for using DevTinder!<br/>
        — Team DevTinder
      </p>
    </div>
  `;

  await sendEmail.run(subject, body, toUser.emailId);
} catch (emailError) {
  console.error("Email sending failed:", emailError.message);
}

      res.json({
        message:
          req.user.firstName + " is " + status + " in " + toUser.firstName,
        data,
      });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

// REVIEW REQUEST
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ messaage: "Status not allowed!" });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection request not found" });
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.json({ message: "Connection request " + status, data });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

module.exports = requestRouter;
