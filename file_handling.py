import os
from werkzeug.utils import secure_filename
from config import config
from datetime import datetime
import uuid

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in config.ALLOWED_EXTENSIONS

def save_uploaded_file(file):
    """Save uploaded file with unique filename"""
    if not os.path.exists(config.UPLOAD_FOLDER):
        os.makedirs(config.UPLOAD_FOLDER)
    
    if file and allowed_file(file.filename):
        # Generate unique filename
        ext = file.filename.rsplit('.', 1)[1].lower()
        filename = f"{datetime.now().strftime('%Y%m%d')}_{uuid.uuid4().hex}.{ext}"
        filepath = os.path.join(config.UPLOAD_FOLDER, filename)
        file.save(filepath)
        return filepath
    return None

def cleanup_file(filepath):
    """Remove temporary file"""
    if filepath and os.path.exists(filepath):
        os.remove(filepath)