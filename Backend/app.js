const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const port = 8000;

// Define your Mongoose schema and model
const keeperSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Keeper = mongoose.model("keeper", keeperSchema);

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/keeperDB", {
      useNewUrlParser: true,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
}

// Start the server
async function startServer() {
  app.listen(port, () => {
    console.log(`Server connected on port ${port}`);
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Please check! An error has caused the app to crash!");
});

// API routes using async/await
app.get("/api", async (req, res, next) => {
  try {
    const result = await Keeper.find();
    res.send(result);
  } catch (err) {
    next(err);
  }
});

app.post("/api/addNew", async (req, res, next) => {
  const { title, content } = req.body;
  if (title.trim() === "" || content.trim() === "") {
    return res.status(404).send("Title or content cannot be empty");
  }
  try {
    const query = new Keeper({ title, content });

    await query.save();
    res.send("Successfully added new Note");
  } catch (err) {
    next(err);
  }
});

app.put("/api/update/:id", async (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  try {
    await Keeper.updateOne({ _id: id }, req.body);
    res.send("Patched successfully");
  } catch (err) {
    next(err);
  }
});

app.delete("/api/delete/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    await Keeper.deleteOne({ _id: id });
    res.send("Successfully deleted");
  } catch (err) {
    next(err);
  }
});

// Initialize the server and database connection
async function initialize() {
  await connectToDatabase();
  await startServer();
}

initialize();
