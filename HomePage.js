document.getElementById("loginBtn").addEventListener("click", function(event) {
    event.preventDefault(); 
    let dropdown = document.getElementById("dropdownMenu");
    dropdown.style.display = (dropdown.style.display === "block") ? "none" : "block";
});

// Close dropdown when clicking outside
document.addEventListener("click", function(event) {
    let dropdown = document.getElementById("dropdownMenu");
    let loginBtn = document.getElementById("loginBtn");
    
    if (!loginBtn.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.style.display = "none";
    }
});