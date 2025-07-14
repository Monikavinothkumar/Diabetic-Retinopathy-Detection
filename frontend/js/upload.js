document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const browseBtn = document.getElementById('browseBtn');
    const previewSection = document.getElementById('previewSection');
    const imagePreview = document.getElementById('imagePreview');
    const removeBtn = document.getElementById('removeBtn');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const resultsSection = document.getElementById('resultsSection');
    const severityBadge = document.getElementById('severityBadge');
    const confidenceValue = document.getElementById('confidenceValue');
    const severityValue = document.getElementById('severityValue');
    const recommendationText = document.getElementById('recommendationText');
    const resultImage = document.getElementById('resultImage');
    
    // Event Listeners
    browseBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileSelect);
    
    // Drag and Drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            handleFileSelect({ target: fileInput });
        }
    });
    
    removeBtn.addEventListener('click', resetUpload);
    analyzeBtn.addEventListener('click', analyzeImage);
    
    // Functions
    function handleFileSelect(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        // Validate file
        if (!file.type.match('image.*')) {
            alert('Please select an image file (JPG, PNG)');
            return;
        }
        
        if (file.size > 10 * 1024 * 1024) {
            alert('File size exceeds 10MB limit');
            return;
        }
        
        // Display preview
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            uploadArea.style.display = 'none';
            previewSection.style.display = 'block';
            resultsSection.style.display = 'none';
        };
        reader.readAsDataURL(file);
    }
    
    function resetUpload() {
        fileInput.value = '';
        uploadArea.style.display = 'block';
        previewSection.style.display = 'none';
        resultsSection.style.display = 'none';
    }
    
    async function analyzeImage() {
        if (!fileInput.files.length) return;
        
        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append('image', file);
        
        // Show loading state
        analyzeBtn.disabled = true;
        analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
        
        try {
            // Simulate API call (replace with actual fetch to your backend)
            const result = await simulateAnalysis(file);
            
            // Display results
            displayResults(result);
            
        } catch (error) {
            alert('Analysis failed: ' + error.message);
        } finally {
            analyzeBtn.disabled = false;
            analyzeBtn.innerHTML = 'Analyze Image';
        }
    }
    
    // Simulated analysis function (replace with actual API call)
    function simulateAnalysis(file) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const severities = ["No DR", "Mild", "Moderate", "Severe", "Proliferative DR"];
                const randomSeverity = severities[Math.floor(Math.random() * severities.length)];
                const randomConfidence = (Math.random() * 0.5 + 0.5).toFixed(2); // 0.5 to 1.0
                
                const recommendations = {
                    "No DR": "No signs of diabetic retinopathy detected. Continue regular eye exams as recommended by your doctor.",
                    "Mild": "Mild nonproliferative diabetic retinopathy detected. Recommend follow-up in 6-12 months.",
                    "Moderate": "Moderate nonproliferative diabetic retinopathy detected. Recommend consultation with an ophthalmologist within 3-6 months.",
                    "Severe": "Severe nonproliferative diabetic retinopathy detected. Urgent consultation with an ophthalmologist recommended within 1 month.",
                    "Proliferative DR": "Proliferative diabetic retinopathy detected. Immediate consultation with an ophthalmologist is strongly recommended."
                };
                
                resolve({
                    severity: randomSeverity,
                    confidence: randomConfidence,
                    recommendation: recommendations[randomSeverity],
                    visualization: URL.createObjectURL(file)
                });
            }, 2000);
        });
    }
    
    function displayResults(result) {
        // Update UI
        severityBadge.textContent = result.severity;
        confidenceValue.textContent = `${Math.round(result.confidence * 100)}%`;
        severityValue.textContent = result.severity;
        recommendationText.textContent = result.recommendation;
        resultImage.src = result.visualization;
        
        // Update severity badge color
        const severityColors = {
            "No DR": "var(--success)",
            "Mild": "var(--success)",
            "Moderate": "var(--warning)",
            "Severe": "var(--warning)",
            "Proliferative DR": "var(--danger)"
        };
        severityBadge.style.backgroundColor = severityColors[result.severity];
        
        // Show results
        previewSection.style.display = 'none';
        resultsSection.style.display = 'block';
    }
});
