import express from "express";
import dotenv from "dotenv";
dotenv.config();
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import { connectDB } from "./config/db.js";
import { errorHandler, notFound } from "./middlewares/ErrorHandler.js";

import { userRouter } from "./routes/user.routes.js";
import { productRouter } from "./routes/product.routes.js";
import { blogRouter } from "./routes/blog.routes.js";
import { productCategoryRouter } from "./routes/product.category.routes.js";
import { blogCategoryRouter } from "./routes/blogCat.route.js";
import { brandRouter } from "./routes/brand.routes.js";
const app = express();
const PORT = process.env.PORT || 5000;

// app.use("/", (req, res) => {
//   res.send("Welcome to ECOM Server");
// });

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/blog", blogRouter);
app.use("/api/category", productCategoryRouter);
app.use("/api/blogCategory", blogCategoryRouter);
app.use("/api/brand", brandRouter);

app.use(notFound);
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server is listening at PORT ${PORT}`);
  connectDB();
});
