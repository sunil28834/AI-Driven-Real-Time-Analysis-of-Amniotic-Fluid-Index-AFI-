from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure
import os
import certifi
from dotenv import load_dotenv

# backend/app/utils/database.py

import os
from motor.motor_asyncio import AsyncIOMotorClient

# Load environment values
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "afi_health")

client = AsyncIOMotorClient(MONGO_URL)
db = client[DATABASE_NAME]

# Return db instance
def get_db():
    return db

# OPTIONAL: Create indexes for chatbot history
async def create_indexes():
    await db["chats"].create_index([("timestamp", -1)])
    await db["chats"].create_index("user_id")



load_dotenv()

class Database:
    client: AsyncIOMotorClient = None
    database = None

database = Database()

async def connect_to_mongo():
    try:
        mongo_url = os.getenv("MONGO_URL")
        database.client = AsyncIOMotorClient(
            mongo_url,
            serverSelectionTimeoutMS=5000,
            connectTimeoutMS=5000
        )
        database.database = database.client[os.getenv("DATABASE_NAME", "amniotic_fluid_db")]
        await database.client.admin.command('ping')
        print("✅ Connected to MongoDB")
    except Exception as e:
        print(f"❌ Failed to connect to MongoDB: {e}")
        print("⚠️  App will start without database connection")
        database.client = None
        database.database = None

async def close_mongo_connection():
    if database.client:
        database.client.close()
        print("✅ Disconnected from MongoDB")

def get_database():
    return database.database

