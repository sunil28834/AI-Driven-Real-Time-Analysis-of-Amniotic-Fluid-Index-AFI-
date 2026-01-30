import json
import os
from typing import Dict, List, Optional

class LocalDB:
    def __init__(self, db_file: str = "local_db.json"):
        self.db_file = db_file
        self.data = self._load_data()
    
    def _load_data(self) -> Dict:
        if os.path.exists(self.db_file):
            with open(self.db_file, 'r') as f:
                return json.load(f)
        return {"users": []}
    
    def _save_data(self):
        with open(self.db_file, 'w') as f:
            json.dump(self.data, f, indent=2)
    
    def find_user(self, email: str) -> Optional[Dict]:
        for user in self.data["users"]:
            if user["email"] == email:
                return user
        return None
    
    def create_user(self, user_data: Dict) -> Dict:
        user_data["id"] = str(len(self.data["users"]) + 1)
        self.data["users"].append(user_data)
        self._save_data()
        return user_data

# Global instance
local_db = LocalDB()