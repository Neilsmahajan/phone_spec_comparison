import requests
import psycopg2
from psycopg2 import sql

# Define the URL for the GET request
url = "https://script.google.com/macros/s/AKfycbxNu27V2Y2LuKUIQMK8lX1y0joB6YmG6hUwB1fNeVbgzEh22TcDGrOak03Fk3uBHmz-/exec?route=brand-list"  # Replace with the actual URL

# PostgreSQL connection details
db_config = {
    'dbname': 'phonebase',
    'user': 'postgres',
    'password': 'password',
    'host': 'localhost',  # e.g., 'localhost' or AWS endpoint
    'port': '5432'  # Default PostgreSQL port
}

# Function to insert data into PostgreSQL
def insert_into_postgres(data):
    try:
        # Connect to the PostgreSQL database
        conn = psycopg2.connect(**db_config)
        cur = conn.cursor()

        # Insert data into the brands table
        insert_query = sql.SQL("""
            INSERT INTO brands (brand_id, brand_name)
            VALUES (%s, %s)
            ON CONFLICT (brand_id) DO NOTHING
        """)

        for item in data:
            cur.execute(insert_query, (item['brand_id'], item['brand_name']))

        # Commit changes and close the connection
        conn.commit()
        cur.close()
        conn.close()
        print("Data successfully inserted into the PostgreSQL table.")

    except Exception as e:
        print(f"Error occurred: {e}")

# Perform GET request
try:
    response = requests.get(url)
    
    # Check if the request was successful
    if response.status_code == 200:
        json_data = response.json()
        
        # Extract the 'data' field from the response JSON
        brand_data = json_data['data']
        
        # Insert the extracted data into the PostgreSQL table
        insert_into_postgres(brand_data)
    
    else:
        print(f"Failed to retrieve data. Status code: {response.status_code}")

except Exception as e:
    print(f"An error occurred during the GET request: {e}")
