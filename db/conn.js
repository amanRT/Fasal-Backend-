const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://amanrt180:*dQuC4DWT$mq33_@cluster0.unuenrz.mongodb.net/Movie_Fasal"
  )
  .then(() => {
    console.log(`Connection successful`);
  })
  .catch((error) => {
    console.log(`Error connecting to MongoDB: ${error}`);
  });
