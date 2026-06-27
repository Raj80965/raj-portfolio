// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Check local storage for theme
const savedTheme = localStorage.getItem('portfolioTheme');
if (savedTheme === 'light') {
    body.classList.add('light-mode');
    themeToggle.textContent = '🌞';
} else {
    themeToggle.textContent = '🌓';
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    if (body.classList.contains('light-mode')) {
        themeToggle.textContent = '🌞';
        localStorage.setItem('portfolioTheme', 'light');
    } else {
        themeToggle.textContent = '🌓';
        localStorage.setItem('portfolioTheme', 'dark');
    }
});

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== CURSOR GLOW =====
const cursorGlow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
});

// Add glow effect on hoverable elements
const interactables = document.querySelectorAll('a, button, .project-card, .stat-card, .skill-tag');
interactables.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorGlow.style.transform = 'translate(-50%, -50%) scale(1.5)';
        cursorGlow.style.background = 'radial-gradient(circle, rgba(102, 126, 234, 0.15), transparent 70%)';
    });
    el.addEventListener('mouseleave', () => {
        cursorGlow.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorGlow.style.background = 'radial-gradient(circle, rgba(102, 126, 234, 0.06), transparent 70%)';
    });
});

// ===== AURORA BACKGROUND (CANVAS) =====
const canvas = document.getElementById('aurora-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];

function initCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    particles = [];
    for (let i = 0; i < 50; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 100 + 50,
            color: `hsla(${Math.random() * 60 + 200}, 70%, 60%, 0.05)`,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5
        });
    }
}

function animateCanvas() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < -p.radius) p.x = width + p.radius;
        if (p.x > width + p.radius) p.x = -p.radius;
        if (p.y < -p.radius) p.y = height + p.radius;
        if (p.y > height + p.radius) p.y = -p.radius;

        ctx.beginPath();
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        gradient.addColorStop(0, p.color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
    });
    requestAnimationFrame(animateCanvas);
}

window.addEventListener('resize', initCanvas);
initCanvas();
animateCanvas();

// ===== TYPING TEXT EFFECT =====
const typingText = document.getElementById('typingText');
const roles = ["AI/ML Enthusiast", "Full-Stack Developer", "Robotics Researcher"];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
        typingText.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }

    let typingSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentRole.length) {
        typingSpeed = 2000; // Pause at end
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 500; // Pause before typing next
    }

    setTimeout(type, typingSpeed);
}
setTimeout(type, 1000);

// ===== STATS COUNTER ANIMATION =====
const stats = document.querySelectorAll('.stat-number');
let hasCounted = false;

function countUp() {
    stats.forEach(stat => {
        const target = +stat.getAttribute('data-count');
        const count = +stat.innerText;
        const inc = target / 100;

        if (count < target) {
            stat.innerText = Math.ceil(count + inc);
            setTimeout(countUp, 20);
        } else {
            stat.innerText = target + (target > 5 ? '+' : '');
        }
    });
}

// ===== GSAP SCROLL ANIMATIONS =====
gsap.registerPlugin(ScrollTrigger);

// Hero Animations
gsap.from(".hero-text > *", {
    y: 30,
    opacity: 0,
    duration: 1,
    stagger: 0.1,
    ease: "power3.out"
});

gsap.from(".avatar-glass", {
    scale: 0.8,
    opacity: 0,
    duration: 1.5,
    ease: "elastic.out(1, 0.5)",
    delay: 0.5
});

// Section Title Animations
gsap.utils.toArray('.section-title').forEach(title => {
    gsap.from(title, {
        scrollTrigger: {
            trigger: title,
            start: "top 80%",
        },
        y: 20,
        opacity: 0,
        duration: 0.8
    });
});

// Stats Animation Trigger
ScrollTrigger.create({
    trigger: ".stats-grid",
    start: "top 85%",
    onEnter: () => {
        if (!hasCounted) {
            countUp();
            hasCounted = true;
        }
    }
});

// Animations simplified to ensure visibility

// Contact Form
gsap.from(".contact-grid > div", {
    scrollTrigger: {
        trigger: ".contact-grid",
        start: "top 80%",
    },
    x: (i) => i === 0 ? -50 : 50,
    duration: 0.8,
    ease: "power3.out"
});
