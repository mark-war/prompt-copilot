// routes/prompt.routes.js
import express from "express";
import { buildPrompt } from "../services/prompt.service.js";
import { questions } from "../data/questions.js";
import { refinePrompt } from "../services/ai.service.js";

const router = express.Router();

router.get("/questions/:category/:type", (req, res) => {
  const { category, type } = req.params;
  const builder = questions[category];

  if (!builder) {
    return res.status(404).json({ error: "Unknown category" });
  }

  // Call it as a function if it is one, otherwise use directly
  const result = typeof builder === "function" ? builder(type) : builder;
  res.json(result);
});

router.post("/build", async (req, res) => {
  const { category, answers } = req.body;

  try {
    const prompt = buildPrompt(category, answers);
    res.json({ prompt });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/preview", (req, res) => {
  const { category, answers } = req.body;
  const prompt = buildPrompt(category, answers);
  res.json({ prompt });
});

router.post("/refine", async (req, res) => {
  const { prompt, category } = req.body;

  try {
    const improved = await refinePrompt(
      `Improve and expand this prompt into a highly detailed, implementation-ready instruction:\n\n${prompt}`,
      category,
    );

    res.json({ prompt: improved });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
