 let selectedRating = 0;
        const stars = document.querySelectorAll('.stars i');
        const overlay = document.querySelector('.overlay');
        const ratingBox = document.querySelector('.rating-box');
        const popupButtons = document.querySelectorAll('.popup');
        const closeButton = document.querySelector('.closebutton');
        const submitButton = document.querySelector('.submitReview');
        const reviewInput = document.getElementById('reviewInput');
        const nameInput = document.getElementById('nameInput');

        // Add event listeners to popup buttons
        popupButtons.forEach(button => {
            button.addEventListener('click', openRatingPopup);
        });

        function openRatingPopup() {
            overlay.style.display = 'block';
            ratingBox.style.display = 'block';
        }

        function closeRatingPopup() {
            overlay.style.display = 'none';
            ratingBox.style.display = 'none';
            selectedRating = 0;
            reviewInput.value = '';
            nameInput.value = '';
            updateStars();
        }

        // Event listeners for rating popup
        closeButton.addEventListener('click', closeRatingPopup);
        overlay.addEventListener('click', closeRatingPopup);

        // Star rating functionality
        stars.forEach((star, index) => {
            star.addEventListener('click', () => {
                selectedRating = index + 1;
                updateStars();
            });

            star.addEventListener('mouseover', () => {
                highlightStars(index + 1);
            });
        });

        document.querySelector('.stars').addEventListener('mouseleave', () => {
            updateStars();
        });

        function updateStars() {
            stars.forEach((star, index) => {
                if (index < selectedRating) {
                    star.classList.add('active');
                } else {
                    star.classList.remove('active');
                }
            });
        }

        function highlightStars(rating) {
            stars.forEach((star, index) => {
                if (index < rating) {
                    star.classList.add('active');
                } else {
                    star.classList.remove('active');
                }
            });
        }

        // Submit review functionality
        submitButton.addEventListener('click', () => {
            if (selectedRating === 0) {
                showModal('Please select a rating before submitting.');
                return;
            }

            const customerName = nameInput.value.trim();
            if (!customerName) {
                showModal('Please enter your name before submitting.');
                return;
            }

            const review = {
                rating: selectedRating,
                text: reviewInput.value.trim(),
                author: customerName,
                timestamp: new Date().toISOString(),
                displayTime: 'just now'
            };

            // Save to sessionStorage
            let reviews = JSON.parse(sessionStorage.getItem('cafeReviews')) || [];
            reviews.unshift(review);
            sessionStorage.setItem('cafeReviews', JSON.stringify(reviews));

            showModal('Thank you for your review!');
            closeRatingPopup();
            loadUserReviews();
        });

        // Function to generate star display
        function generateStars(rating) {
            let stars = '';
            for (let i = 1; i <= 5; i++) {
                if (i <= rating) {
                    stars += '★';
                } else {
                    stars += '☆';
                }
            }
            return stars;
        }

        // Function to get initials from name
        function getInitials(name) {
            return name.split(' ').map(word => word[0]).join('').toUpperCase();
        }

        // Function to load and display user reviews
        function loadUserReviews() {
            const reviews = JSON.parse(sessionStorage.getItem('cafeReviews')) || [];
            const reviewsContainer = document.getElementById('reviews-container');
            
            // Clear existing user reviews (keep static ones)
            const userReviews = reviewsContainer.querySelectorAll('.user-submitted-review');
            userReviews.forEach(review => review.remove());
            
            // Add user reviews at the beginning
            reviews.forEach((review, index) => {
                const reviewElement = document.createElement('div');
                reviewElement.className = 'bg-white rounded-lg shadow-md p-6 text-left user-submitted-review';
                
                const isRecent = new Date() - new Date(review.timestamp) < 24 * 60 * 60 * 1000;
                
                reviewElement.innerHTML = `
                    <div class="flex items-center mb-2">
                        <span class="text-yellow-500">${generateStars(review.rating)}</span>
                        ${isRecent ? '<span class="new-review-badge">NEW</span>' : ''}
                    </div>
                    <p class="text-gray-700 mb-4">${review.text || 'No additional comments provided.'}</p>
                    <div class="flex items-center mt-4">
                        <div class="rounded-full bg-gray-200 w-8 h-8 flex items-center justify-center mr-2">${getInitials(review.author)}</div>
                        <div>
                            <p class="text-sm font-semibold text-gray-800">${review.author}</p>
                            <p class="text-xs text-gray-500">@${review.author.replace(' ', '')} • ${review.displayTime}</p>
                        </div>
                    </div>
                `;
                
                reviewsContainer.insertBefore(reviewElement, reviewsContainer.firstChild);
            });
        }

        // Function to update time displays
        function updateTimeDisplays() {
            const reviews = JSON.parse(sessionStorage.getItem('cafeReviews')) || [];
            
            reviews.forEach((review, index) => {
                const reviewDate = new Date(review.timestamp);
                review.displayTime = getTimeAgo(reviewDate);
            });
            
            sessionStorage.setItem('cafeReviews', JSON.stringify(reviews));
        }

        // Function to get time ago format
        function getTimeAgo(date) {
            const now = new Date();
            const diffInMinutes = Math.floor((now - date) / (1000 * 60));
            
            if (diffInMinutes < 1) return "just now";
            if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
            
            const diffInHours = Math.floor(diffInMinutes / 60);
            if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
            
            const diffInDays = Math.floor(diffInHours / 24);
            if (diffInDays < 30) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
            
            const diffInMonths = Math.floor(diffInDays / 30);
            if (diffInMonths < 12) return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
            
            const diffInYears = Math.floor(diffInMonths / 12);
            return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
        }

        // Load reviews when page loads
        document.addEventListener('DOMContentLoaded', function() {
            loadUserReviews();
            
            // Update time displays every minute
            setInterval(() => {
                updateTimeDisplays();
                loadUserReviews();
            }, 60000);
        });

        // Modal functionality
        const modal = document.getElementById('myModal');
        const modalMessage = document.getElementById('modal-message');
        const closeModalButton = document.querySelector('.close-button');
        const modalOkButton = document.getElementById('modal-ok-button');

        function showModal(message) {
            modalMessage.textContent = message;
            modal.style.display = 'flex';
        }

        function hideModal() {
            modal.style.display = 'none';
        }

        closeModalButton.onclick = hideModal;
        modalOkButton.onclick = hideModal;
        window.onclick = function(event) {
            if (event.target == modal) {
                hideModal();
            }
        };