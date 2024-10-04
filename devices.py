import requests
import psycopg2
from psycopg2 import sql
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# PostgreSQL connection details from environment variables
db_config = {
    'dbname': os.getenv('DB_NAME'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD'),
    'host': os.getenv('DB_HOST'),
    'port': os.getenv('DB_PORT', '5432')  # Default to port 5432 if not specified
}

# Define the URL for the POST request
url = "https://script.google.com/macros/s/AKfycbxNu27V2Y2LuKUIQMK8lX1y0joB6YmG6hUwB1fNeVbgzEh22TcDGrOak03Fk3uBHmz-/exec"  # Replace with the actual URL

# List of brand IDs and page numbers
brand_ids = [1, 9, 36, 46, 48, 58, 80, 82, 95, 107]
pages = range(1, 6)  # Pages 1 to 5

# Function to insert device data into PostgreSQL
def insert_into_postgres(data, brand_id):
    try:
        # Connect to the PostgreSQL database
        conn = psycopg2.connect(**db_config)
        cur = conn.cursor()

        # Insert data into the devices table
        insert_query = sql.SQL("""
            INSERT INTO devices (device_id, device_name, device_image_url, brand_id)
            VALUES (%s, %s, %s, %s)
            ON CONFLICT (device_id) DO NOTHING
        """)

        for item in data:
            cur.execute(insert_query, (item['key'], item['device_name'], item['device_image'], brand_id))

        # Commit changes and close the connection
        conn.commit()
        cur.close()
        conn.close()
        print(f"Data for brand ID {brand_id} successfully inserted into the devices table.")

    except Exception as e:
        print(f"Error occurred: {e}")

# Loop through brand IDs and pages to make POST requests
for brand_id in brand_ids:
    for page in pages:
        # Create the JSON payload for the POST request
        payload = {
            "route": "device-list-by-brand",
            "brand_id": brand_id,
            "brand_name": "Nokia",  # You can change this if needed
            "page": page
        }
        
        try:
            # Perform POST request
            response = requests.post(url, json=payload)
            
            # Check if the request was successful
            if response.status_code == 200:
                json_data = response.json()
                
                # Extract the 'device_list' field from the response JSON
                device_data = json_data['data'].get('device_list', [])
                
                # Insert the retrieved data into the PostgreSQL table
                insert_into_postgres(device_data, brand_id)
            else:
                print(f"Failed to retrieve data for brand ID {brand_id} on page {page}. Status code: {response.status_code}")

        except Exception as e:
            print(f"An error occurred during the POST request for brand ID {brand_id}, page {page}: {e}")
