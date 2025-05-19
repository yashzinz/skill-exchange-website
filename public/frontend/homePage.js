window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) { // for the change to happen
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// basic slider functionality 
const sliderTrack = document.querySelector('.slider-track');
const storyCards = document.querySelectorAll('.story-card');
const leftArrow = document.querySelector('.left-arrow');
const rightArrow = document.querySelector('.right-arrow');
let cardWidth = 0;
let currentScroll = 0;

if (sliderTrack && storyCards.length > 0) {
    cardWidth = storyCards[0].offsetWidth + 20; // card width + gap

    if (leftArrow) {
        leftArrow.addEventListener('click', () => {
            currentScroll = Math.max(0, currentScroll - cardWidth);
            sliderTrack.scrollTo({ left: currentScroll, behavior: 'smooth' });
        });
    }

    if (rightArrow) {
        rightArrow.addEventListener('click', () => {
            const maxScroll = sliderTrack.scrollWidth - sliderTrack.clientWidth;
            currentScroll = Math.min(maxScroll, currentScroll + cardWidth);
            sliderTrack.scrollTo({ left: currentScroll, behavior: 'smooth' });
        });
    }
}