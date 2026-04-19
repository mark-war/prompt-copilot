export async function buildPrompt(data: any) {
  const res = await fetch("http://localhost:5000/api/prompts/build", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return res.json();
}

export async function getQuestions(category: string, genre: string) {
  const res = await fetch(
    `http://localhost:5000/api/prompts/questions/${category}/${genre}`
  );
  return res.json();
}