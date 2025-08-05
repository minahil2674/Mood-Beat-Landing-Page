// DOM Elements
const navbar = document.getElementById('navbar');
const mobileToggle = document.getElementById('mobile-toggle');
const navLinks = document.querySelector('.nav-links');
const typingText = document.getElementById('typing-text');
const backToTopBtn = document.getElementById('backToTop');
const toastContainer = document.getElementById('toast-container');
const loading = document.getElementById('loading');
const playlistContainer = document.getElementById('playlist-container');

// State Management
let currentTestimonialIndex = 0;
let isScrolling = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupParticles();
    setupNavigation();
    setupTypingAnimation();
    setupCounters();
    setupScrollAnimations();
    setupTiltEffects();
    setupTestimonialSlider();
    setupMoodCards();

    // Setup event listeners
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
}

// PARTICLE SYSTEM
function setupParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random positioning
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    
    // Random animation delay
    particle.style.animationDelay = Math.random() * 6 + 's';
    particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
    
    container.appendChild(particle);
    
    // Remove and recreate particle after animation
    setTimeout(() => {
        if (particle.parentNode) {
            particle.remove();
            createParticle(container);
        }
    }, (Math.random() * 6 + 6) * 1000);
}

// ==========================================
// NAVIGATION
// ==========================================
function setupNavigation() {
    // Mobile menu toggle
    mobileToggle.addEventListener('click', toggleMobileMenu);
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                closeMobileMenu();
            }
        });
    });
}

function toggleMobileMenu() {
    navLinks.classList.toggle('mobile-active');
    mobileToggle.classList.toggle('active');
}

function closeMobileMenu() {
    navLinks.classList.remove('mobile-active');
    mobileToggle.classList.remove('active');
}

// ==========================================
// TYPING ANIMATION
// ==========================================
function setupTypingAnimation() {
    const phrases = [
        "Matches Your Mood",
        "Understands Your Vibe",
        "Curates Your Sound",
        "Elevates Your Energy",
        "Reads Your Soul"
    ];
    
    let currentPhrase = 0;
    let currentChar = 0;
    let isDeleting = false;
    
    function typeWriter() {
        const phrase = phrases[currentPhrase];
        
        if (!isDeleting) {
            typingText.textContent = phrase.substring(0, currentChar + 1);
            currentChar++;
            
            if (currentChar === phrase.length) {
                setTimeout(() => {
                    isDeleting = true;
                }, 2000);
            }
        } else {
            typingText.textContent = phrase.substring(0, currentChar - 1);
            currentChar--;
            
            if (currentChar === 0) {
                isDeleting = false;
                currentPhrase = (currentPhrase + 1) % phrases.length;
            }
        }
        
        const speed = isDeleting ? 50 : 100;
        setTimeout(typeWriter, speed);
    }
    
    typeWriter();
}

// ==========================================
// COUNTER ANIMATIONS
// ==========================================
function setupCounters() {
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.stat-item').forEach(item => {
        observer.observe(item);
    });
}

function animateCounter(element) {
    const target = parseInt(element.dataset.count);
    const counter = element.querySelector('.stat-number');
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            counter.textContent = Math.floor(current).toLocaleString();
            requestAnimationFrame(updateCounter);
        } else {
            counter.textContent = target.toLocaleString();
        }
    };
    
    updateCounter();
}

// ==========================================
// SCROLL ANIMATIONS
// ==========================================
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.fade-in').forEach(element => {
        observer.observe(element);
    });
}

