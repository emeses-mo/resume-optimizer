export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Extract resume and job description from the request body
  const { resumeText, jobDescription } = req.body;

  // Log the incoming data for debugging purposes
  console.log("Received Resume Text:", resumeText);
  console.log("Received Job Description:", jobDescription);

  // Ensure both resumeText and jobDescription are provided
  if (!resumeText || !jobDescription) {
    return res.status(400).json({ error: 'Missing resumeText or jobDescription' });
  }

  // Construct the prompt for OpenAI based on the resume and job description
  const prompt = `
You are a resume optimization assistant.
Rewrite the following resume to better match the job description:
Resume: ${resumeText}
Job Description: ${jobDescription}

Output the optimized resume in plain text, preserving basic formatting.
`;

  try {
    // Send the prompt to the OpenAI API
    const response = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // Ensure your API key is set correctly in Vercel
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // GPT-3.5 Turbo model
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    // Check if the response from OpenAI is valid
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error from OpenAI API:", errorText);
      return res.status(500).json({ error: 'Error from OpenAI API' });
    }

    // Parse the response from OpenAI
    const data = await response.json();
    
    // Log the optimized resume for debugging purposes
    console.log("Optimized Resume:", data.choices[0].message.content);

    // Return the optimized resume to the frontend
    return res.status(200).json({ result: data.choices[0].message.content });
  } catch (error) {
    // Log any errors encountered during the API call
    console.error("Error in backend API:", error);
    return res.status(500).json({ error: 'Failed to process request' });
  }
}
