import os
import json
from pathlib import Path
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from sklearn.metrics import classification_report, confusion_matrix

def prepare_data_generators(train_dir, img_size=(224, 224), batch_size=32):
    """
    Create data generators for training and validation using ImageDataGenerator.
    Uses the same augmentation settings as the notebook.
    """
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        validation_split=0.2
    )

    train_generator = train_datagen.flow_from_directory(
        train_dir,
        target_size=img_size,
        batch_size=batch_size,
        class_mode='categorical',
        subset='training'
    )

    val_generator = train_datagen.flow_from_directory(
        train_dir,
        target_size=img_size,
        batch_size=batch_size,
        class_mode='categorical',
        subset='validation'
    )

    return train_generator, val_generator

def build_model(input_shape=(224, 224, 3), num_classes=3):
    """
    Build the same CNN architecture as used in the notebook.
    """
    model = Sequential([
        Conv2D(32, (3,3), activation='relu', input_shape=input_shape),
        MaxPooling2D(2,2),
        
        Conv2D(64, (3,3), activation='relu'),
        MaxPooling2D(2,2),
        
        Conv2D(128, (3,3), activation='relu'),
        MaxPooling2D(2,2),
        
        Flatten(),
        Dense(128, activation='relu'),
        Dropout(0.3),
        Dense(num_classes, activation='softmax')
    ])
    
    model.compile(
        optimizer='adam',
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    return model

def train_model(train_dir, model_dir=None, img_size=(224, 224), batch_size=32, epochs=25):
    """
    Train the CNN model using data from train_dir.
    Saves the model and class mapping to model_dir.
    """
    if model_dir is None:
        model_dir = os.path.join(os.path.dirname(__file__), 'model', 'image_model')

    # Prepare data generators
    train_generator, val_generator = prepare_data_generators(
        train_dir, img_size=img_size, batch_size=batch_size
    )

    # Build and compile model
    model = build_model(input_shape=img_size + (3,), num_classes=len(train_generator.class_indices))

    # Ensure model directory exists
    os.makedirs(model_dir, exist_ok=True)
    
    # Callbacks for model saving and early stopping
    # Use a checkpoint file pattern for ModelCheckpoint
    checkpoint_path = os.path.join(model_dir, 'checkpoints', 'cp-{epoch:02d}-{val_loss:.2f}.ckpt')
    os.makedirs(os.path.dirname(checkpoint_path), exist_ok=True)
    
    callbacks = [
        tf.keras.callbacks.EarlyStopping(
            monitor='val_loss',
            patience=3,
            restore_best_weights=True
        ),
        tf.keras.callbacks.ModelCheckpoint(
            checkpoint_path,
            monitor='val_loss',
            save_best_only=True,
            save_weights_only=False,
            save_format='tf'
        )
    ]

    # Train the model
    history = model.fit(
        train_generator,
        validation_data=val_generator,
        epochs=epochs,
        callbacks=callbacks
    )

    # Explicitly save the final model as SavedModel format
    # This ensures the model is saved in the format expected by prediction.py
    print(f"Saving final model to: {model_dir}")
    model.save(model_dir, save_format='tf')
    print(f"✅ Model saved successfully as SavedModel to: {model_dir}")

    # Save class mapping
    class_indices = {v: k for k, v in train_generator.class_indices.items()}
    class_names = [class_indices[i] for i in range(len(class_indices))]
    
    labels_path = os.path.join(model_dir, 'labels.json')
    with open(labels_path, 'w') as f:
        json.dump(class_names, f)
    print(f"✅ Class labels saved to: {labels_path}")
    print(f"Class names: {class_names}")
    
    return model, class_names, history


def test_on_images(model_dir, test_dir, img_size=(224, 224), batch_size=32):
    """Load a saved model and evaluate it on an image test directory structured by class."""
    model = tf.keras.models.load_model(model_dir)

    test_ds = tf.keras.utils.image_dataset_from_directory(
        test_dir,
        labels='inferred',
        label_mode='int',
        seed=123,
        image_size=img_size,
        batch_size=batch_size
    )

    # Get true labels and predictions
    y_true = []
    y_pred = []
    class_names = None
    for images, labels in test_ds:
        preds = model.predict(images)
        preds_labels = preds.argmax(axis=1)
        y_true.extend(labels.numpy().tolist())
        y_pred.extend(preds_labels.tolist())
        if class_names is None and hasattr(test_ds, 'class_names'):
            class_names = test_ds.class_names

    print("Classification report:")
    print(classification_report(y_true, y_pred, target_names=class_names))
    print("Confusion matrix:")
    print(confusion_matrix(y_true, y_pred))


if __name__ == '__main__':
    # Example usage assumptions:
    # Place images under backend/ml/data/images/<class_name>/*.png (or jpg)
    base = os.path.join(os.path.dirname(__file__), 'data', 'images')
    model_output = os.path.join(os.path.dirname(__file__), 'model', 'image_model')

    # If a 'test' subfolder exists, we'll run training then test; otherwise only train.
    train_model(base, model_dir=model_output, epochs=8)
    test_dir = os.path.join(base, 'test')
    if os.path.exists(test_dir):
        test_on_images(model_output, test_dir)
