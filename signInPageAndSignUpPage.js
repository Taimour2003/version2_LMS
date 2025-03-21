function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    let nameEq = name + '=';
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(nameEq) == 0) return c.substring(nameEq.length, c.length);
    }
    return null;
}

function deleteCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

// ✅ Email validation function
function isValidEmail(email) {
    let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
}

// ✅ Password validation function (min 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character)
function isValidPassword(password) {
    let passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordPattern.test(password);
}

// ✅ Name validation (only alphabets allowed)
function isValidName(name) {
    let namePattern = /^[A-Za-z ]{2,}$/;
    return namePattern.test(name);
}

function signUp() {
    let name = document.getElementById("signup-name").value.trim();
    let email = document.getElementById("signup-email").value.trim();
    let password = document.getElementById("signup-password").value;
    let confirm_password = document.getElementById("confirm-password").value;

    if (!name || !email || !password || !confirm_password) {
        alert("All fields are required!");
        return;
    }

    if (!isValidName(name)) {
        alert("Invalid name. Only alphabets are allowed.");
        return;
    }

    if (!isValidEmail(email)) {
        alert("Invalid email format!");
        return;
    }

    if (!isValidPassword(password)) {
        alert("Password must be at least 8 characters long, include 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.");
        return;
    }

    if (password !== confirm_password) {
        alert("Passwords do not match!");
        return;
    }

    if (localStorage.getItem(email)) {
        alert("Email already exists");
        return;
    }

    let hashedPassword = btoa(password);
    let user = { name: name, email: email, password: hashedPassword };
    localStorage.setItem(email, JSON.stringify(user));

    alert("Account created successfully!");
    flipCard(); // Switch to Sign In form
}

function generateToken(email) {
    let payload = { email, exp: Date.now() + 3600000, random: Math.random() };
    return btoa(JSON.stringify(payload)); // Expires in 1 hour
}

function signIn() {
    let email = document.getElementById("signin-email").value.trim();
    let password = document.getElementById("signin-password").value;

    if (!email || !password) {
        alert("All fields are required!");
        return;
    }

    if (!isValidEmail(email)) {
        alert("Invalid email format!");
        return;
    }

    let storedUser = localStorage.getItem(email);
    if (!storedUser) {
        alert("Account does not exist!");
        return;
    }

    let user = JSON.parse(storedUser);
    if (atob(user.password) !== password) {
        alert("Incorrect password!");
        return;
    }

    let token = generateToken(email);
    setCookie("authToken", token, 1);
    sessionStorage.setItem("LoggedInUser", email);
    
    alert("Login successful!");
    window.location.href = "HomePage.html";
}

function checkUserSession() {
    let token = getCookie("authToken");
    if (!token) {
        alert("Session expired. Please sign in again.");
        window.location.href = "signInPageAndSignUpPage.html";
        return;
    }

    let decodedToken = JSON.parse(atob(token));
    if (Date.now() > decodedToken.exp) {
        alert("Session expired. Please sign in again.");
        deleteCookie("authToken");
        window.location.href = "signInPageAndSignUpPage.html";
        return;
    }
}

function sendEmail() {
    let email = document.getElementById("signin-email").value.trim();

    if (!email) {
        alert("Please enter your email.");
        return;
    }

    if (!isValidEmail(email)) {
        alert("Invalid email format!");
        return;
    }

    if (!localStorage.getItem(email)) {
        alert("This email is not registered!");
        return;
    }

    let resetToken = btoa(email);
    let resetLink = `https://yourwebsite.com/resetPassword.html?token=${resetToken}`;
    console.log(resetLink);
    let params = {
        email: email,
        reset_link: resetLink
    };

    emailjs.send("service_7tdzj1e", "template_mpegol8", params)
        .then(function(response) {
            alert("Password reset email sent!");
        }, function(error) {
            alert("Failed to send email. Check console for errors.");
            console.log("FAILED...", error);
        });
}

function logout() {
    deleteCookie("authToken");
    alert("You have been logged out");
    window.location.href = "Homepage.html";
}
