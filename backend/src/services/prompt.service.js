// services/prompt.service.js
import { buildGamePrompt } from "../builders/game.builder.js";
import { buildCodingPrompt } from "../builders/coding.builder.js";
import { buildWritingPrompt } from "../builders/writing.builder.js";
import { buildImagePrompt } from "../builders/image.builder.js";
import { buildMarketingPrompt } from "../builders/marketing.builder.js";
import { buildCareerPrompt } from "../builders/career.builder.js";

export function buildPrompt(category, answers) {
  switch (category) {
    case "game":
      return buildGamePrompt(answers);
    case "coding":
      return buildCodingPrompt(answers);
    case "writing":
      return buildWritingPrompt(answers);
    case "image":
      return buildImagePrompt(answers.type, answers);
    case "marketing":
      return buildMarketingPrompt(answers.type, answers);
    case "career":
      return buildCareerPrompt(answers.type, answers);
    default:
      throw new Error("Unsupported category");
  }
}
