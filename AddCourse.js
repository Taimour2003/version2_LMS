let deleteMode=false;
let courses = JSON.parse(localStorage.getItem("courses")) || [];

document.addEventListener("DOMContentLoaded", function () {    

    let courseForm = document.getElementById("course-form"); // Exists in AddCoursePage.html
    let courseContainer = document.getElementById("course-container"); // Exists in HomePage.html
    console.log(courseForm);
    console.log(courseContainer);
    if (courseForm) {
        console.log("Running on AddCoursePage.html");
        courseForm.addEventListener("submit", function (event) {
            event.preventDefault();

            let title = document.getElementById("course-title").value.trim();
            let desc = document.getElementById("course-desc").value.trim();


            if (title === "" || desc === "") {
                alert("Please fill in all fields!");
                return;
            }

            courses.push({ title, description: desc });
            localStorage.setItem("courses", JSON.stringify(courses));

            console.log("Saved courses:", localStorage.getItem("courses")); // Debugging

            // Redirect to homepage
            window.location.href = "HomePage.html";
        });
    }

    if (courseContainer) {
        // We are on HomePage.html
        console.log("Running on HomePage.html");
        console.log("Loaded courses:", courses);

        displayCourses()
        
    }    
});

let element=document.getElementById("delete-mode-btn");
console.log(element);
element.addEventListener("click", () => {
    console.log("reached");
    deleteMode = !deleteMode;

    let courseCards = document.getElementsByClassName("pos"); // Get all elements with class "pos"

    for (let i = 0; i < courseCards.length; i++) {
        courseCards[i].style.display = deleteMode ? "inline-block" : "none";
    }
});    

function deleteCourse(title) {
    // Find the index of the course with the given title
    let index = courses.findIndex(course => course.title === title);
    
    // Check if course exists
    if (index !== -1) {
        courses.splice(index, 1); // Remove 1 item at found index
        localStorage.setItem("courses", JSON.stringify(courses)); // Update localStorage
        displayCourses(); // Refresh the course list
    } else {
        console.warn("Course not found!");
    }
}

function displayCourses(){
    let courseContainer = document.getElementById("course-container");
    if (!courseContainer) return;
    courseContainer.innerHTML = ""; 
    if (courses.length > 0) {
        courses.forEach((course,index) => {
            addCourseToHomepage(course.title, course.description,index);
        });
    } else {
        console.warn("No courses found or container missing.");
    }
}

// Function to add courses dynamically to homepage
function addCourseToHomepage(title, description, index) {
    let courseContainer = document.getElementById("course-container");

    let courseCard = document.createElement("div");
    courseCard.classList.add("course-card");

    courseCard.innerHTML = `
        <span class="delete-icon pos" data-index="${index}" style="display:none;">➖</span>
        <h3>${title}</h3>
        <p>${description}</p>
        <a href="#" class="btn">View Course</a>
        <i class="fa fa-trash pos trash-icon" data-title="${title}"></i>
    `;

    console.log(courseCard);

    // Append course to the container
    courseContainer.appendChild(courseCard);

    // Attach event listener to delete button
    let deleteButton = courseCard.querySelector(".trash-icon");
    deleteButton.addEventListener("click", function () {
        let courseTitle = this.getAttribute("data-title"); // Get the title
        deleteCourse(courseTitle);
    });
}