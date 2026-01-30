from pymongo import MongoClient
from pymongo.errors import CollectionInvalid
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def init_mongodb():
    mongo_url = os.getenv("MONGO_URL", "mongodb://localhost:27017/")
    db_name = os.getenv("DATABASE_NAME", "amniotic_fluid_db")
    client = MongoClient(mongo_url)
    db = client[db_name]
    
    # Create collections if they don't exist
    try:
        db.create_collection("users")
    except CollectionInvalid:
        pass
    
    # Create indexes
    db.users.create_index("email", unique=True)
    
    print("Database initialized successfully")

if __name__ == "__main__":
    init_mongodb()