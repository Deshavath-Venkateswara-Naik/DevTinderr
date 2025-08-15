const express = require("express");
const multer = require("multer");
const { userAuth } = require("../middlewares/auth");
const { Chat } = require("../models/chat");
const { cloudinary } = require("../services/cloudinary");;
const crypto = require("crypto");

const chatRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Generate consistent room ID
const getSecretRoomId = (userId, targetUserId) =>
  crypto.createHash("sha256")
        .update([userId.toString(), targetUserId.toString()].sort().join("$"))
        .digest("hex");

// Fetch chat messages
chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  const { targetUserId } = req.params;
  const userId = req.user._id;

  try {
    let chat = await Chat.findOne({ participants: { $all: [userId, targetUserId] } })
                         .populate("messages.senderId", "firstName lastName avatar");

    if (!chat) {
      chat = new Chat({ participants: [userId, targetUserId], messages: [] });
      await chat.save();
    }

    res.json(chat);
  } catch (err) {
    console.error("Fetch Chat Error:", err);
    res.status(500).json({ error: "Failed to fetch chat." });
  }
});

// Send text message
chatRouter.post("/chat/:targetUserId/message", userAuth, async (req, res) => {
  const { targetUserId } = req.params;
  const { text } = req.body;
  const userId = req.user._id;

  try {
    let chat = await Chat.findOne({ participants: { $all: [userId, targetUserId] } });
    if (!chat) chat = new Chat({ participants: [userId, targetUserId], messages: [] });

    const newMessage = { senderId: userId, type: "text", text, createdAt: new Date() };
    chat.messages.push(newMessage);
    await chat.save();

    const roomId = getSecretRoomId(userId, targetUserId);
    req.io.to(roomId).emit("messageReceived", {
      _id: newMessage._id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      avatar: req.user.avatar || "",
      userId,
      type: "text",
      text,
      createdAt: newMessage.createdAt,
    });

    res.status(201).json({ success: true, message: newMessage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send message." });
  }
});

// Upload audio message
chatRouter.post("/upload-audio/:targetUserId", userAuth, upload.single("file"), async (req, res) => {
  const { targetUserId } = req.params;
  const userId = req.user._id;

  if (!req.file) return res.status(400).json({ error: "No file provided" });

  const uploadStream = cloudinary.uploader.upload_stream(
    { resource_type: "video", folder: "chat/audio" },
    async (error, result) => {
      if (error) return res.status(500).json({ error: "Cloud upload failed" });

      let chat = await Chat.findOne({ participants: { $all: [userId, targetUserId] } });
      if (!chat) chat = new Chat({ participants: [userId, targetUserId], messages: [] });

      const newMessage = {
        senderId: userId,
        type: "audio",
        audioUrl: result.secure_url,
        text: "",
        durationMs: result.duration ? Math.round(result.duration * 1000) : undefined,
        createdAt: new Date(),
      };

      chat.messages.push(newMessage);
      await chat.save();

      const roomId = getSecretRoomId(userId, targetUserId);
      req.io.to(roomId).emit("messageReceived", {
        _id: newMessage._id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        avatar: req.user.avatar || "",
        userId,
        type: "audio",
        audioUrl: newMessage.audioUrl,
        durationMs: newMessage.durationMs,
        createdAt: newMessage.createdAt,
      });

      res.json({ success: true, message: newMessage });
    }
  );

  uploadStream.end(req.file.buffer);
});

module.exports = chatRouter;
