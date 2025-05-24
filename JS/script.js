'use strict';
const navbar = document.querySelector("[data-navbar]");
const navbarLinks = document.querySelectorAll("[data-nav-link]");
const navbarToggler = document.querySelector("[data-nav-toggler]");

document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.querySelector("[data-navbar]");
    const navbarToggler = document.querySelector("[data-nav-toggler]");
    const navbarLinks = document.querySelectorAll("[data-nav-link]");

    if (navbar && navbarToggler) {
        navbarToggler.addEventListener("click", () => {
            navbar.classList.toggle("active");
            navbarToggler.classList.toggle("active");
        });

        navbarLinks.forEach(link => {
            link.addEventListener("click", () => {
                navbar.classList.remove("active");
                navbarToggler.classList.remove("active");
            });
        });
    }

    const adminLoginForm = document.getElementById("adminLoginForm");
    const adminNotification = document.getElementById("adminNotification");

    adminLoginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const username = document.getElementById("adminUsername").value;
        const password = document.getElementById("adminPassword").value;

        if (username === "irwan" && password === "ganteng") {
            adminNotification.textContent = "Login Successful!";
            adminNotification.className = "notification success";
            adminNotification.style.display = "block";

            setTimeout(() => {
                window.location.href = "admin.html";
            }, 1500);
        } else {
            adminNotification.textContent = "Login Failed!";
            adminNotification.className = "notification error";
            adminNotification.style.display = "block";
        }
    });

    const adminGateButton = document.getElementById("adminGateButton");

    adminGateButton.addEventListener("click", () => {
        const username = prompt("Enter Username:");
        const password = prompt("Enter Password:");

        if (username === "irwan" && password === "ganteng") {
            alert("Access Granted! Redirecting to Admin Page...");
            window.location.href = "admin.html";
        } else {
            alert("Access Denied! Incorrect Username or Password.");
        }
    });
});