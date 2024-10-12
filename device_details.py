import json
import psycopg2
from datetime import datetime

# Database connection parameters
DB_NAME = "phonebase"
DB_USER = "postgres"
DB_PASSWORD = ""
DB_HOST = "localhost"
DB_PORT = "5432"

# Function to read JSON data from file
def read_json_file(file_path):
    with open(file_path, 'r') as file:
        return json.load(file)

# Function to insert data into the database
def insert_data(conn, data):
    with conn.cursor() as cur:
        for device in data:
            # Replace empty values with 'N/A'
            for key, value in device.items():
                if value == "":
                    device[key] = "N/A"
            
            # Convert release_date to proper date format
            if device['release_date'] != "N/A":
                device['release_date'] = datetime.strptime(device['release_date'], "%Y-%m-%d").date()
            else:
                device['release_date'] = None

            # Insert data into the table
            cur.execute("""
                INSERT INTO device_details (
                    device_id, device_name, device_image_url, display_size, display_res,
                    camera, video, ram, chipset, battery, battery_type, release_date,
                    body, os_type, storage, price
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                device['device_id'], device['device_name'], device['device_image_url'],
                device['display_size'], device['display_res'], device['camera'],
                device['video'], device['ram'], device['chipset'], device['battery'],
                device['battery_type'], device['release_date'], device['body'],
                device['os_type'], device['storage'], device['price']
            ))
    
    conn.commit()

# Main function
def main():
    try:
        # Connect to the database
        conn = psycopg2.connect(
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            host=DB_HOST,
            port=DB_PORT
        )

        # Read JSON data
        data = read_json_file('samsung.json')

        # Insert data into the database
        insert_data(conn, data)

        print("Data inserted successfully!")

    except (Exception, psycopg2.Error) as error:
        print(f"Error: {error}")

    finally:
        if conn:
            conn.close()
            print("Database connection closed.")

if __name__ == "__main__":
    main()
