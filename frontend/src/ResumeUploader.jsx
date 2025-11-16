import { useState } from "react";
import axios from "axios";

function ResumeUploader() {
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState("");
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [missingKeywords, setMissingKeywords] = useState([]);

  const handleSubmit = async () => {
    if (!file || !jd) {
      alert("Please upload resume & enter job description");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jobDescription", jd);

      const response = await axios.post("http://localhost:5000/upload", formData);

      setScore(response.data.atsScore);
      setMissingKeywords(response.data.missing_keywords);
    } catch (error) {
      alert("Something went wrong, please try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 p-5">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-200">

        <h1 className="text-3xl font-bold text-center mb-6 text-indigo-600">
          ⚡ ATS Resume Scanner
        </h1>

        {/* Upload input */}
        <label className="block mb-4">
          <span className="text-sm font-medium mb-2 block">Upload Resume (PDF)</span>
          <input
            type="file"
            className="w-full bg-gray-50 border rounded-lg p-2 cursor-pointer"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </label>

        {/* Job Description */}
        <label>
          <span className="text-sm font-medium mb-2 block">Paste Job Description</span>
          <textarea
            placeholder="Paste Job Description here..."
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            className="w-full h-36 bg-gray-50 border p-3 rounded-lg resize-none outline-none mb-6"
          />
        </label>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition-all duration-300"
        >
          {loading ? "Scanning..." : "Generate ATS Score"}
        </button>

        {/* Loader */}
        {loading && (
          <div className="flex justify-center py-4">
            <div className="h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Score + Missing Keywords */}
        {score !== null && !loading && (
          <div className="mt-8 text-center">
            <h2 className="text-xl font-bold text-indigo-600">
              ✅ ATS Score: <span className="text-green-600">{score}</span>
            </h2>

            {missingKeywords.length > 0 && (
              <div className="mt-5 p-4 bg-red-50 border border-red-300 rounded-lg">
                <h3 className="text-lg font-semibold text-red-600 mb-2">Missing Keywords:</h3>

                <div className="flex flex-wrap gap-2 justify-center">
                  {missingKeywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-red-200 text-red-800 text-sm rounded-full"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ResumeUploader;
