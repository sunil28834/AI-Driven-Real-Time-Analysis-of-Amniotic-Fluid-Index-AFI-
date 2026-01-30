from pydantic import BaseModel
from typing import Dict, Optional
from datetime import datetime

class PredictionRequest(BaseModel):
    patient_id: Optional[str] = None
    doctor_id: str

class PredictionResponse(BaseModel):
    id: str
    class_prediction: str
    confidence: float
    probabilities: Dict[str, float]
    patient_id: Optional[str] = None
    doctor_id: str
    image_filename: str
    created_at: datetime
    
class PredictionHistory(BaseModel):
    id: str
    class_prediction: str
    confidence: float
    probabilities: Dict[str, float]
    patient_id: Optional[str] = None
    doctor_id: str
    image_filename: str
    created_at: datetime
    notes: Optional[str] = None