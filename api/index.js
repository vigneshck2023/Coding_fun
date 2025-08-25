const express = require("express");
const cors = require("cors");
const app = express();

const { initializeDatabase } = require("../db/db.connect");
const Movie = require("../models/movie.models");

app.use(express.json());
app.use(cors({ origin: "*", credentials: true }));

initializeDatabase();

// ---------------- CREATE MOVIE ----------------
app.post("/movies", async (req, res) => {
  try {
    const movie = new Movie(req.body);
    const savedMovie = await movie.save();
    res.status(201).json({ message: "Movie added successfully.", movie: savedMovie });
  } catch (error) {
    console.error("Error while saving movie:", error);
    res.status(500).json({ error: "Failed to add movie" });
  }
});

// ---------------- READ ALL MOVIES ----------------
app.get("/movies", async (req, res) => {
  try {
    const movies = await Movie.find({});
    if (movies.length !== 0) {
      res.json(movies);
    } else {
      res.status(404).json({ error: "No Movies Found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movies." });
  }
});

// ---------------- READ MOVIE BY DIRECTOR ----------------
app.get("/movies/director/:directorName", async (req, res) => {
  try {
    const movies = await Movie.find({ director: req.params.directorName });
    movies.length !== 0
      ? res.json(movies)
      : res.status(404).json({ error: "No movies found" });
  } catch {
    res.status(500).json({ error: "Failed to fetch movies." });
  }
});

// ---------------- READ MOVIE BY GENRE ----------------
app.get("/movies/genre/:genreName", async (req, res) => {
  try {
    const movies = await Movie.find({ genre: req.params.genreName });
    movies.length !== 0
      ? res.json(movies)
      : res.status(404).json({ error: "No movies found." });
  } catch {
    res.status(500).json({ error: "Failed to fetch movies." });
  }
});

// ---------------- READ MOVIE BY TITLE ----------------
app.get("/movies/title/:title", async (req, res) => {
  try {
    const movie = await Movie.findOne({ title: req.params.title });
    movie
      ? res.json(movie)
      : res.status(404).json({ error: "Movie Not Found" });
  } catch {
    res.status(500).json({ error: "Failed to fetch movie." });
  }
});

// ---------------- UPDATE MOVIE ----------------
app.put("/movies/:movieId", async (req, res) => {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.movieId,
      req.body,
      { new: true }
    );
    res.status(200).json({ message: "Movie updated successfully", movie: updatedMovie });
  } catch {
    res.status(500).json({ error: "Failed to update movie" });
  }
});

// ---------------- DELETE MOVIE ----------------
app.delete("/movies/:movieId", async (req, res) => {
  try {
    const deletedMovie = await Movie.findByIdAndDelete(req.params.movieId);
    res.status(200).json({ message: "Movie deleted successfully", movie: deletedMovie });
  } catch {
    res.status(500).json({ error: "Failed to delete the movie" });
  }
});

// ---------------- ROOT ROUTE ----------------
app.get("/", (req, res) => {
  res.send("Hello From Express on Vercel 🚀");
});

module.exports = app;
