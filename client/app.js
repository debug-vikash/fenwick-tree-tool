const API_URL = 'http://127.0.0.1:5050';

// REGISTER PAGE LOGIC
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.onsubmit = async function(event) {
        event.preventDefault(); 

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const response = await fetch(API_URL + '/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                name: name, 
                email: email, 
                password: password 
            })
        });

        const data = await response.json();

        if (data.error) {
            alert("Oops! " + data.error);
        } else {
            alert("Success! You can now login.");
            window.location.href = "login.html"; 
        }
    };
}


// LOGIN PAGE
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.onsubmit = async function(event) {
        event.preventDefault();

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        const response = await fetch(API_URL + '/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: password })
        });

        const data = await response.json();

        if (data.error) {
            alert("Login failed: " + data.error);
        } else {
            localStorage.setItem("userEmail", data.email);
            window.location.href = "dashboard.html"; 
        }
    };
}


// DASHBOARD
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    
    const loggedInEmail = localStorage.getItem("userEmail");
    if (!loggedInEmail) {
        alert("Please login first!");
        window.location.href = "login.html";
    }


    logoutBtn.onclick = function() {
        localStorage.removeItem("userEmail");
        window.location.href = "login.html";
    };

    const updateBtn = document.getElementById('updateBtn');
    updateBtn.onclick = async function() {
        const index = document.getElementById('updateIndex').value;
        const value = document.getElementById('updateValue').value;

        const response = await fetch(API_URL + '/api/fenwick/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ index: index, value: value })
        });

        const data = await response.json();
        
        if (data.error) {
            alert("Error: " + data.error);
        } else {
            alert("Value updated successfully in the Fenwick Tree!");
            document.getElementById('updateIndex').value = ""; 
            document.getElementById('updateValue').value = ""; 
        }
    };

    const getSumBtn = document.getElementById('getSumBtn');
    getSumBtn.onclick = async function() {
        const index = document.getElementById('prefixIndex').value;

        const response = await fetch(API_URL + '/api/fenwick/prefix-sum/' + index);
        const data = await response.json();
        
        if (data.error) {
            alert("Error: " + data.error);
        } else {
            document.getElementById('resultDisplay').innerText = data.sum;
        }
    };
}
