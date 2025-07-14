document.addEventListener('DOMContentLoaded', function() {
    // Check authentication state
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    // Redirect logic for protected pages
    if (window.location.pathname.includes('upload.html') && !isAuthenticated) {
        window.location.href = 'login.html';
    }
    
    if ((window.location.pathname.includes('login.html') || 
         window.location.pathname.includes('signup.html')) && isAuthenticated) {
        window.location.href = 'upload.html';
    }
    
    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Simple validation
            if (!email || !password) {
                alert('Please fill in all fields');
                return;
            }
            
            // Simulate API call
            setTimeout(() => {
                localStorage.setItem('isAuthenticated', 'true');
                window.location.href = 'upload.html';
            }, 500);
        });
    }
    
    // Signup Form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Validation
            if (!fullName || !email || !password || !confirmPassword) {
                alert('Please fill in all fields');
                return;
            }
            
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }
            
            // Simulate API call
            setTimeout(() => {
                alert('Account created successfully! Please login.');
                window.location.href = 'login.html';
            }, 500);
        });
    }
    
    // Logout Button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('isAuthenticated');
            window.location.href = 'index.html';
        });
    }
});