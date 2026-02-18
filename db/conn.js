const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://amanrt180:5uo0Ro6hnSnCkIqq@cluster0.1usbt.mongodb.net/Movies",
  )
  .then(() => {
    console.log(`Connection successful`);
  })
  .catch((error) => {
    console.log(`Error connecting to MongoDB: ${error}`);
  });
