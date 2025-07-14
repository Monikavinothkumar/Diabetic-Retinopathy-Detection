import streamlit as st
import tensorflow as tf
import numpy as np
from PIL import Image

# Load the model (make sure model file is present)
model = tf.keras.models.load_model('"C:\Users\monik\Downloads\diabeticretinopathy (2).h5"')  # Adjust path if needed

st.title('Sight Savers: Diabetic Retinopathy Detection')

uploaded_file = st.file_uploader("Upload a retinal fundus image", type=["jpg", "jpeg", "png"])

if uploaded_file is not None:
    img = Image.open(uploaded_file)
    st.image(img, caption='Uploaded Image', use_column_width=True)

    img = img.resize((299, 299))
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    if st.button('Predict'):
        prediction = model.predict(img_array)
        stage = np.argmax(prediction)
        stages = ["No DR", "Mild DR", "Moderate DR", "Severe DR", "Proliferative DR"]
        st.success(f"Prediction: {stages[stage]}")
