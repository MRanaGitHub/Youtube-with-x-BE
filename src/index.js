import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 800, () => {
      console.log(`Server is running at port : ${proces.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(`Mongo DB connection failed !!`, error);
  });
