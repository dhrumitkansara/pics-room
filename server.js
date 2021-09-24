// Import statements and app configs
const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { v4: uuidv4 } = require("uuid");
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, { debug: true }); // Creating peer.js server

// DB imports
const mongoose = require("mongoose");
const adminData = require("./models/userModel.js");
const captureData = require("./models/captureModel.js");

// Middlewares
app.set("view engine", "ejs");
app.use(express.static("public")); // Setting public URL for script.js file
app.use("/peerjs", peerServer);
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

// DB configs
const connectionUrl =
  "mongodb+srv://admin:sTBZT8EwBf3HPxeO@cluster0.sgrtp.mongodb.net/picsRoom?retryWrites=true&w=majority";
mongoose.connect(connectionUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
app.get("/", (req, res) => {
  res.render("main");
});

// Admin routes
app.get("/signin", (req, res) => {
  res.render("admin/adminSignin");
});

app.get("/dashboard", (req, res) => {
  res.render("admin/adminDash");
});

// User routes
app.get("/select-selfie", (req, res) => {
  res.render("selfieOptions");
});

app.get("/filters", (req, res) => {
  res.render("filters");
});

app.get("/glasses", (req, res) => {
  res.render("glasses");
});

app.get("/facemask", (req, res) => {
  res.render("facemask");
});

app.get("/virtual-background", (req, res) => {
  res.render("virtualBackground");
});

app.get("/selfie", (req, res) => {
  res.render("selfie");
});

app.get("/group-selfie", (req, res) => {
  res.render("group");
});

app.get("/usie", (req, res) => {
  res.redirect(`/${uuidv4()}`); // Generates UUID on default route and redirects to /:room
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

// Data endpoints

// Save admin data endpoint
app.post("/admin-signup", (req, res) => {
  let userData = {
    email: "dhrumit@cactuscreatives.com",
    password: "admin@123",
  };
  adminData.create(userData, (err, data) => {
    if (err) {
      console.log("Error saving admin data: ", err);
      res.status(500).send(err);
    } else {
      console.log("Admin data saved: ", userData);
      res.status(201).send(data);
    }
  });
});

// Save captured image endpoint
app.post("/save-capture-data", (req, res) => {
  let capturedUrl = { imageUrl: req.body.data }; // Extracting image url from request body

  // Creating document in captured collection
  captureData.create(capturedUrl, (err, data) => {
    if (err) {
      console.log("Error saving captured image data: ", err);
      res.status(500).send(err);
    } else {
      console.log("Image data saved: ", capturedUrl);
      res.status(201).send(data);
    }
  });
});

// On connection or when visit to site
io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId); // Joining room with specified id
    socket.to(roomId).emit("user-connected", userId); // Emitting that the user with id has joined the room

    socket.on("disconnect", () => {
      socket.to(roomId).emit("user-disconnected", userId);
    });
  });
});

// Listen
server.listen(port, () => {
  console.log("Server started! Running at port:", port);
});
