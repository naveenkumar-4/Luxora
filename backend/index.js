import express from "express";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use("/", (req, res) => {
  res.send("Welcome to ECOM Server");
});
app.listen(PORT, () => {
    console.log(`Server is listening at PORT ${PORT}`);
}); 
