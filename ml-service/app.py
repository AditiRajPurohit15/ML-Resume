from flask import Flask, request
from sklearn.feature_extraction.text import TfidfVectorizer, ENGLISH_STOP_WORDS
from sklearn.metrics.pairwise import cosine_similarity
import re

app = Flask(__name__)

def extract_keywords(text):
    text = text.lower()
    text = re.sub(r"[^a-zA-Z0-9]+", " ", text)
    words = text.split()
    keywords = [word for word in words if word not in ENGLISH_STOP_WORDS]
    return set(keywords)

@app.route("/score", methods=["POST"])
def ats_score():
    data = request.json
    resume = data["resume"]
    jd = data["jobDescription"]

   
    resume_keywords = extract_keywords(resume)
    jd_keywords = extract_keywords(jd)

    print("Resume Keywords:", resume_keywords)
    print("Job Description Keywords:", jd_keywords)

    missing_keywords = jd_keywords - resume_keywords
    print("Missing keywords:", missing_keywords)


    vectorizer = TfidfVectorizer(stop_words='english')
    vectors = vectorizer.fit_transform([resume, jd])
    similarity = cosine_similarity(vectors)[0][1] * 100

    return {
        "score": round(similarity, 2),
        "missing": list(missing_keywords)
        }

if __name__ == "__main__":
    app.run(port=5001, debug=True)
