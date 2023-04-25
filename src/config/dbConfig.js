import mongoose from "mongoose";

// db connection
const connectdb = async () => {
  const URL = process.env.DB_BASE_URL;

  // Database Name
  const dbName = process.env.DB_NAME;
  console.log("URL>>", URL, dbName);
  await mongoose.connect(
    `${URL}/${dbName}`,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
    (error) => {
      if (!error) {
        console.log("Database Connected successfully to server");
      } else {
        console.log("Database not Connected to server");
      }
    }
  );
};

export default connectdb;
