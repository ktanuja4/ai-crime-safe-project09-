import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline
from sklearn.metrics import classification_report
import joblib
import os
 
# --- Configuration ---
# NOTE: You need to provide your own dataset.
# This script assumes a CSV file named 'spam_dataset.csv' with two columns:
# - 'label': contains 'ham' or 'spam'
# - 'text': contains the message content
DATASET_PATH = 'spam_dataset.csv' 
# --- Configuration --- 
# Set USE_CRIME_DATA to True to train on your custom crime dataset.

DATASET_PATH = 'spam_dataset.csv'
PIPELINE_FILENAME = 'spam_classifier_pipeline.joblib'

def train_and_save_model():
    """
    Loads data, trains a spam classifier, and saves the model and vectorizer.
    """
    # 1. Load Data
    print(f"Loading dataset from '{DATASET_PATH}'...")
    try:
        # Use latin-1 encoding as it's common for this type of dataset
        df = pd.read_csv(DATASET_PATH, encoding='latin-1')
        # Keep only the necessary columns and rename them for clarity
        df = df[['v1', 'v2']]
        df.columns = ['label', 'text']

    except FileNotFoundError:
        print(f"Error: Dataset not found at '{DATASET_PATH}'.")
        print("Please download a spam dataset (e.g., from Kaggle) and place it in this directory.")
        return

    # 2. Prepare Data
    # Convert labels ('spam'/'ham') to binary format (1/0)
    df['label'] = df['label'].map({'spam': 1, 'ham': 0})
    X = df['text'].tolist()  # Convert the 'text' column to a Python list
    y = df['label']

    # 3. Split data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    # 4. Create and Train the Model Pipeline
    print("Training the model...")
    # The pipeline combines vectorizing (with a fixed number of features) and classifying
    pipeline = make_pipeline(TfidfVectorizer(max_features=5000), MultinomialNB())
    pipeline.fit(X_train, y_train)

    # 5. Evaluate the Model (Optional)
    print("\n--- Model Evaluation ---")
    predictions = pipeline.predict(X_test)
    print(classification_report(y_test, predictions, target_names=['Not Spam (ham)', 'Spam']))

    # 6. Save the entire pipeline to a single file
    print(f"Saving pipeline to '{PIPELINE_FILENAME}'...")
    joblib.dump(pipeline, PIPELINE_FILENAME)
    print("\nTraining complete. Model pipeline has been saved successfully!")

if __name__ == '__main__':
    train_and_save_model()