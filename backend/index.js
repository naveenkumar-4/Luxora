import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./config/db.js";
import { userRouter } from "./routes/user.routes.js";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 5000;

// app.use("/", (req, res) => {
//   res.send("Welcome to ECOM Server");
// });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/user", userRouter);
app.listen(PORT, () => {
  console.log(`Server is listening at PORT ${PORT}`);
  connectDB();
});
