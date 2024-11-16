// Initialize Three.js background
const initBackground = () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#backgroundCanvas'),
        alpha: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.z = 5;

    // Create geometric shapes
    const geometry = new THREE.IcosahedronGeometry(1, 0);
    const material = new THREE.MeshPhongMaterial({
        color: 0x00FFFF,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });

    const shapes = [];
    for (let i = 0; i < 5; i++) {
        const shape = new THREE.Mesh(geometry, material);
        shape.position.set(
            Math.random() * 10 - 5,
            Math.random() * 10 - 5,
            Math.random() * 5 - 2
        );
        shapes.push(shape);
        scene.add(shape);
    }

    // Add lights
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 0, 1);
    scene.add(light);

    // Animation loop
    const animate = () => {
        requestAnimationFrame(animate);
        
        // Reduce animation complexity on mobile
        const rotationSpeed = window.innerWidth < 768 ? 0.005 : 0.01;
        
        shapes.forEach(shape => {
            shape.rotation.x += rotationSpeed;
            shape.rotation.y += rotationSpeed;
        });
        
        renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
};

// Initialize AOS
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 1000,
        once: true
    });
    initBackground();
});

// Form validation
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        
        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                alert('Thanks for contacting! I will get back to you soon.');
                contactForm.reset();
            } else {
                alert('Oops! Something went wrong. Please try again.');
            }
        } catch (error) {
            alert('Oops! Something went wrong. Please try again.');
        }
    });
}

// Enhanced gallery card interactions
document.querySelectorAll('.gallery-card').forEach(card => {
    // Mouse move effect
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * 10; // Max 10 degrees rotation
        const rotateY = ((centerX - x) / centerX) * 10; // Max 10 degrees rotation
        
        // Apply transform with smooth transition
        card.style.transform = `
            perspective(1000px) 
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg) 
            scale3d(1.05, 1.05, 1.05)
        `;
        
        // Add shine effect
        const shine = card.querySelector('.shine');
        if (shine) {
            shine.style.opacity = '1';
            shine.style.transform = `translate(${x}px, ${y}px)`;
        }
    });
    
    // Reset on mouse leave
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        const shine = card.querySelector('.shine');
        if (shine) {
            shine.style.opacity = '0';
        }
    });
    
    // Add shine element
    const shine = document.createElement('div');
    shine.classList.add('shine');
    card.appendChild(shine);

    card.addEventListener('click', () => {
        // Toggle active class on the clicked card
        card.classList.toggle('active');
        
        // Close other cards if they're open
        document.querySelectorAll('.gallery-card').forEach(otherCard => {
            if (otherCard !== card && otherCard.classList.contains('active')) {
                otherCard.classList.remove('active');
            }
        });
    });
});

// Optional: Add lazy loading for images
document.querySelectorAll('.gallery-card img').forEach(img => {
    img.loading = 'lazy';
    
    // Add fade-in effect when image loads
    img.addEventListener('load', () => {
        img.style.opacity = '1';
    });
});

// Add this function to your existing JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Initialize skill bars smoothly
    const skillFills = document.querySelectorAll('.skill-fill');
    
    setTimeout(() => {
        skillFills.forEach(fill => {
            const width = fill.style.width;
            fill.style.width = '0';
            
            requestAnimationFrame(() => {
                fill.style.transition = 'width 1s ease-in-out';
                fill.style.width = width;
            });
        });
    }, 200);
});

// Optimize scroll performance for skill animations
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
            scrollTimeout = null;
            // Update only visible skill items
            document.querySelectorAll('.skill-item').forEach(item => {
                if (isElementInViewport(item)) {
                    item.style.transform = 'translateZ(0)';
                }
            });
        }, 66);
    }
}, { passive: true });

