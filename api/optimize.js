export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { resumeText, jobDescription } = req.body;

  const prompt = `
You are a resume optimization assistant.
Rewrite the following resume to better match the job description:
Resume:
${resumeText}

Job Description:
${jobDescription}

Return the optimized resume in plain text format.
`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  return res.status(200).json({ result: data.choices[0].message.content });
}
