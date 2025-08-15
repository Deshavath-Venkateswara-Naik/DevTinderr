import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { createSocketConnection } from "../utils/socket";
import { BASE_URL } from "../utils/constants";

const Chat = () => {
  const { targetUserId } = useParams();
  const user = useSelector((store) => store.user);
  const userId = user?._id;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [targetUserName, setTargetUserName] = useState("");
  const [targetUserAvatar, setTargetUserAvatar] = useState("");
  const [recording, setRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchChatMessages = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/chat/${targetUserId}`, { withCredentials: true });
      const chatMessages = (res.data.messages || []).map((msg) => ({
        _id: msg._id,
        senderId: msg.senderId?._id,
        firstName: msg.senderId?.firstName,
        lastName: msg.senderId?.lastName,
        avatar: msg.senderId?.avatar || "",
        text: msg.text,
        type: msg.type || (msg.audioUrl ? "audio" : "text"),
        audioUrl: msg.audioUrl,
        durationMs: msg.durationMs,
        createdAt: msg.createdAt,
      }));

      setMessages(chatMessages);

      const firstMsg = chatMessages.find((m) => m.senderId !== userId);
      if (firstMsg) {
        setTargetUserName(`${firstMsg.firstName} ${firstMsg.lastName || ""}`);
        setTargetUserAvatar(firstMsg.avatar || "");
      }
    } catch (err) {
      console.error("Failed to fetch chat messages", err);
    }
  };

  useEffect(() => {
    if (!userId) return;

    const socket = createSocketConnection();
    socketRef.current = socket;

    socket.emit("joinChat", { userId, targetUserId });

    socket.on("messageReceived", (msg) => setMessages((prev) => [...prev, msg]));

    return () => {
      socket.off("messageReceived");
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  useEffect(() => { fetchChatMessages(); }, [targetUserId]);
  useEffect(() => scrollToBottom(), [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const msgData = {
      userId,
      targetUserId,
      firstName: user.firstName,
      lastName: user.lastName,
      text: newMessage,
      type: "text",
      createdAt: new Date(),
      avatar: user.avatar || "",
    };

    socketRef.current?.emit("sendMessage", msgData);
    setMessages((prev) => [...prev, msgData]);
    setNewMessage("");
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mr = new MediaRecorder(stream, { mimeType: "audio/webm" });
      chunksRef.current = [];

      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = async () => {
        try {
          const blob = new Blob(chunksRef.current, { type: "audio/webm" });
          const form = new FormData();
          form.append("file", blob, `voice-${Date.now()}.webm`);

          await axios.post(`${BASE_URL}/upload-audio/${targetUserId}`, form, { withCredentials: true });
        } catch (err) {
          console.error("Audio upload failed", err);
        } finally {
          streamRef.current?.getTracks().forEach((t) => t.stop());
          setRecording(false);
          clearInterval(intervalRef.current);
          setRecordTime(0);
        }
      };

      mediaRecorderRef.current = mr;
      mr.start();
      setRecording(true);

      intervalRef.current = setInterval(() => setRecordTime((t) => t + 1), 1000);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = () => { mediaRecorderRef.current?.stop(); };

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="h-16 w-full flex items-center px-4 bg-gray-800 border-b border-gray-700">
        {targetUserAvatar && <img src={targetUserAvatar} alt="avatar" className="w-10 h-10 rounded-full mr-2" />}
        <span className="font-bold text-lg">{targetUserName || "Chat"}</span>
      </div>

      {/* Chat Box */}
      <div
        className="bg-gray-800 rounded-md overflow-y-auto p-4"
        style={{
          width: "calc(100% - 60px)",
          marginTop: "20px",
          marginBottom: "20px",
          minHeight: "400px",
          maxHeight: "60vh",
        }}
      >
        <div className="flex flex-col space-y-3">
          {messages.map((m) => {
            const isSender = m.senderId === userId;
            return (
              <div key={m._id || Math.random()} className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
                {!isSender && m.avatar && <img src={m.avatar} alt="avatar" className="w-8 h-8 rounded-full mr-2" />}
                <div className={`max-w-[70%] p-2 rounded-lg break-words ${isSender ? "bg-blue-700 text-white text-right" : "bg-gray-700 text-gray-100 text-left"}`}>
                  {m.type === "audio" && m.audioUrl ? (
                    <audio controls src={m.audioUrl} className="w-full mt-1 rounded" />
                  ) : (
                    <span>{m.text}</span>
                  )}
                  <div className="text-xs text-gray-300 mt-1 text-right">
                    {m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef}></div>
        </div>
      </div>

      {/* Input bar above footer */}
      <div className="fixed bottom-0 w-full flex justify-center" style={{ marginBottom: "60px" }}>
        <div
          className="flex p-3 border-t border-gray-700 bg-gray-800 items-center"
          style={{ width: "calc(100% - 60px)", height: "60px" }}
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage} className="ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Send
          </button>
          <button
            onClick={recording ? stopRecording : startRecording}
            className={`ml-2 px-4 py-2 rounded text-white ${recording ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
          >
            {recording ? `Stop (${formatTime(recordTime)})` : "🎤"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
