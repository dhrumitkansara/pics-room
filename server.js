// Import statements and app configs
const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { v4: uuidv4 } = require("uuid");
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, { debug: true }); // Creating peer.js server

// Middlewares
app.set("view engine", "ejs");
app.use(express.static("public")); // Setting public URL for script.js file
app.use("/peerjs", peerServer);

// Routes
app.get("/", (req, res) => {
  res.render("main");
});

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

app.get("/test", (req, res) => {
  res.render("test");
});

app.get("/usie", (req, res) => {
  res.redirect(`/${uuidv4()}`); // Generates UUID on default route and redirects to /:room
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
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
