const express = require("express");
const { UserModel } = require("./models/schema");
const cors = require("cors");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { MovieListModel } = require("./models/movieList");
const { PlayListModel } = require("./models/playlist");

const numSaltRounds = 8;
require("./db/conn");

const app = express();
app.use(cors());
app.use(express.json());
const PORT = 3000;
const JWT_SECRET = "your_secret_key"; // Replace with your secret key

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

app.post("/userRegister", async (req, res) => {
  const { fname, lname, email, password } = req.body;
  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists. Please login.",
        status: "Fail",
      });
    }

    const hashedPassword = await bcryptjs.hash(password, numSaltRounds);
    const user = await UserModel.create({
      fname,
      lname,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({
      message: "User created successfully",
      status: "Success",
      token,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Failed to create user", status: "Fail" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(500).json({ message: "User not found" });
    }
    const correctpass = await bcryptjs.compare(password, user.password);
    if (correctpass) {
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
      res.status(200).json({ message: "User Logged In Successfully", token });
    } else {
      res.status(401).json({ message: "Invalid Credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "User not authenticated" });
  }
});

app.get("/getspecificuser/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await UserModel.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch the user" });
  }
});

app.get("/getuserRegister", async (req, res) => {
  try {
    const users = await UserModel.find().sort({ score: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch the users" });
  }
});

app.patch("/playlist/:id", async (req, res) => {
  const { id } = req.params;
  const { isPublic } = req.body;

  try {
    const playlist = await PlayListModel.findById(id);

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    if (isPublic !== undefined) {
      playlist.isPublic = isPublic;
    }
    await playlist.save();

    res
      .status(200)
      .json({ message: "Movie public id updated successfully", playlist });
  } catch (error) {
    res.status(500).json({ message: "Failed to update movie number", error });
  }
});

app.post("/playlist", async (req, res) => {
  const { name, movienum, userId, isPublic } = req.body;

  try {
    const plyLists = new PlayListModel({
      name,
      movienum,
      user: userId,
      isPublic,
    });

    await plyLists.save();
    res
      .status(201)
      .json({ message: "Movie list created successfully", plyLists });
  } catch (error) {
    console.error("Error creating movie list:", error);
    res.status(500).json({ message: "Failed to create movie list", error });
  }
});
app.get("/playlists/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const plyLists = await PlayListModel.find({ user: userId });
    res.status(200).json(plyLists);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch movie lists", error });
  }
});
app.post("/movielist", async (req, res) => {
  const { movie, playlist, isPublic } = req.body;
  try {
    const movieList = new MovieListModel({
      movie,
      playlist,
      isPublic,
    });
    await movieList.save();
    res
      .status(201)
      .json({ message: "Movie list created successfully", movieList });
  } catch (error) {
    res.status(500).json({ message: "Failed to create movie list", error });
  }
});
app.get("/movielists/:playID", async (req, res) => {
  const { playID } = req.params;
  try {
    const movieLists = await MovieListModel.find({ playlist: playID });
    res.status(200).json(movieLists);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch movie lists", error });
  }
});
app.get("/getplaylist/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const users = await PlayListModel.find({ _id: id });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch the users" });
  }
});
app.delete("/playlist/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const playlist = await PlayListModel.findByIdAndDelete(id);

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    res.status(200).json({ message: "Playlist deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete playlist", error });
  }
});
