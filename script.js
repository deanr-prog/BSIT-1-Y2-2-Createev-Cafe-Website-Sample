const menuOpenButton = document.querySelector("#menu-open-button");
const menuCloseButton = document.querySelector("#menu-close-button");

menuOpenButton.addEventListener("click", () => {
    // Toggle mobile menu visibility
    document.body.classList.toggle("show-mobile-menu");
});

// Close menu when the close button is clicked
menuCloseButton.addEventListener("click", () => {
    document.body.classList.remove("show-mobile-menu");
});


 document.addEventListener('DOMContentLoaded', function() {
        const cookieConsent = document.getElementById('cookieConsent');
        const acceptBtn = document.getElementById('acceptCookies');
        const declineBtn = document.getElementById('declineCookies');
        
        if(localStorage.getItem('cookiesAccepted')) {
          cookieConsent.style.display = 'none';
        }
        
        // Accept
        acceptBtn.addEventListener('click', function() {
          localStorage.setItem('cookiesAccepted', 'true');
          cookieConsent.style.display = 'none';
        });
        
        // Decline
        declineBtn.addEventListener('click', function() {
          localStorage.setItem('cookiesAccepted', 'false');
          cookieConsent.style.display = 'none';
        });
      });
function goHome() {
  window.location.href = 'home.html';  
}
