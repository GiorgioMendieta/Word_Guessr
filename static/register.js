// Hide alerts created by Flask backend
hideFlashAlerts();

function hideFlashAlerts() {
    // Hide alerts created by the server
    const flashAlerts = Array.from(document.getElementsByClassName("flash"));

    flashAlerts.forEach((flash) => {
        setTimeout(() => {
            flash.classList.add("hide");
            // As soon as the fade out transition ends, delete the element
            flash.addEventListener("transitionend", () => {
                flash.remove();
            });
        }, 2000);
    });
}
