from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.utils.auth import get_current_user
from app.models.user import UserInDB
from app.models.prediction import PredictionHistory
from app.utils.database import get_database
from bson import ObjectId

router = APIRouter(prefix="/history", tags=["History"])

@router.get("/predictions", response_model=List[PredictionHistory])
async def get_prediction_history(current_user: UserInDB = Depends(get_current_user)):
    """Get prediction history for current user"""
    db = get_database()
    if db is None:
        raise HTTPException(status_code=503, detail="Database connection unavailable")
    
    if current_user.role == "doctor":
        # Doctors see their own predictions
        cursor = db.predictions.find({"doctor_id": current_user.id}).sort("created_at", -1)
    else:
        # Patients see predictions made for them
        cursor = db.predictions.find({"patient_id": current_user.id}).sort("created_at", -1)
    
    predictions = []
    async for prediction in cursor:
        prediction["id"] = str(prediction["_id"])
        prediction.pop("_id", None)
        predictions.append(prediction)
    
    return predictions

@router.get("/predictions/{prediction_id}")
async def get_prediction_details(prediction_id: str, current_user: UserInDB = Depends(get_current_user)):
    """Get specific prediction details"""
    db = get_database()
    if db is None:
        raise HTTPException(status_code=503, detail="Database connection unavailable")
    
    try:
        prediction = await db.predictions.find_one({"_id": ObjectId(prediction_id)})
        if not prediction:
            raise HTTPException(status_code=404, detail="Prediction not found")
        
        # Check access permissions
        if current_user.role == "doctor" and prediction["doctor_id"] != current_user.id:
            raise HTTPException(status_code=403, detail="Access denied")
        elif current_user.role == "patient" and prediction.get("patient_id") != current_user.id:
            raise HTTPException(status_code=403, detail="Access denied")
        
        prediction["id"] = str(prediction["_id"])
        prediction.pop("_id", None)
        return prediction
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))