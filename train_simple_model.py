import os
import json
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Flatten, Conv2D, MaxPooling2D, Dropout

def create_simple_model():
    """Create a simple CNN model for AFI classification"""
    model = Sequential([
        Conv2D(32, (3, 3), activation='relu', input_shape=(224, 224, 3)),
        MaxPooling2D(2, 2),
        Conv2D(64, (3, 3), activation='relu'),
        MaxPooling2D(2, 2),
        Conv2D(128, (3, 3), activation='relu'),
        MaxPooling2D(2, 2),
        Flatten(),
        Dense(128, activation='relu'),
        Dropout(0.3),
        Dense(3, activation='softmax')  # 3 classes: Normal, Low, High
    ])
    
    model.compile(
        optimizer='adam',
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    return model

def save_model_and_labels():
    """Create and save a simple model with labels"""
    model_dir = os.path.join(os.path.dirname(__file__), 'model', 'image_model')
    os.makedirs(model_dir, exist_ok=True)
    
    # Create model
    model = create_simple_model()
    
    # Save as SavedModel format
    model.save(model_dir, save_format='tf')
    print(f"✅ Model saved to: {model_dir}")
    
    # Save labels
    labels = ["Normal", "Low", "High"]
    labels_path = os.path.join(model_dir, 'labels.json')
    with open(labels_path, 'w') as f:
        json.dump(labels, f)
    print(f"✅ Labels saved to: {labels_path}")
    
    return model_dir

if __name__ == '__main__':
    save_model_and_labels()
    print("🎉 Simple model created successfully!")