function handleScroll() {
  if (isScrolling) return;
  
  isScrolling = true;
  requestAnimationFrame(() => {
    const scrollTop = window.pageYOffset;
    
    // Navbar background
    if (scrollTop > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    // Back to top button
    if (scrollTop > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
    
    // Remove this parallax effect as it's causing issues
    // const hero = document.querySelector('.hero');
    // if (hero) {
    //   const heroOffset = scrollTop * 0.5;
    //   hero.style.transform = `translateY(${heroOffset}px)`;
    // }
    
    isScrolling = false;
  });
}

function handleResize() {
    // Close mobile menu on resize
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ==========================================
// TILT EFFECTS
// ==========================================
function setupTiltEffects() {
    document.querySelectorAll('[data-tilt]').forEach(element => {
        element.addEventListener('mousemove', handleTilt);
        element.addEventListener('mouseleave', resetTilt);
    });
}

function handleTilt(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / centerY * -10;
    const rotateY = (x - centerX) / centerX * 10;
    
    e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
}

function resetTilt(e) {
    e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
}

// ==========================================
// MOOD SELECTION
// ==========================================
function setupMoodCards() {
    document.querySelectorAll('.mood-card').forEach(card => {
        card.addEventListener('mouseenter', animateMoodCard);
        card.addEventListener('mouseleave', resetMoodCard);
    });
}

function animateMoodCard(e) {
    const particles = e.currentTarget.querySelector('.mood-particles');
    createMoodParticles(particles);
}

function resetMoodCard(e) {
    const particles = e.currentTarget.querySelector('.mood-particles');
    particles.innerHTML = '';
}

function createMoodParticles(container) {
    for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: #1db954;
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: sparkle 1s ease-out forwards;
            animation-delay: ${Math.random() * 0.5}s;
        `;
        container.appendChild(particle);
        
        setTimeout(() => particle.remove(), 1000);
    }
}

function selectMood(mood) {
    // Add selection animation
    const selectedCard = document.querySelector(`[data-mood="${mood}"]`);
    selectedCard.classList.add('selected');
    
    // Remove selection from other cards
    document.querySelectorAll('.mood-card').forEach(card => {
        if (card !== selectedCard) {
            card.classList.remove('selected');
        }
    });
    
    // Show loading animation
    showLoading();
    
    // Simulate playlist generation
    setTimeout(() => {
        generatePlaylist(mood);
    }, 3000);
    
    // Show toast notification
    showToast(`Generating ${mood.toLowerCase()} playlist...`, 'info');
}

// ==========================================
// PLAYLIST GENERATION
// ==========================================
function showLoading() {
    loading.style.display = 'block';
    playlistContainer.style.display = 'none';
    
    // Animate progress bar
    const progressBar = document.querySelector('.progress-bar');
    progressBar.style.width = '0%';
    
    setTimeout(() => {
        progressBar.style.width = '100%';
    }, 100);
    
    // Scroll to playlist section
    document.getElementById('playlist').scrollIntoView({
        behavior: 'smooth'
    });
}

function generatePlaylist(mood) {
    const playlists = {
        'Happy': {
            id: '37i9dQZF1DX0XUsuxWHRQd',
            title: 'Happy Hits',
            tracks: 50,
            duration: 180,
            match: 95
        },
        'Calm': {
            id: '37i9dQZF1DWZd79rJ6a7lp',
            title: 'Peaceful Piano',
            tracks: 30,
            duration: 120,
            match: 98
        },
        'Focus': {
            id: '37i9dQZF1DWZeKCadgRdKQ',
            title: 'Deep Focus',
            tracks: 40,
            duration: 150,
            match: 92
        },
        'Heartbroken': {
            id: '37i9dQZF1DX7qK8ma5wgG1',
            title: 'Sad Songs',
            tracks: 35,
            duration: 140,
            match: 97
        },
        'Workout': {
            id: '37i9dQZF1DX76Wlfdnj7AP',
            title: 'Beast Mode',
            tracks: 60,
            duration: 200,
            match: 94
        },
        'Party': {
            id: '37i9dQZF1DXaXB8fQg7xif',
            title: 'Party Hits',
            tracks: 55,
            duration: 220,
            match: 96
        }
    };
    
    const playlist = playlists[mood];
    
    // Hide loading and show playlist
    loading.style.display = 'none';
    playlistContainer.style.display = 'block';
    
    // Update playlist info
    document.getElementById('playlist-title').textContent = `${playlist.title} - Perfect for ${mood}`;
    document.getElementById('track-count').textContent = playlist.tracks;
    document.getElementById('duration').textContent = playlist.duration;
    document.getElementById('mood-match').textContent = playlist.match;
    
    // Update Spotify embed
    const iframe = document.getElementById('playlist-frame');
    iframe.src = `https://open.spotify.com/embed/playlist/${playlist.id}?utm_source=generator&theme=0`;
    
    // Animate playlist appearance
    playlistContainer.style.opacity = '0';
    playlistContainer.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        playlistContainer.style.transition = 'all 0.5s ease';
        playlistContainer.style.opacity = '1';
        playlistContainer.style.transform = 'translateY(0)';
    }, 100);
    
    showToast(`${playlist.title} playlist ready!`, 'success');
}

function refreshPlaylist() {
    const currentMood = document.querySelector('.mood-card.selected')?.dataset.mood;
    if (currentMood) {
        showToast('Refreshing playlist...', 'info');
        setTimeout(() => {
            generatePlaylist(currentMood);
        }, 1500);
    }
}

function sharePlaylist() {
    const iframe = document.getElementById('playlist-frame');
    const playlistUrl = iframe.src.replace('/embed/', '/');
    
    if (navigator.share) {
        navigator.share({
            title: 'Check out this awesome playlist from MoodBeats!',
            url: playlistUrl
        });
    } else {
        navigator.clipboard.writeText(playlistUrl);
        showToast('Playlist link copied to clipboard!', 'success');
    }
}

function savePlaylist() {
    const button = event.currentTarget;
    const heart = button.querySelector('i');
    
    if (heart.classList.contains('fas')) {
        heart.classList.remove('fas');
        heart.classList.add('far');
        button.classList.remove('saved');
        showToast('Playlist removed from favorites', 'info');
    } else {
        heart.classList.remove('far');
        heart.classList.add('fas');
        button.classList.add('saved');
        showToast('Playlist saved to favorites!', 'success');
    }
}

// ==========================================
// TESTIMONIALS SLIDER
// ==========================================
function setupTestimonialSlider() {
    const track = document.getElementById('testimonials-track');
    const cards = track.querySelectorAll('.testimonial-card');
    
    // Auto-slide testimonials
    setInterval(() => {
        slideTestimonials(1);
    }, 5000);
}

function slideTestimonials(direction) {
    const track = document.getElementById('testimonials-track');
    const cards = track.querySelectorAll('.testimonial-card');
    const cardWidth = cards[0].offsetWidth + 32; // Include gap
    
    currentTestimonialIndex += direction;
    
    if (currentTestimonialIndex >= cards.length) {
        currentTestimonialIndex = 0;
    } else if (currentTestimonialIndex < 0) {
        currentTestimonialIndex = cards.length - 1;
    }
    
    const translateX = -currentTestimonialIndex * cardWidth;
    track.style.transform = `translateX(${translateX}px)`;
}

// ==========================================
// NEWSLETTER
// ==========================================
function subscribeNewsletter(event) {
    event.preventDefault();
    const email = event.target.querySelector('input[type="email"]').value;
    
    // Simulate subscription
    setTimeout(() => {
        showToast('Successfully subscribed to newsletter!', 'success');
        event.target.reset();
    }, 1000);
    
    showToast('Subscribing...', 'info');
}

// ==========================================
// TOAST NOTIFICATIONS
// ==========================================
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icon = type === 'success' ? 'check-circle' : 
                 type === 'error' ? 'exclamation-circle' : 
                 'info-circle';
    
    toast.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 300);
    }, 5000);
}

// ==========================================
// CSS ANIMATIONS (Added via JavaScript)
// ==========================================
function addCustomStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes sparkle {
            0% {
                opacity: 0;
                transform: scale(0);
            }
            50% {
                opacity: 1;
                transform: scale(1);
            }
            100% {
                opacity: 0;
                transform: scale(0) translateY(-20px);
            }
        }
        
        .fade-in {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.6s ease;
        }
        
        .fade-in.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        .mood-card.selected {
            transform: scale(1.05);
            border-color: var(--primary-color);
            box-shadow: 0 20px 40px rgba(29, 185, 84, 0.3);
        }
        
        .back-to-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: var(--accent-gradient);
            border: none;
            border-radius: 50%;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 1000;
        }
        
        .back-to-top.visible {
            opacity: 1;
            visibility: visible;
        }
        
        .back-to-top:hover {
            transform: translateY(-3px);
        }
        
        .toast {
            display: flex;
            align-items: center;
            gap: 12px;
            background: var(--card-bg);
            border: 1px solid var(--glass-border);
            backdrop-filter: blur(10px);
            padding: 16px 20px;
            border-radius: 12px;
            margin-bottom: 12px;
            transform: translateX(400px);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .toast.show {
            transform: translateX(0);
        }
        
        .toast-success {
            border-left: 4px solid #10b981;
        }
        
        .toast-error {
            border-left: 4px solid #ef4444;
        }
        
        .toast-info {
            border-left: 4px solid #3b82f6;
        }
        
        .toast-close {
            background: none;
            border: none;
            color: var(--text-secondary);
            cursor: pointer;
            margin-left: auto;
            padding: 4px;
            border-radius: 4px;
            transition: all 0.2s ease;
        }
        
        .toast-close:hover {
            background: rgba(255, 255, 255, 0.1);
            color: var(--text-primary);
        }
        
        .toast-container {
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 10000;
            max-width: 400px;
        }
        
        .playlist-actions .action-btn.saved {
            background: var(--primary-color);
            color: white;
        }
        
        .navbar.scrolled {
            background: rgba(15, 15, 15, 0.98);
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
        }
        
        .mobile-menu-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .mobile-menu-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .mobile-menu-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
        
        @media (max-width: 768px) {
            .nav-links {
                position: fixed;
                top: 70px;
                left: -100%;
                width: 100%;
                height: calc(100vh - 70px);
                background: rgba(15, 15, 15, 0.98);
                backdrop-filter: blur(20px);
                flex-direction: column;
                align-items: center;
                justify-content: flex-start;
                padding-top: 50px;
                transition: left 0.3s ease;
            }
            
            .nav-links.mobile-active {
                left: 0;
            }
            
            .mobile-menu-toggle {
                display: flex;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize custom styles
addCustomStyles();

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Performance optimized scroll handler
window.addEventListener('scroll', throttle(handleScroll, 16));

// Export functions for global access
window.selectMood = selectMood;
window.refreshPlaylist = refreshPlaylist;
window.sharePlaylist = sharePlaylist;
window.savePlaylist = savePlaylist;
window.slideTestimonials = slideTestimonials;
window.subscribeNewsletter = subscribeNewsletter;
window.scrollToTop = scrollToTop;