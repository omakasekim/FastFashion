import openai
import os
import fitz  # PyMuPDF for reading PDFs
import re
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import nltk
from nltk.corpus import stopwords

nltk.download("stopwords")
STOPWORDS = set(stopwords.words("english"))
# OpenAI API Key
API_KEY = "" #replace with your own, use this for now

if not API_KEY:
    raise ValueError("Missing OpenAI API Key. Set it as an environment variable.")

openai_client = openai.OpenAI(api_key=API_KEY)


def extract_text_from_pdf(pdf_path):
    """Extracts text from a PDF file."""
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text("text") + "\n"
    return text.strip()

##############
def clean_text(text):
    """Preprocess text: remove special chars, convert to lowercase, remove stopwords."""
    text = re.sub(r"[^a-zA-Z0-9\s]", "", text.lower())
    text = " ".join(word for word in text.split() if word not in STOPWORDS)
    return text


def detect_greenwashing(report_text):
    prompt = f"""
    Analyze the following sustainability report and detect any inconsistencies, vague claims,
      or greenwashing attempts. 
    Highlight misleading statements and provide an overall reliability rating (0-100).

    Sustainability Report:
    {report_text}

    Response:
    """
    response = openai_client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content

def compare_reports(report_1, report_2):
    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform([clean_text(report_1), clean_text(report_2)])
    similarity_score = cosine_similarity(vectors)[0, 1]
    return similarity_score
if __name__ == "__main__":
    default_pdf_path = "data.pdf"

    if not os.path.exists(default_pdf_path):
        pdf_path = input("Default file 'data.pdf' not found. Enter PDF file path: ").strip()
    else:
        pdf_path = default_pdf_path
    if not os.path.exists(pdf_path):
        print("Error: PDF file not found.")
        exit(1)
    print("\nExtracting text from PDF...\n")
    report_text = extract_text_from_pdf(pdf_path)
    if not report_text:
        print("Error: No text extracted from PDF.")
        exit(1)
    print("\nAnalyzing report for greenwashing...\n")
    result = detect_greenwashing(report_text)
    print("AI Analysis Result:\n", result)

    # Example of comparing reports (can be expanded)
    known_report = """Company X is committed to sustainability by using eco-friendly 
    packaging and reducing carbon emissions."""
    similarity = compare_reports(report_text, known_report)
    print(f"\nReport Similarity Score (vs. known report): {similarity:.2f}")

    if similarity > 0.8:
        print("⚠️ High similarity detected! The report may be misleading or copied.")
