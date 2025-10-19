import sqlite3
import csv
import os

# Ensure the script connects to the correct database used by the Flask app
db_folder = os.path.join(os.path.dirname(__file__), 'data')
db_path = os.path.join(db_folder, 'reports.db')

# Connect to the SQLite database
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Query all data from the reports table
cursor.execute("SELECT * FROM report")

# Get column names
column_names = [description[0] for description in cursor.description]

# Fetch all the data rows
rows = cursor.fetchall()

# Write to CSV
with open('reports_export.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(column_names)  # Write header
    writer.writerows(rows)         # Write data

print("Exported to reports_export.csv")

# Close the connection
conn.close()