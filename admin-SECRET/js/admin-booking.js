document.addEventListener("DOMContentLoaded", () => {
    const requestForm = document.getElementById("requestForm");
    const bookingModal = document.getElementById("bookingModal");
    const notification = document.getElementById("notification");
    const requestBookingButton = document.getElementById("requestBookingButton");

    requestBookingButton.addEventListener("click", () => {
        bookingModal.style.display = "block";
    });

    requestForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const whatsapp = document.getElementById("whatsapp").value;
        const day = document.getElementById("day").value;
        const selectedClass = document.getElementById("class").value;

        if (!email || !whatsapp || !day || !selectedClass) {
            alert("Please fill in all fields.");
            return;
        }

        // Mark the selected day as booked
        const dayElement = Array.from(document.querySelectorAll(".day h3"))
            .find(el => el.textContent === day);

        if (dayElement) {
            const bookedInfo = document.createElement("p");
            bookedInfo.textContent = `Booked: ${selectedClass}`;
            bookedInfo.classList.add("booked-info");
            dayElement.parentElement.appendChild(bookedInfo);
        }

        // Add to cart (for now, just log it)
        const bookingData = {
            email,
            whatsapp,
            day,
            selectedClass,
            status: "Pending"
        };

        console.log("Booking added to cart:", bookingData);

        // Show notification
        notification.textContent = "Booking request sent!";
        notification.style.display = "block";
        setTimeout(() => {
            notification.style.display = "none";
        }, 3000);

        // Close modal
        bookingModal.style.display = "none";

        // Clear form
        requestForm.reset();
    });
});

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