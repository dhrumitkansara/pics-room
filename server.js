// Import statements and app configs
const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 4000;
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, { debug: true }); // Creating peer.js server
const session = require("express-session");
const cookieParser = require("cookie-parser");
let oneDay = 1000 * 60 * 60 * 24;

// Routes import
let selfieRoutes = require("./routes/selfie-routes");
let adminRoutes = require("./routes/admin-routes");

// DB imports
const mongoose = require("mongoose");
const captureData = require("./models/capture-model");

// Middlewares
app.set("view engine", "ejs");
app.use(express.static("public")); // Setting public URL for script.js file
app.use("/peerjs", peerServer);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);
app.use(cookieParser());

// Routes middleware
app.use("/selfie", selfieRoutes);
app.use("/admin", adminRoutes);
app.use((req, res, next) => {
  if (req.session == null) {
    res.redirect("/admin/signin");
  } else {
    next();
  }
});

// DB configs
mongoose.connect(process.env.CONNECTION_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Default route
app.get("/", (req, res) => {
  res.render("main");
});

// Save captured image endpoint
app.post("/save-capture-data", (req, res) => {
  const capturedData = {
    imageUrl: req.body.imageUrl,
    event: { _id: req.body.event, _ref: "events" },
  };

  // Creating document in captured collection
  captureData.create(capturedData, (err, data) => {
    if (err) {
      console.log("Error saving captured image data: ", err);
      res.status(500).send(err);
    } else {
      console.log("Image data saved: ", capturedData);
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
