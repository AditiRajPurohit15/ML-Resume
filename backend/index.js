require("dotenv").config()
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const axios = require("axios");


const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

app.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    console.log("/upload called");

    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const pdfBuffer = req.file.buffer;
    const result = await pdfParse(pdfBuffer);

    const resumeText = result.text;
    const jd = req.body.jobDescription;

    const response = await axios.post("http://localhost:5001/score", {
      resume: resumeText,
      jobDescription: jd,
    });

    return res.json({
      atsScore: response.data.score,
      missing_keywords: response.data.missing,
      // resumeText: resumeText,
      message: "ATS score generated successfully",
    });

  } catch (error) {
    console.log("Backend Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});



app.listen(5000, () => console.log(" Backend running on http://localhost:5000"));
