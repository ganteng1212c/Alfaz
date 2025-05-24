'use strict';
const navbar = document.querySelector("[data-navbar]");
const navbarLinks = document.querySelectorAll("[data-nav-link]");
const navbarToggler = document.querySelector("[data-nav-toggler]");
navbarToggler.addEventListener("click", function() {
    navbar.classList.toggle("active");
    this.classList.toggle("active")
})
for(let i = 0; i< navbarLinks.length; i++){
    navbarLinks[i].addEventListener("click", function(){
        navbar.classList.remove("active");
        navbarToggler.classList.remove("active");
    });
} 

document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.querySelector("[data-navbar]");
    const customerServiceBtn = document.getElementById("customerServiceBtn");

    // Tambahkan tombol customer service ke navbar di handphone
    if (window.innerWidth <= 768) {
        const navItem = document.createElement("li");
        navItem.classList.add("navbar-item");
        navItem.innerHTML = `
            <a href="#" class="navbar-link skewBg">
                <img src="https://img.icons8.com/?size=100&id=aRRZouQ7VCgm&format=png&color=000000" alt="Customer Service" style="width: 30px; height: 30px;">
                Customer Service
            </a>
        `;
        navbar.querySelector(".navbar-list").appendChild(navItem);

        // Sembunyikan tombol di pojok kanan bawah
        customerServiceBtn.style.display = "none";
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
                window.location.href = "user.html";
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
            alert("Akses Diterima selamat datang irwan");
            window.location.href = "user.html";
        } else {
            alert("akses Ditolak Usernam atau sandi salah.");
        }
    });

    const userAccessSection = document.getElementById("UserAccess");

    // Contoh logika untuk menampilkan User Access
    adminGateButton.addEventListener("click", () => {
        userAccessSection.style.display = "block";
    });
});