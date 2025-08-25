const express = require("express");
const app = express();
const cors = require("cors");

const corsOption = {
  origin: "*",
  credential: true,
}
const { initializeDatabase } = require("../db/db.connect");
const Movie = require("../models/movie.models");

app.use(express.json());
initializeDatabase();

// ---------------- CREATE MOVIE ----------------
async function createMovie(newMovie) {
  try {
    const movie = new Movie(newMovie);
    const savedMovie = await movie.save();
    return savedMovie;
  } catch (error) {
    throw error;
  }
}

app.post("/movies", async (req, res) => {
  try {
    const savedMovie = await createMovie(req.body);
    res.status(201).json({ message: "Movie added successfully.", movie: savedMovie });
  } catch (error) {
    console.error("Error while saving movie:", error);
    res.status(500).json({ error: "Failed to add movie" });
  }
});

// ---------------- READ MOVIE BY DIRECTOR ----------------
async function readMovieByDirector(directorName) {
  try {
    return await Movie.find({ director: directorName });
  } catch (error) {
    throw error;
  }
}

app.get("/movies/director/:directorName", async (req, res) => {
  try {
    const movies = await readMovieByDirector(req.params.directorName);
    if (movies.length !== 0) {
      res.json(movies);
    } else {
      res.status(404).json({ error: "No movies found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movies." });
  }
});

// ---------------- READ MOVIE BY GENRE ----------------
async function readMovieByGenre(genreName) {
  try {
    return await Movie.find({ genre: genreName });
  } catch (error) {
    throw error;
  }
}

app.get("/movies/genres/:genreName", async (req, res) => {
  try {
    const movies = await readMovieByGenre(req.params.genreName);
    if (movies.length !== 0) {
      res.json(movies);
    } else {
      res.status(404).json({ error: "No movies found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movies." });
  }
});

// ---------------- READ MOVIE BY TITLE ----------------
async function readMovieByTitle(title) {
  try {
    return await Movie.findOne({ title: title });
  } catch (error) {
    throw error;
  }
}

app.get("/movies/:title", async (req, res) => {
  try {
    const movie = await readMovieByTitle(req.params.title);
    if (movie) {
      res.json(movie);
    } else {
      res.status(404).json({ error: "Movie Not Found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movie." });
  }
});

// ---------------- READ ALL MOVIES ----------------
async function readAllMovies() {
  try {
    return await Movie.find({});
  } catch (error) {
    throw error;
  }
}

app.get("/movies", async (req, res) => {
  try {
    const movies = await readAllMovies();
    if (movies.length !== 0) {
      res.json(movies);
    } else {
      res.status(404).json({ error: "No Movies Found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movies." });
  }
});

// ---------------- UPDATE MOVIE ----------------
async function updateMovie(movieId, dataToUpdate) {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(movieId, dataToUpdate, { new: true });
    return updatedMovie;
  } catch (error) {
    console.log("Error in updating the movie data", error);
  }
}

// ✅ Use PUT instead of POST
app.put("/movies/:movieId", async (req, res) => {
  try {
    const updatedMovie = await updateMovie(req.params.movieId, req.body);
    res.status(200).json({ message: "Movie updated successfully", movie: updatedMovie });
  } catch (error) {
    res.status(500).json({ error: "Failed to update movie" });
  }
});

// ---------------- DELETE MOVIE ----------------
async function deleteMovie(movieId) {
  try {
    const deletedMovie = await Movie.findByIdAndDelete(movieId);
    return deletedMovie;
  } catch (error) {
    console.log(error);
  }
}

app.delete("/movies/:movieId", async (req, res) => {
  try {
    const deletedMovie = await deleteMovie(req.params.movieId);
    res.status(200).json({ message: "Movie deleted successfully", movie: deletedMovie });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete the movie" });
  }
});

// ---------------- ROOT ROUTE ----------------
app.get("/", (req, res) => {
  res.send("Hello From Express on Vercel");
});

module.exports = app;
