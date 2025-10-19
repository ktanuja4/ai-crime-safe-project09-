import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline
from sklearn.metrics import classification_report
import joblib
import os

# This script uses 'malicious_phish.csv' which should be in the same directory.
# It expects 'url' and 'label' columns.
DATASET_PATH = 'malicious_phish.csv'
PIPELINE_FILENAME = 'url_classifier_pipeline.joblib'

def train_and_save_url_model():
    """
    Loads URL data, trains a malicious URL classifier, and saves the model pipeline.
    """
    # 1. Load Data
    print(f"Loading dataset from '{DATASET_PATH}'...")
    try:
        # Use the correct column name 'label' from your CSV
        df = pd.read_csv(DATASET_PATH, header=0)
        # Ensure we only have 'benign' and 'malicious' labels to avoid ambiguity
        df = df[df['label'].isin(['benign', 'malicious'])]

        # Create a binary 'target' column: 0 for 'benign', 1 for anything else (malicious)
        df['target'] = df['label'].map({'benign': 0, 'malicious': 1})
        df = df[['url', 'target']]

    except FileNotFoundError:
        print(f"Error: Dataset not found at '{DATASET_PATH}'.")
        print("Please make sure 'malicious_phish.csv' is in the same directory as this script.")
        return
    except (KeyError, IndexError):
        print("Error: The dataset must contain 'url' and 'label' columns.")
        return

    # 2. Prepare Data
    X = df['url'].tolist()
    y = df['target']

    # 3. Split data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    # 4. Create and Train the Model Pipeline
    print("Training the URL classification model...")
    # A pipeline with TF-IDF and Logistic Regression works well for this task.
    pipeline = make_pipeline(TfidfVectorizer(analyzer='char', ngram_range=(1, 5)), LogisticRegression(max_iter=1000))
    pipeline.fit(X_train, y_train)

    # 5. Evaluate the Model (Optional)
    print("\n--- URL Model Evaluation ---")
    predictions = pipeline.predict(X_test)
    print(classification_report(y_test, predictions, target_names=['Benign', 'Malicious']))

    # 6. Save the entire pipeline to a single file
    print(f"Saving pipeline to '{PIPELINE_FILENAME}'...")
    joblib.dump(pipeline, PIPELINE_FILENAME)
    print("\nTraining complete. URL model pipeline has been saved successfully!")

if __name__ == '__main__':
    train_and_save_url_model()
