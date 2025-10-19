from flask import Flask, request, jsonify, send_from_directory, render_template
from flask_sqlalchemy import SQLAlchemy 
from flask_cors import CORS
import os
import PyPDF2
    
import joblib


db_folder = os.path.join(os.path.dirname(__file__), 'data')
os.makedirs(db_folder, exist_ok=True)
db_path = os.path.join(db_folder, 'reports.db')

# Configure the Flask app to serve the React build
app = Flask(__name__, static_folder='../crimeweb/build', static_url_path='/')

# In development, CORS is still needed for the React dev server.
# In production, Flask serves both, so this isn't strictly necessary.
CORS(app)
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{db_path}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Report(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phonenumber = db.Column(db.String(20), nullable=False)
    details = db.Column(db.String(500), nullable=False)

    def __repr__(self):
        return f"Report('{self.name}', '{self.email}', '{self.phonenumber}', '{self.details}')"


# --- Model and Vectorizer Loading ---
# For text/file spam
text_pipeline_path = os.path.join(os.path.dirname(__file__), "spam_classifier_pipeline.joblib")
try:
    text_pipeline = joblib.load(text_pipeline_path)
except FileNotFoundError:
    print(f"Error: Text model pipeline not found at '{text_pipeline_path}'. Please run train_model.py.")
    text_pipeline = None

# For URL classification
url_pipeline_path = os.path.join(os.path.dirname(__file__), "url_classifier_pipeline.joblib")
try:
    url_pipeline = joblib.load(url_pipeline_path)
except FileNotFoundError:
    print(f"Error: URL model pipeline not found at '{url_pipeline_path}'. Please run train_url_model.py.")
    url_pipeline = None


@app.route('/api/report', methods=['POST'])
def save_report():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    phonenumber = data.get('phone')
    details = data.get('details')
    report = Report(name=name, email=email, phonenumber=phonenumber, details=details)

    db.session.add(report)
    db.session.commit()
    return jsonify({'message': 'Report saved successfully'}), 201

@app.route('/analyse-file', methods=['POST'])
def analyse_file():
    if not text_pipeline:
        app.logger.error("Analysis request failed: Model pipeline is not loaded.")
        return jsonify({"error": "Model pipeline not loaded"}), 500

    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request.'}), 400

    file = request.files['file']

    app.logger.info(f"Received file for analysis: '{file.filename}' with content type '{file.content_type}'")
    if file.filename == '':
        return jsonify({'error': 'No file selected for uploading.'}), 400

    extracted_text = ""
    if file:
        try:
            if file.filename.endswith('.pdf'):
                pdf_reader = PyPDF2.PdfReader(file, strict=False)
                extracted_text = " ".join([page.extract_text() for page in pdf_reader.pages if page.extract_text()])
            elif file.filename.endswith('.txt'):
                extracted_text = file.read().decode('utf-8')
            else:
                return jsonify({'error': 'Unsupported file type. Please upload a PDF or TXT file.'}), 400
        except Exception as e:
            app.logger.error(f"Error processing file '{file.filename}': {e}")
            return jsonify({'error': f'Error processing file: {str(e)}'}), 500

    if not extracted_text or not extracted_text.strip():
        app.logger.warning(f"File '{file.filename}' contained no extractable text.")
        return jsonify({'result': 'NOT SPAM (ham)', 'info': 'File contained no text to analyze.'})

    # Log the extracted text for debugging
    app.logger.info(f"Extracted text for prediction: '{extracted_text[:500]}...'") # Log first 500 chars

    try:
        prediction = text_pipeline.predict([extracted_text])
        app.logger.info(f"Prediction for '{file.filename}': {prediction[0]}")
        result = "SPAM" if prediction[0] == 1 else "NOT SPAM (ham)"
        return jsonify({'result': result})
    except Exception as e:
        app.logger.error(f"Error during model prediction for file '{file.filename}': {e}")
        return jsonify({'error': f'Could not get a prediction: {str(e)}'}), 500

# --- New route for Jinja-based file analysis ---
@app.route('/analyse-view', methods=['GET', 'POST'])
def analyse_view():
    analysis_result = None
    if request.method == 'POST':
        if 'file' not in request.files:
            # In a real app, you'd handle this more gracefully
            return "No file part", 400
        
        file = request.files['file']
        if file.filename == '':
            return "No selected file", 400

        if file and text_pipeline:
            extracted_text = ""
            try:
                if file.filename.endswith('.pdf'):
                    pdf_reader = PyPDF2.PdfReader(file, strict=False)
                    extracted_text = " ".join([page.extract_text() for page in pdf_reader.pages if page.extract_text()])
                elif file.filename.endswith('.txt'):
                    extracted_text = file.read().decode('utf-8')
                
                prediction = text_pipeline.predict([extracted_text])
                
                analysis_result = "SPAM" if prediction[0] == 1 else "NOT SPAM (ham)"
            except Exception as e:
                analysis_result = f"Error processing file: {e}"

    return render_template('analysis_page.html', analysis_result=analysis_result)


@app.route('/predict', methods=['POST'])
def predict():
    if not text_pipeline:
        return jsonify({"error": "Model pipeline not loaded"}), 500

    data = request.json
    texts_to_predict = data.get('text', [])

    if not texts_to_predict:
        return jsonify({"error": "No text provided for prediction"}), 400

    # Handle both a single string and a list of strings
    if isinstance(texts_to_predict, str):
        texts_to_predict = [texts_to_predict]  # Convert single string to a list

    # Make a prediction using the pipeline
    predictions = text_pipeline.predict(texts_to_predict)

    results = []
    for prediction in predictions:
        results.append("SPAM" if prediction == 1 else "NOT SPAM (ham)")

    return jsonify({"results": results})


@app.route('/scam/url', methods=['POST'])
def detect_scam_from_url():
    data = request.get_json()
    url_to_check = data.get('url', "").strip()

    
    if not url_to_check:
        return jsonify({"error": "No URL provided"}), 400

    try:
        prediction = url_pipeline.predict([url_to_check])
        result = "Malicious" if prediction[0] == 1 else "Benign"
        return jsonify({'result': result, 'url': url_to_check})
    except Exception as e:
        return jsonify({'error': f'Could not get a prediction for the URL: {str(e)}'}), 500
    
# Catch-all route to serve the React app's index.html
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    # If the path is a file in the static folder, serve it
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    # Otherwise, serve the index.html and let React Router handle it
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()

    # Run test predictions only when script is executed directly and models are loaded
    if text_pipeline:

        print("\n--- Running Test Predictions ---")
        new_texts = [
            "Congratulations! You've won a FREE vacation! Call now to claim.",
            "Hey, what are you doing today? Just wanted to catch up.",
            "Congratulations! You've won a $500 gift card. Click here to claim your prize now",
            "WINNER! Urgent cash prize notification. Click link for details."
        ]
        
        predictions = text_pipeline.predict(new_texts)
   

        for text, prediction in zip(new_texts, predictions):
            result = "SPAM" if prediction == 1 else "NOT SPAM (ham)"
            print(f"'{text}' -> Prediction: {result}")
        
        print("--------------------------------\n")

    if url_pipeline:
        print("\n--- Running URL Test Predictions ---")
        test_urls = [
            "google.com",
            "youtube.com",
            "paypal.com.secure-login.xyz/update"
        ]
        predictions = url_pipeline.predict(test_urls)
        for url, pred in zip(test_urls, predictions):
            print(f"'{url}' -> Prediction: {'Malicious' if pred == 1 else 'Benign'}")



    app.run(debug=True , port=8000)
