from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from app.utils.auth import get_current_user
from app.models.user import UserInDB
from app.utils.database import get_database
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/patients", tags=["Patients"])

@router.get("/records")
async def get_patient_records(current_user: UserInDB = Depends(get_current_user)):
    """Get patient records for doctors"""
    if current_user.role != "doctor":
        raise HTTPException(status_code=403, detail="Access denied")
    
    db = get_database()
    if db is None:
        raise HTTPException(status_code=503, detail="Database connection unavailable")
    
    # Get predictions made by this doctor
    cursor = db.predictions.find({"doctor_id": current_user.id}).sort("created_at", -1)
    
    patient_records = []
    patient_ids = set()
    
    async for prediction in cursor:
        patient_id = prediction.get("patient_id", "Anonymous")
        if patient_id not in patient_ids:
            patient_ids.add(patient_id)
            
            # Get patient info if available
            patient_info = None
            if patient_id != "Anonymous":
                patient_info = await db.users.find_one({"_id": ObjectId(patient_id)})
            
            patient_records.append({
                "id": patient_id,
                "name": patient_info.get("full_name", "Anonymous Patient") if patient_info else "Anonymous Patient",
                "email": patient_info.get("email", "N/A") if patient_info else "N/A",
                "last_analysis": prediction["created_at"],
                "total_analyses": await db.predictions.count_documents({
                    "doctor_id": current_user.id,
                    "patient_id": patient_id
                }),
                "latest_result": prediction.get("class_prediction", "N/A")
            })
    
    return patient_records

@router.get("/analytics")
async def get_analytics(current_user: UserInDB = Depends(get_current_user)):
    """Get analytics data for doctors"""
    if current_user.role != "doctor":
        raise HTTPException(status_code=403, detail="Access denied")
    
    db = get_database()
    if db is None:
        raise HTTPException(status_code=503, detail="Database connection unavailable")
    
    # Get total analyses
    total_analyses = await db.predictions.count_documents({"doctor_id": current_user.id})
    
    # Get this month's analyses
    from datetime import datetime, timedelta
    start_of_month = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    this_month = await db.predictions.count_documents({
        "doctor_id": current_user.id,
        "created_at": {"$gte": start_of_month}
    })
    
    # Get unique patients
    pipeline = [
        {"$match": {"doctor_id": current_user.id}},
        {"$group": {"_id": "$patient_id"}},
        {"$count": "unique_patients"}
    ]
    unique_patients_result = await db.predictions.aggregate(pipeline).to_list(1)
    unique_patients = unique_patients_result[0]["unique_patients"] if unique_patients_result else 0
    
    return {
        "total_analyses": total_analyses,
        "this_month": this_month,
        "unique_patients": unique_patients,
        "accuracy_rate": 94.2  # Mock data
    }