const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    // Updated OpenAI API call syntax
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
    });

    res.json(response);
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).send("Something went wrong!");
  }
});

// In your server.js file, make sure the server listens on all interfaces
// app.listen(8081, '0.0.0.0', () => {
//   console.log('Server running on port 8081');
// });

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
