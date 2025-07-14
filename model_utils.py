import tensorflow as tf
from tensorflow.keras.applications.inception_v3 import InceptionV3 # type: ignore
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout # type: ignore
from tensorflow.keras.models import Model # type: ignore
from tensorflow.keras.optimizers import Adam # type: ignore
import numpy as np
from PIL import Image

class DRModel:
    def __init__(self, model_path):
        self.classes = ["No_DR", "Mild", "Moderate", "Severe", "Proliferative_DR"]
        self.model = self._load_model(model_path)
    
    def _load_model(self, model_path):
        """Load InceptionV3 model with custom head"""
        base_model = InceptionV3(
            weights='imagenet',
            include_top=False,
            input_shape=(512, 512, 3))
        
        # Freeze base layers
        for layer in base_model.layers:
            layer.trainable = False
            
        # Add custom head
        x = base_model.output
        x = GlobalAveragePooling2D()(x)
        x = Dense(1024, activation='relu')(x)
        x = Dropout(0.5)(x)
        predictions = Dense(5, activation='softmax')(x)
        
        model = Model(inputs=base_model.input, outputs=predictions)
        model.load_weights(model_path)
        
        return model
    
    def preprocess_image(self, image_path):
        """Prepare image for model prediction"""
        img = Image.open(image_path)
        
        # Convert to RGB if grayscale
        if img.mode != 'RGB':
            img = img.convert('RGB')
            
        # Resize and normalize
        img = img.resize((512, 512))
        img_array = np.array(img) / 255.0
        return np.expand_dims(img_array, axis=0)
    
    def predict(self, image_path):
        """Make prediction on retina image"""
        processed_img = self.preprocess_image(image_path)
        preds = self.model.predict(processed_img)
        class_idx = np.argmax(preds)
        confidence = np.max(preds)
        return self.classes[class_idx], float(confidence)

def load_model():
    """Load and return the DR model"""
    from config import config
    return DRModel(config.MODEL_PATH)