// Add this to your JavaScript file
document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.project-card');
    
    const showProjectDetails = () => {
        projectCards.forEach(card => {
            const cardTop = card.getBoundingClientRect().top;
            const triggerPoint = window.innerHeight * 0.65; // 35% from the bottom
            
            if (cardTop < triggerPoint) {
                card.querySelector('.project-details').classList.add('show');
            }
        });
    };

    // Initial check
    showProjectDetails();

    // Add scroll event listener with throttling
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                scrollTimeout = null;
                showProjectDetails();
            }, 50); // Throttle to 50ms
        }
    }, { passive: true });

    // Handle resize events
    window.addEventListener('resize', showProjectDetails, { passive: true });
});

// Optional: Add Intersection Observer for better performance
if ('IntersectionObserver' in window) {
    const projectObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.35) {
                entry.target.querySelector('.project-details').classList.add('show');
                projectObserver.unobserve(entry.target); // Stop observing once shown
            }
        });
    }, {
        threshold: 0.35 // Trigger when 35% of the element is visible
    });

    document.querySelectorAll('.project-card').forEach(card => {
        projectObserver.observe(card);
    });
} 

// Mouse tracking for image cards
document.querySelectorAll('.image-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.setProperty('--rotateX', `${rotateX}deg`);
        card.style.setProperty('--rotateY', `${rotateY}deg`);
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.setProperty('--rotateX', '0deg');
        card.style.setProperty('--rotateY', '0deg');
    });
});

// Single, consolidated project card click handler with toggle functionality
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.project-card').forEach(card => {
        // Handle both click and touch events
        ['click', 'touchend'].forEach(eventType => {
            card.addEventListener(eventType, function(e) {
                e.preventDefault();
                
                const content = this.querySelector('.card-content');
                const viewMore = this.querySelector('.view-more');
                
                if (!content || !viewMore) return;
                
                // Add click animation
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
                
                // Toggle current card
                const isActive = content.classList.contains('active');
                
                // First, close all cards
                document.querySelectorAll('.project-card').forEach(otherCard => {
                    const otherContent = otherCard.querySelector('.card-content');
                    const otherViewMore = otherCard.querySelector('.view-more');
                    
                    if (otherContent && otherViewMore) {
                        otherContent.classList.remove('active');
                        otherViewMore.style.opacity = '1';
                        otherViewMore.style.visibility = 'visible';
                    }
                });
                
                // Then, if this card wasn't active, open it
                if (!isActive) {
                    content.classList.add('active');
                    viewMore.style.opacity = '0';
                    viewMore.style.visibility = 'hidden';
                }
                
            }, { passive: false });
        });
        
        // Add transition for smooth animation
        card.style.transition = 'transform 0.15s ease, box-shadow 0.3s ease';
    });
});

// Add this to your existing DOMContentLoaded event listener or create a new one
document.addEventListener('DOMContentLoaded', () => {
    // Keep all your existing DOMContentLoaded code
    
    // Add expertise item mobile functionality
    const handleExpertiseItems = () => {
        if (window.innerWidth <= 768) {
            document.querySelectorAll('.expertise-item').forEach(item => {
                const content = item.querySelector('p');
                
                // Move content after the title-icon row if needed
                if (content) {
                    item.appendChild(content);
                }
                
                // Only add click listener if it doesn't already have one
                if (!item.hasAttribute('data-handler-attached')) {
                    item.setAttribute('data-handler-attached', 'true');
                    item.addEventListener('click', function() {
                        this.classList.toggle('active');
                        
                        // Close other items
                        document.querySelectorAll('.expertise-item').forEach(otherItem => {
                            if (otherItem !== this) {
                                otherItem.classList.remove('active');
                            }
                        });
                    });
                }
            });
        }
    };

    // Initialize expertise items
    handleExpertiseItems();
    
    // Add resize handler if not already present
    window.addEventListener('resize', () => {
        handleExpertiseItems();
        
        // Remove active classes on desktop
        if (window.innerWidth > 768) {
            document.querySelectorAll('.expertise-item').forEach(item => {
                item.classList.remove('active');
            });
        }
    });
});

