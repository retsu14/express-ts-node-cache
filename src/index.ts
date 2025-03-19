import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDb from "./dbConfig/db";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "Bearer"],
  })
);

connectDb();

app.use("/api/auth", require("./routes/auth-routes"));

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
