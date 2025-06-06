document.addEventListener('DOMContentLoaded', function() {
const stars = document.querySelectorAll(".stars i");
const popup = document.querySelector(".popup");
const ratingBox = document.querySelector(".rating-box");
const closebutton = document.querySelector(".closebutton");
const overlay = document.querySelector(".overlay");
const submitbutton = document.querySelector(".submitReview");
            
// pag bumubukas yung popup
popup.addEventListener("click", () => {
ratingBox.classList.add("active");
overlay.classList.add("active");
});
            
// pag sumara yung popup
function closePopup() {
ratingBox.classList.remove("active");
overlay.classList.remove("active");
                
// nirereset yung reivew pati star rating
stars.forEach(star => star.classList.remove("active"));
const message = document.querySelector(".rating-message");
if (message) message.remove();
                
// Clear textarea
document.getElementById("reviewInput").value = "";
}
            
closebutton.addEventListener("click", closePopup);
overlay.addEventListener("click", closePopup);
            
// Star rating functionality
stars.forEach((star, index1) => {
star.addEventListener("click", () => {
// Update active state based on selection
stars.forEach((star, index2) => {
    if(index1 >= index2) {
    star.classList.add("active");
     } else {
    star.classList.remove("active");
    }
    });
                    
const rating = index1 + 1;
console.log(`You rated: ${rating} star${rating > 1 ? 's' : ''}`);
                    
showRatingMessage(rating);
});
                
// hover effects
star.addEventListener("mouseover", () => {
stars.forEach((s, idx) => {
if(idx <= index1) {
s.classList.add("hover");
}
});
});
                
star.addEventListener("mouseout", () => {
stars.forEach(s => s.classList.remove("hover"));
});
});
            
// function nung submit button
submitbutton.addEventListener("click", () => {
const activeStars = document.querySelectorAll(".stars i.active");
const reviewText = document.getElementById("reviewInput").value;
                
    if (activeStars.length > 0) {
    console.log(`Review submitted: ${activeStars.length} stars, Comment: ${reviewText}`);
                    
// Show a confirmation message and close popup after a delay
    let submitMessage = document.createElement("div");
    submitMessage.className = "rating-message";
    submitMessage.textContent = "Thanks for your feedback! Your review has been submitted.";
    submitMessage.style.textAlign = "center";
    submitMessage.style.marginTop = "20px";
    submitMessage.style.fontWeight = "500";
    submitMessage.style.color = "#295733";
                    
     document.querySelector(".rating-box").appendChild(submitMessage);

    // Remove any existing message first
    const existingMsg = document.querySelector(".rating-message");
    if (existingMsg) existingMsg.remove();
                
    } else {
    alert("Please select a rating before submitting!");
 }
});
            
function showRatingMessage(rating) {
    let messageElement = document.querySelector(".rating-message");
                
     if (!messageElement) {
        messageElement = document.createElement("div");
        messageElement.className = "rating-message";
        document.querySelector(".rating-box").appendChild(messageElement);
}
                
messageElement.textContent = `Thank you! You rated us ${rating} star${rating > 1 ? 's' : ''}!`;
                
messageElement.style.textAlign = "center";
messageElement.style.marginTop = "20px";
messageElement.style.fontWeight = "500";
messageElement.style.color = "#295733";
}
});