import express from "express";
import dotenv from "dotenv";
dotenv.config();
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import { connectDB } from "./config/db.js";
import { errorHandler, notFound } from "./middlewares/ErrorHandler.js";

import { userRouter } from "./routes/user.routes.js";
const app = express();
const PORT = process.env.PORT || 5000;

// app.use("/", (req, res) => {
//   res.send("Welcome to ECOM Server");
// });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/api/user", userRouter);

app.use(notFound);
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server is listening at PORT ${PORT}`);
  connectDB();
});
