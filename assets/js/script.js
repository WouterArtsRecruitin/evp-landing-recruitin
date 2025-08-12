// EVP Landing Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scrolling voor navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinksContainer.classList.toggle('mobile-open');
            this.classList.toggle('active');
        });
    }

    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollY = window.scrollY;
    });

    // Form submission
    const applicationForm = document.getElementById('applicationForm');
    if (applicationForm) {
        applicationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            
            // Basic validation
            if (!data.name || !data.email || !data.position) {
                showNotification('Vul alle verplichte velden in.', 'error');
                return;
            }
            
            if (!isValidEmail(data.email)) {
                showNotification('Voer een geldig email adres in.', 'error');
                return;
            }
            
            // Simulate form submission
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = 'Versturen...';
            submitButton.disabled = true;
            
            // Simulate API call delay
            setTimeout(() => {
                // In a real application, you would send data to your backend
                console.log('Form data:', data);
                
                showNotification('Bedankt voor je sollicitatie! We nemen snel contact met je op.', 'success');
                
                // Reset form
                this.reset();
                
                // Reset button
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                
                // Track conversion (example with Google Analytics)
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'application_submitted', {
                        'custom_parameter': data.position
                    });
                }
                
            }, 2000);
        });
    }

    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add styles if not already added
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 10000;
                    padding: 1rem 1.5rem;
                    border-radius: 8px;
                    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
                    max-width: 400px;
                    animation: slideIn 0.3s ease;
                }
                
                .notification-success {
                    background-color: #10b981;
                    color: white;
                }
                
                .notification-error {
                    background-color: #ef4444;
                    color: white;
                }
                
                .notification-info {
                    background-color: #3b82f6;
                    color: white;
                }
                
                .notification-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 1rem;
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    color: inherit;
                    font-size: 1.5rem;
                    cursor: pointer;
                    line-height: 1;
                    padding: 0;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @media (max-width: 480px) {
                    .notification {
                        right: 10px;
                        left: 10px;
                        max-width: none;
                    }
                }
            `;
            document.head.appendChild(styles);
        }
        
        // Add to page
        document.body.appendChild(notification);
        
        // Close button functionality
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', () => {
            notification.remove();
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.remove();
            }
        }, 5000);
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature-card, .benefit-item, .position-card');
    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // Add CSS for animations
    if (!document.querySelector('#animation-styles')) {
        const animationStyles = document.createElement('style');
        animationStyles.id = 'animation-styles';
        animationStyles.textContent = `
            .feature-card,
            .benefit-item,
            .position-card {
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.6s ease;
            }
            
            .feature-card.animate-in,
            .benefit-item.animate-in,
            .position-card.animate-in {
                opacity: 1;
                transform: translateY(0);
            }
            
            .header.scrolled {
                background: rgba(255, 255, 255, 0.98);
                backdrop-filter: blur(20px);
                box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
            }
            
            @media (max-width: 768px) {
                .nav-links.mobile-open {
                    display: flex;
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: white;
                    flex-direction: column;
                    padding: 1rem 2rem;
                    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
                    gap: 1rem;
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
            }
        `;
        document.head.appendChild(animationStyles);
    }

    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
            }, 0);
        });
    }
});
