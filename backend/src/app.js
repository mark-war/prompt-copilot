import express from "express";
import cors from "cors";
import promptRoutes from "./routes/prompt.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/prompts", promptRoutes);

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});