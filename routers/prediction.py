import os
import sys
import json
from typing import List
import numpy as np
from fastapi import APIRouter, HTTPException, Request, File, UploadFile, Depends
from fastapi.responses import JSONResponse
from PIL import Image
from importlib import import_module
import io
from datetime import datetime
from app.utils.auth import get_current_user
from app.models.user import UserInDB
from app.utils.database import get_database
from bson import ObjectId

router = APIRouter(prefix="/prediction")

base_router_dir = os.path.dirname(__file__)
model_dir = os.path.abspath(os.path.join(base_router_dir, "..", "..", "ml", "model"))
model_path = os.path.join(model_dir, "image_model")  # TF SavedModel directory
labels_path = os.path.join(model_dir, "image_model", "labels.json")

_model = None
_model_error = None
_class_names = None

def ensure_model():
    global _model, _model_error, _class_names
    if _model is not None:
        return _model, _class_names

    if not os.path.isdir(model_path):
        _model_error = f"Model directory not found: {model_path}. Please train the model first using backend/ml/train_model.py"
        print(f"⚠️  {_model_error}")
        return None, None

    try:
        # Lazy import TensorFlow to avoid import-time failures blocking app startup
        tf = import_module('tensorflow')
        print(f"🔄 Loading model from: {model_path}")
        
        # Keras 3 doesn't support SavedModel via load_model(), use tf.saved_model.load() instead
        try:
            # Try loading as SavedModel (Keras 3 compatible)
            _model = tf.saved_model.load(model_path)
            # Get the serving function (usually 'serve' endpoint)
            if hasattr(_model, 'signatures') and 'serve' in _model.signatures:
                _model = _model.signatures['serve']
            elif hasattr(_model, 'serving_default'):
                _model = _model.serving_default
            print("✅ Model loaded successfully as SavedModel!")
        except Exception as saved_model_error:
            # Fallback: try Keras load_model (for .h5 or .keras files)
            try:
                _model = tf.keras.models.load_model(model_path)
                print("✅ Model loaded successfully as Keras model!")
            except Exception as keras_error:
                raise Exception(f"SavedModel load failed: {saved_model_error}. Keras load failed: {keras_error}")
        
        # Load class names
        try:
            with open(labels_path, 'r') as f:
                _class_names = json.load(f)
            print(f"✅ Loaded {len(_class_names)} class labels: {_class_names}")
        except Exception as e:
            _model_error = f"Failed to load class names from {labels_path}: {e}"
            print(f"❌ {_model_error}")
            return None, None
            
        return _model, _class_names
    except Exception as e:
        _model_error = f"Failed to load model: {e}"
        print(f"❌ {_model_error}")
        return None, None

def preprocess_image(image_data: bytes) -> np.ndarray:
    """Preprocess image bytes into model input format."""
    try:
        # Open image from bytes
        img = Image.open(io.BytesIO(image_data))
        
        # Convert to RGB if needed
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Resize to model input size
        img = img.resize((224, 224))
        
        # Convert to numpy array and normalize
        img_array = np.array(img) / 255.0
        
        # Add batch dimension
        return np.expand_dims(img_array, axis=0)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to process image: {str(e)}")

@router.post("/predict_image")
async def predict_image(file: UploadFile = File(...), current_user: UserInDB = Depends(get_current_user)):
    """Predict AFI class from uploaded image."""
    model, class_names = ensure_model()
    if model is None:
        raise HTTPException(
            status_code=503,
            detail={"error": "Model not available", "reason": _model_error}
        )
    
    # Validate file type
    if not file.content_type.startswith('image/'):
        raise HTTPException(
            status_code=400,
            detail="File must be an image"
        )
    
    try:
        # Read and preprocess image
        image_data = await file.read()
        processed_image = preprocess_image(image_data)
        
        # Make prediction - handle both SavedModel and Keras model formats
        tf = import_module('tensorflow')
        
        # Convert numpy array to TensorFlow tensor
        input_tensor = tf.constant(processed_image, dtype=tf.float32)
        
        # Check if model is a SavedModel signature function or Keras model
        if callable(model) and not hasattr(model, 'predict'):
            # SavedModel signature function
            result = model(input_tensor)
            # Extract predictions from result (could be dict or tensor)
            if isinstance(result, dict):
                # Get first output value
                predictions = list(result.values())[0].numpy()
            else:
                predictions = result.numpy()
        else:
            # Keras model
            predictions = model.predict(processed_image, verbose=0)
        
        # Ensure predictions is 2D array
        if len(predictions.shape) == 1:
            predictions = predictions.reshape(1, -1)
        
        predicted_class_idx = int(np.argmax(predictions[0]))
        confidence = float(predictions[0][predicted_class_idx])
        
        # Save prediction to database (if available)
        db = get_database()
        prediction_id = None
        if db is not None:
            try:
                prediction_data = {
                    "class_prediction": class_names[predicted_class_idx],
                    "confidence": confidence,
                    "probabilities": {
                        class_name: float(prob) 
                        for class_name, prob in zip(class_names, predictions[0].tolist())
                    },
                    "doctor_id": current_user.id,
                    "image_filename": file.filename,
                    "created_at": datetime.now()
                }
                result = await db.predictions.insert_one(prediction_data)
                prediction_id = str(result.inserted_id)
            except Exception as db_error:
                print(f"⚠️  Failed to save prediction to database: {db_error}")
        
        return JSONResponse({
            "class": class_names[predicted_class_idx],
            "confidence": confidence,
            "probabilities": {
                class_name: float(prob) 
                for class_name, prob in zip(class_names, predictions[0].tolist())
            },
            "prediction_id": prediction_id
        })
        
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"❌ Prediction error: {error_details}")
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )