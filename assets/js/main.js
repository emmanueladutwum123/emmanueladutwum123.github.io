// Main JavaScript for Emmanuel Adutwum Portfolio

class PortfolioApp {
    constructor() {
        this.init();
    }
    
    init() {
        // Initialize components
        this.setupNavigation();
        this.setupAnimations();
        this.setupCodeRain();
        this.setupScrollEffects();
        this.setupTypingEffect();
        
        console.log('🚀 Portfolio Initialized');
    }
    
    setupNavigation() {
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        const navLinksItems = document.querySelectorAll('.nav-link');

        // Mobile menu toggle
        if (hamburger) {
            hamburger.addEventListener('click', () => {
                navLinks.classList.toggle('active');
            });
        }

        // Close mobile menu when clicking a link
        navLinksItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });

        // Header scroll effect
        const header = document.getElementById('header');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });

        // Active navigation link highlighting
        const sections = document.querySelectorAll('section');
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.scrollY >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });

            navLinksItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === `#${current}`) {
                    item.classList.add('active');
                }
            });
        });

        // Smooth Scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    setupAnimations() {
        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements to animate
        document.querySelectorAll('.project-card, .publication-item, .timeline-content').forEach(el => {
            observer.observe(el);
        });
    }
    
    setupCodeRain() {
        const codeRain = document.getElementById('codeRain');
        if (!codeRain) return;
        
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$€£¥+-*/=<>{}[]()&|!~';
        
        // Create code drops
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const drop = document.createElement('div');
                drop.className = 'code-drop';
                drop.textContent = characters.charAt(Math.floor(Math.random() * characters.length));
                drop.style.left = `${Math.random() * 100}%`;
                drop.style.animationDuration = `${Math.random() * 5 + 5}s`;
                drop.style.animationDelay = `${Math.random() * 2}s`;
                drop.style.opacity = Math.random() * 0.5 + 0.3;
                
                codeRain.appendChild(drop);
                
                // Remove drop after animation completes
                setTimeout(() => {
                    if (drop.parentNode === codeRain) {
                        codeRain.removeChild(drop);
                    }
                }, parseFloat(drop.style.animationDuration) * 1000);
            }, i * 200);
        }
    }
    
    setupScrollEffects() {
        // Parallax effect for hero
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
            }
        });
    }
    
    setupTypingEffect() {
        const texts = [
            "Hi, my name is",
            "Emmanuel Adutwum.",
            "I build quantitative solutions.",
            "I'm an Economics, Data Science, and Mathematics student specializing in quantitative modeling, algorithmic trading, and machine learning. Currently, I'm focused on developing innovative solutions for complex financial and data-driven challenges."
        ];
        
        const elements = {
            greeting: document.getElementById('greetingText'),
            name: document.getElementById('nameText'),
            title: document.getElementById('titleText'),
            description: document.getElementById('descriptionText'),
            ctaButton: document.getElementById('ctaButton')
        };
        
        // Show greeting immediately
        if (elements.greeting) {
            elements.greeting.textContent = texts[0];
        }
        
        // Type name after delay
        setTimeout(() => {
            this.typeText(elements.name, texts[1], () => {
                // Type title after name
                setTimeout(() => {
                    this.typeText(elements.title, texts[2], () => {
                        // Type description after title
                        setTimeout(() => {
                            this.typeText(elements.description, texts[3], () => {
                                // Show CTA button
                                if (elements.ctaButton) {
                                    elements.ctaButton.style.opacity = '1';
                                    elements.ctaButton.style.transform = 'translateY(0)';
                                }
                            });
                        }, 1000);
                    });
                }, 1000);
            });
        }, 1000);
    }
    
    typeText(element, text, callback) {
        if (!element) {
            callback();
            return;
        }
        
        element.textContent = '';
        let index = 0;
        const speed = 30;
        
        function type() {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(type, speed);
            } else {
                callback();
            }
        }
        
        type();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Remove loading screen
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }, 1000);
    
    // Initialize app
    window.portfolioApp = new PortfolioApp();
    
    // Console greeting
    console.log(`%c🔢 Emmanuel Adutwum - Quantitative Portfolio
%c📈 Advanced Portfolio with 3D Effects & Animations
%c💻 All projects working: Black-Scholes, Cocoa Hedging, HFMM Simulator
%c🚀 Enhanced with Three.js & professional animations
%c🌐 Live at: https://emmanueladutwum123.github.io/`, 
'color: #64ffda; font-size: 16px; font-weight: bold;',
'color: #8892b0; font-size: 14px;',
'color: #64ffda; font-size: 12px;',
'color: #ccd6f6; font-size: 11px;',
'color: #8892b0; font-size: 11px;');
});
