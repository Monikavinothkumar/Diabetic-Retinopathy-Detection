import cv2 # type: ignore
import numpy as np

def visualize_lesions(image_path, severity):
    """Generate annotated visualization of retinal lesions"""
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError("Could not read image file")
    
    img = cv2.resize(img, (600, 600))
    
    # Add severity-specific annotations
    if severity != "No_DR":
        # Convert to grayscale for processing
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Enhance contrast
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        enhanced = clahe.apply(gray)
        
        # Detect microaneurysms (red lesions)
        circles = cv2.HoughCircles(
            enhanced,
            cv2.HOUGH_GRADIENT,
            dp=1,
            minDist=20,
            param1=50,
            param2=30,
            minRadius=1,
            maxRadius=15
        )
        
        # Draw detected lesions
        if circles is not None:
            circles = np.uint16(np.around(circles))
            for i in circles[0, :]:
                cv2.circle(img, (i[0], i[1]), i[2], (0, 0, 255), 2)
    
    # Add diagnostic overlay
    font = cv2.FONT_HERSHEY_SIMPLEX
    cv2.putText(img, f"Diagnosis: {severity.replace('_', ' ')}", 
               (20, 40), font, 0.8, (0, 0, 255), 2)
    
    # Save visualization
    vis_path = image_path.replace('.', '_vis.')
    cv2.imwrite(vis_path, img)
    
    return vis_path