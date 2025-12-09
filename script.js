// Scroll Reveal Animation
const revealElements = document.querySelectorAll('.stat-item, .service-card, .contact-item, .about-text, .contact-form');

const revealOnScroll = () => {
    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (elementTop < windowHeight - 100) {
            element.classList.add('revealed');
        }
    });
};

// Add reveal class to elements
revealElements.forEach(element => {
    element.classList.add('reveal-element');
});

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Typing effect for hero title
const heroTitle = document.querySelector('.hero-content h1');
if (heroTitle) {
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    heroTitle.style.opacity = '1';

    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            heroTitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    };

    setTimeout(typeWriter, 500);
}

// Parallax effect for hero
const hero = document.querySelector('.hero');
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// Mouse move effect for service cards
const cards = document.querySelectorAll('.service-card');
cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
    });
});

// Counter animation for stats
const stats = document.querySelectorAll('.stat-item h3');
const animateCounter = (element) => {
    const target = parseInt(element.textContent);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
        current += step;
        if (current < target) {
            element.textContent = Math.floor(current) + '+';
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + '+';
        }
    };

    updateCounter();
};

// Intersection Observer for counter animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const h3 = entry.target.querySelector('h3');
            if (h3 && !h3.classList.contains('animated')) {
                h3.classList.add('animated');
                animateCounter(h3);
            }
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-item').forEach(stat => {
    statsObserver.observe(stat);
});

// Form input animation
const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
formInputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
    });

    input.addEventListener('blur', () => {
        if (!input.value) {
            input.parentElement.classList.remove('focused');
        }
    });
});

// Create floating particles
const createParticles = () => {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    document.querySelector('.hero').appendChild(particlesContainer);

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 5}s;
            animation-duration: ${5 + Math.random() * 10}s;
        `;
        particlesContainer.appendChild(particle);
    }
};

createParticles();

// Add magnetic effect to button
const buttons = document.querySelectorAll('.btn');
buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.05)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0) scale(1)';
    });
});

// Add cursor glow effect
const cursorGlow = document.createElement('div');
cursorGlow.className = 'cursor-glow';
document.body.appendChild(cursorGlow);

document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
});

// =============================================
// SUPABASE INTEGRATION
// =============================================

// Load data from Supabase on page load
async function loadSupabaseData() {
    try {
        // Check if supabase config exists
        if (typeof supabase === 'undefined') {
            console.log('Supabase not configured, using static content');
            return;
        }

        // Load Services
        await loadServices();

        // Load Statistics
        await loadStatistics();

        // Setup contact form
        setupContactForm();

        console.log('Supabase data loaded successfully!');
    } catch (error) {
        console.error('Error loading Supabase data:', error);
    }
}

// Load Services from Supabase
async function loadServices() {
    try {
        const services = await supabase.fetch('services', {
            select: '*',
            order: 'display_order.asc',
            filter: { 'is_active': 'eq.true' }
        });

        if (services && services.length > 0) {
            const servicesGrid = document.querySelector('.services-grid');
            if (servicesGrid) {
                servicesGrid.innerHTML = services.map(service => `
                    <div class="service-card">
                        <div class="service-icon">${service.icon}</div>
                        <h3>${service.title}</h3>
                        <p>${service.description}</p>
                    </div>
                `).join('');

                // Re-apply animations to new cards
                initServiceCardAnimations();
            }
        }
    } catch (error) {
        console.log('Using static services data');
    }
}

// Load Statistics from Supabase
async function loadStatistics() {
    try {
        const stats = await supabase.fetch('statistics', {
            select: '*',
            order: 'display_order.asc'
        });

        if (stats && stats.length > 0) {
            const statsContainer = document.querySelector('.stats');
            if (statsContainer) {
                statsContainer.innerHTML = stats.map(stat => `
                    <div class="stat-item">
                        <h3>${stat.value}${stat.suffix}</h3>
                        <p>${stat.label}</p>
                    </div>
                `).join('');

                // Re-apply reveal animations
                document.querySelectorAll('.stat-item').forEach(item => {
                    item.classList.add('reveal-element');
                    statsObserver.observe(item);
                });
            }
        }
    } catch (error) {
        console.log('Using static statistics data');
    }
}

// Setup Contact Form to submit to Supabase
function setupContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        // Get form data
        const formData = {
            name: form.querySelector('input[type="text"]').value,
            email: form.querySelector('input[type="email"]').value,
            message: form.querySelector('textarea').value
        };

        // Validate
        if (!formData.name || !formData.email || !formData.message) {
            showNotification('Mohon lengkapi semua field!', 'error');
            return;
        }

        try {
            // Show loading state
            submitBtn.textContent = 'Mengirim...';
            submitBtn.disabled = true;

            // Submit to Supabase
            await supabase.insert('contact_messages', formData);

            // Success
            showNotification('Pesan berhasil dikirim! Kami akan segera menghubungi Anda.', 'success');
            form.reset();

        } catch (error) {
            console.error('Error submitting form:', error);
            showNotification('Gagal mengirim pesan. Silakan coba lagi.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Show notification
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Re-initialize service card animations after loading from Supabase
function initServiceCardAnimations() {
    const cards = document.querySelectorAll('.service-card');
    cards.forEach(card => {
        card.classList.add('reveal-element');

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
        });
    });

    // Trigger reveal
    setTimeout(() => {
        cards.forEach(card => card.classList.add('revealed'));
    }, 100);
}

// Initialize Supabase data on page load
document.addEventListener('DOMContentLoaded', loadSupabaseData);

console.log('Website loaded successfully!');
