import os
import json
import sys
from typing import Optional, List

import tensorflow as tf


def find_h5_model() -> Optional[str]:
    """
    Search for an existing .h5 model in common locations:
    - Project root: amniotic_fluid_model.h5
    - backend/: amniotic_fluid_model.h5
    """
    this_dir = os.path.dirname(__file__)
    backend_dir = os.path.abspath(os.path.join(this_dir, ".."))
    project_root = os.path.abspath(os.path.join(backend_dir, ".."))

    candidates: List[str] = [
        os.path.join(project_root, "amniotic_fluid_model.h5"),
        os.path.join(backend_dir, "amniotic_fluid_model.h5"),
    ]
    for path in candidates:
        if os.path.isfile(path):
            return path
    return None


def convert(h5_path: str, saved_model_dir: str, class_labels: Optional[List[str]] = None) -> None:
    """
    Load a Keras .h5 model and save it as a TensorFlow SavedModel directory.
    Also writes labels.json alongside the model directory.
    Compatible with Keras 2 and Keras 3.
    """
    os.makedirs(saved_model_dir, exist_ok=True)
    print(f"🔄 Loading .h5 model from: {h5_path}")
    
    # Load model - compatible with both Keras 2 and 3
    try:
        # Try loading with compile=False for Keras 3 compatibility
        model = tf.keras.models.load_model(h5_path, compile=False)
    except Exception as e:
        print(f"⚠️  Loading with compile=False failed: {e}")
        print("🔄 Trying with default load...")
        model = tf.keras.models.load_model(h5_path)
    
    print("✅ .h5 model loaded.")

    print(f"💾 Saving SavedModel to: {saved_model_dir}")
    # SavedModel directory (TensorFlow format)
    # Keras 3 requires model.export() for SavedModel format
    try:
        # Keras 3 way: use model.export() for SavedModel
        model.export(saved_model_dir)
    except AttributeError:
        # Fallback for older Keras/TF versions
        try:
            tf.saved_model.save(model, saved_model_dir)
        except Exception as e:
            print(f"⚠️  tf.saved_model.save failed: {e}")
            raise
    except Exception as e:
        print(f"⚠️  model.export() failed: {e}")
        raise
    print("✅ SavedModel exported.")

    # If class labels not provided, use default known labels
    if class_labels is None:
        # Default labels used by the previous standalone app
        class_labels = ["low", "normal", "high"]

    labels_path = os.path.join(saved_model_dir, "labels.json")
    with open(labels_path, "w", encoding="utf-8") as f:
        json.dump(class_labels, f)
    print(f"✅ labels.json written with labels: {class_labels}")


if __name__ == "__main__":
    """
    Usage:
      python convert_h5_to_savedmodel.py [optional_path_to_h5] [optional_output_dir]

    Defaults:
      - If h5 path not provided, searches in project root and backend/ for amniotic_fluid_model.h5
      - Output directory defaults to backend/ml/model/image_model
    """
    this_dir = os.path.dirname(__file__)
    default_output_dir = os.path.join(this_dir, "model", "image_model")

    h5_path = sys.argv[1] if len(sys.argv) > 1 else find_h5_model()
    output_dir = sys.argv[2] if len(sys.argv) > 2 else default_output_dir

    if not h5_path or not os.path.isfile(h5_path):
        print("❌ No .h5 model file found. Provide a path explicitly or place amniotic_fluid_model.h5 in project root or backend/ directory.")
        sys.exit(1)

    convert(h5_path, output_dir)
    print("🎉 Conversion completed successfully.")


