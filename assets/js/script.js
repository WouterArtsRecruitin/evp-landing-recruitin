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
            
            // Enhanced validation
            if (!data.name || !data.email || !data.position) {
                showNotification('Vul alle verplichte velden in.', 'error');
                return;
            }
            
            if (!data.privacy) {
                showNotification('Je moet akkoord gaan met de privacyverklaring.', 'error');
                return;
            }
            
            if (!isValidEmail(data.email)) {
                showNotification('Voer een geldig email adres in.', 'error');
                return;
            }
            
            // Sanitize inputs
            data.name = sanitizeInput(data.name);
            data.message = sanitizeInput(data.message);
            
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

    // Email validation - improved regex
    function isValidEmail(email) {
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        return emailRegex.test(email) && email.length <= 254;
    }
    
    // Input sanitization
    function sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        
        return input
            .trim()
            .replace(/[<>]/g, '') // Remove potential HTML tags
            .replace(/javascript:/gi, '') // Remove javascript: protocol
            .substring(0, 1000); // Limit length
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

    // Typeform Integration
    const typeformTrigger = document.getElementById('typeformTrigger');
    const typeformModal = document.getElementById('typeformModal');
    const closeTypeform = document.getElementById('closeTypeform');
    let typeformScriptLoaded = false;

    function loadTypeformScript() {
        if (typeformScriptLoaded) return Promise.resolve();
        
        return new Promise((resolve, reject) => {
            // Check if script is already being loaded
            const existingScript = document.querySelector('script[src*="embed.typeform.com"]');
            if (existingScript) {
                existingScript.onload = () => {
                    typeformScriptLoaded = true;
                    resolve();
                };
                return;
            }
            
            const script = document.createElement('script');
            script.src = 'https://embed.typeform.com/next/embed.js';
            script.async = true;
            script.crossOrigin = 'anonymous';
            script.onload = () => {
                typeformScriptLoaded = true;
                resolve();
            };
            script.onerror = (error) => {
                console.error('Failed to load Typeform script:', error);
                reject(new Error('Typeform script loading failed'));
            };
            document.head.appendChild(script);
        });
    }

    function openTypeform() {
        if (!typeformModal) return;
        
        // Disable trigger button to prevent multiple clicks
        if (typeformTrigger) {
            typeformTrigger.disabled = true;
            typeformTrigger.textContent = 'Formulier laden...';
        }
        
        // Load Typeform script eerst
        loadTypeformScript().then(() => {
            typeformModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Initialize Typeform embed if not already done
            const typeformContainer = typeformModal.querySelector('[data-tf-live]');
            if (typeformContainer && window.tf) {
                // Ensure Typeform is properly initialized
                window.tf.load();
            }
            
            // Track event voor analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'typeform_opened', {
                    'custom_parameter': 'vacature_verbetering',
                    'page_title': document.title
                });
            }
            
            // Focus management voor accessibility
            setTimeout(() => {
                const typeformIframe = typeformModal.querySelector('iframe');
                if (typeformIframe) {
                    typeformIframe.focus();
                } else {
                    // Fallback: focus close button
                    closeTypeform?.focus();
                }
            }, 500);
            
            // Re-enable trigger button
            if (typeformTrigger) {
                typeformTrigger.disabled = false;
                typeformTrigger.textContent = '🎯 Interesse in je verbeterde vacaturetekst?';
            }
            
        }).catch(error => {
            console.error('Fout bij laden Typeform script:', error);
            showNotification('Formulier kon niet worden geladen. Probeer het opnieuw.', 'error');
            
            // Re-enable trigger button on error
            if (typeformTrigger) {
                typeformTrigger.disabled = false;
                typeformTrigger.textContent = '🎯 Interesse in je verbeterde vacaturetekst?';
            }
        });
    }

    function closeTypeformModal() {
        if (typeformModal) {
            typeformModal.classList.remove('active');
            document.body.style.overflow = 'auto';
            
            // Track close event
            if (typeof gtag !== 'undefined') {
                gtag('event', 'typeform_closed', {
                    'custom_parameter': 'vacature_verbetering'
                });
            }
        }
    }

    // Event listeners voor Typeform
    if (typeformTrigger && typeformModal) {
        // Open Typeform bij button click
        typeformTrigger.addEventListener('click', function(e) {
            e.preventDefault();
            openTypeform();
        });
        
        // Sluit Typeform bij close button
        if (closeTypeform) {
            closeTypeform.addEventListener('click', function(e) {
                e.preventDefault();
                closeTypeformModal();
            });
        }
        
        // Sluit bij klik op overlay (buiten container)
        typeformModal.addEventListener('click', function(e) {
            if (e.target === typeformModal || e.target.classList.contains('typeform-overlay')) {
                closeTypeformModal();
            }
        });
        
        // Sluit bij Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && typeformModal.classList.contains('active')) {
                closeTypeformModal();
            }
        });

        // Preload Typeform script on hover voor betere UX
        typeformTrigger.addEventListener('mouseenter', function() {
            loadTypeformScript().catch(error => {
                console.warn('Preload Typeform script gefaald:', error);
            });
        });
    }

    // Enhanced Analytics voor Typeform integratie
    function trackTypeformInteraction(action, details = {}) {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: 'Typeform',
                event_label: 'Vacature Verbetering',
                ...details
            });
        }
        
        // Console logging voor debugging
        console.log('Typeform Event:', action, details);
    }

    // Listen voor Typeform events (als ze beschikbaar zijn)
    window.addEventListener('message', function(event) {
        if (event.origin === 'https://form.typeform.com') {
            const data = event.data;
            
            switch (data.type) {
                case 'form_ready':
                    trackTypeformInteraction('form_ready');
                    break;
                case 'form_submit':
                    trackTypeformInteraction('form_submit', {
                        form_id: '01K25SKWYTKZ05DAHER9D52J94'
                    });
                    // Toon succes bericht
                    setTimeout(() => {
                        closeTypeformModal();
                        showNotification('Bedankt voor je interesse! We nemen snel contact met je op.', 'success');
                    }, 2000);
                    break;
                case 'form_screen_changed':
                    trackTypeformInteraction('form_progress', {
                        screen: data.screen
                    });
                    break;
            }
        }
    });
});
