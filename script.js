/**
 * Hansika Portfolio - Dynamic Interactive Engine
 * Palette: Espresso (#3E2723) & Peony (#F4C9D6)
 * Features: Particle Canvas, 3D Tilt, Custom Cursor, Project Filter, Typewriter, Theme Toggle, Modal
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. DYNAMIC PARTICLE CANVAS (Peony & Espresso)
  // ==========================================
  const canvas = document.getElementById('particlesCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let animationFrameId;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const mouse = {
      x: null,
      y: null,
      radius: 120
    };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
    });

    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2.5 + 1;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 20) + 5;
        this.speedX = (Math.random() - 0.5) * 0.8;
        this.speedY = (Math.random() - 0.5) * 0.8;
      }

      draw() {
        ctx.fillStyle = 'rgba(244, 201, 214, 0.55)'; // Peony pink
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

        // Mouse collision reaction
        if (mouse.x != null && mouse.y != null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const maxDistance = mouse.radius;
            const force = (maxDistance - distance) / maxDistance;
            const directionX = forceDirectionX * force * this.density;
            const directionY = forceDirectionY * force * this.density;
            this.x -= directionX;
            this.y -= directionY;
          }
        }
      }
    }

    function initParticles() {
      particlesArray = [];
      const numberOfParticles = Math.min(Math.floor((canvas.width * canvas.height) / 14000), 85);
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    }
    initParticles();

    function connectParticles() {
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          let dx = particlesArray[a].x - particlesArray[b].x;
          let dy = particlesArray[a].y - particlesArray[b].y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 110) {
            let opacityValue = 1 - (distance / 110);
            ctx.strokeStyle = `rgba(244, 201, 214, ${opacityValue * 0.22})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].draw();
        particlesArray[i].update();
      }
      connectParticles();
      animationFrameId = requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // ==========================================
  // 2. DYNAMIC CUSTOM GLOWING CURSOR
  // ==========================================
  const cursorDot = document.getElementById('cursorDot');
  const cursorFollower = document.getElementById('cursorFollower');

  if (cursorDot && cursorFollower && window.innerWidth > 768) {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    function renderCursor() {
      followerX += (mouseX - followerX) * 0.16;
      followerY += (mouseY - followerY) * 0.16;
      cursorFollower.style.left = `${followerX}px`;
      cursorFollower.style.top = `${followerY}px`;
      requestAnimationFrame(renderCursor);
    }
    renderCursor();

    // Scale up on hoverable elements
    const hoverTargets = document.querySelectorAll('a, button, .card, .stat-box');
    hoverTargets.forEach(target => {
      target.addEventListener('mouseenter', () => {
        cursorFollower.style.width = '55px';
        cursorFollower.style.height = '55px';
        cursorFollower.style.borderColor = 'var(--peony-bright)';
      });
      target.addEventListener('mouseleave', () => {
        cursorFollower.style.width = '36px';
        cursorFollower.style.height = '36px';
        cursorFollower.style.borderColor = 'var(--peony)';
      });
    });
  }

  // ==========================================
  // 3. 3D CARD TILT ON MOUSE HOVER
  // ==========================================
  const tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });

  // ==========================================
  // 4. DYNAMIC PROJECT CATEGORY FILTER
  // ==========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.projects-grid .project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ==========================================
  // 5. THEME TOGGLE (Espresso / Peony)
  // ==========================================
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const htmlElement = document.documentElement;

  const savedTheme = localStorage.getItem('hansika-portfolio-theme') || 'dark';
  htmlElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      htmlElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('hansika-portfolio-theme', newTheme);
      updateThemeIcon(newTheme);
      showToast(`Switched to ${newTheme === 'dark' ? 'Espresso Dark' : 'Peony Light'} Mode`);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeIcon) return;
    if (theme === 'dark') {
      themeIcon.className = 'fa-solid fa-moon';
      themeIcon.setAttribute('title', 'Switch to Peony Light Mode');
    } else {
      themeIcon.className = 'fa-solid fa-sun';
      themeIcon.setAttribute('title', 'Switch to Espresso Dark Mode');
    }
  }

  // ==========================================
  // 6. MOBILE NAVIGATION MENU
  // ==========================================
  const menuToggle = document.getElementById('menuToggle');
  const menuIcon = document.getElementById('menuIcon');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      if (menuIcon) {
        menuIcon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
      }
    });

    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        if (menuIcon) menuIcon.className = 'fa-solid fa-bars';
      });
    });
  }

  // ==========================================
  // 7. DYNAMIC TYPEWRITER EFFECT
  // ==========================================
  const typingText = document.getElementById('typingText');
  const phrases = [
    "Aspiring Software Developer",
    "Computer Science Undergraduate",
    "Java, Python & C++ Explorer",
    "Creative Problem Solver & Sketcher",
    "Modern Web Designer"
  ];
  
  let phraseIdx = 0;
  let letterIdx = 0;
  let isDeleting = false;
  let typingDelay = 120;

  function typeEffect() {
    if (!typingText) return;
    const currentPhrase = phrases[phraseIdx];
    
    if (isDeleting) {
      typingText.textContent = currentPhrase.substring(0, letterIdx - 1);
      letterIdx--;
      typingDelay = 50;
    } else {
      typingText.textContent = currentPhrase.substring(0, letterIdx + 1);
      letterIdx++;
      typingDelay = 110;
    }

    if (!isDeleting && letterIdx === currentPhrase.length) {
      typingDelay = 2200;
      isDeleting = true;
    } else if (isDeleting && letterIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      typingDelay = 400;
    }

    setTimeout(typeEffect, typingDelay);
  }

  typeEffect();

  // ==========================================
  // 8. CLIPBOARD & TOAST NOTIFICATION
  // ==========================================
  const toast = document.getElementById('toast');
  let toastTimeout;

  function showToast(message, iconClass = 'fa-solid fa-sparkles') {
    if (!toast) return;
    toast.innerHTML = `<i class="${iconClass}"></i><span>${message}</span>`;
    toast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  const copyEmailHero = document.getElementById('quickCopyEmailHero');
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const copyPhoneBtn = document.getElementById('copyPhoneBtn');

  function copyTextToClipboard(text, successMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(successMsg);
      }).catch(() => {
        fallbackCopy(text, successMsg);
      });
    } else {
      fallbackCopy(text, successMsg);
    }
  }

  function fallbackCopy(text, successMsg) {
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    showToast(successMsg);
  }

  if (copyEmailHero) {
    copyEmailHero.addEventListener('click', () => {
      copyTextToClipboard('24p61a0535@vbithyd.ac.in', 'Email copied to clipboard!');
    });
  }

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      copyTextToClipboard('24p61a0535@vbithyd.ac.in', 'Email copied to clipboard!');
    });
  }

  if (copyPhoneBtn) {
    copyPhoneBtn.addEventListener('click', () => {
      copyTextToClipboard('+918309729211', 'Phone number copied to clipboard!');
    });
  }

  // ==========================================
  // 9. PROJECT DETAIL MODALS
  // ==========================================
  const projectModal = document.getElementById('projectModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalContent = document.getElementById('modalContent');
  const modalTriggers = document.querySelectorAll('.open-modal-btn');

  const projectDetails = {
    campus: {
      title: "Smart Campus Query and Help-Desk System",
      desc: `
        <div class="modal-header">
          <span class="modal-badge">Featured Case Study</span>
          <h3 class="modal-title">Smart Campus Query & Help-Desk System</h3>
        </div>
        <div class="modal-body">
          <p>
            The <strong>Smart Campus Query and Help-Desk System</strong> is an engineered web platform designed to eliminate traditional administrative bottlenecks on campus. 
            Before this system, students had to visit physical offices or navigate fragmented email threads to submit queries and follow up on grievances.
          </p>

          <h4>Core Objectives &amp; Solution</h4>
          <ul>
            <li><strong>Automated Query Categorization:</strong> Directs requests automatically to relevant department administrators (Academics, Facilities, Library, Exam Cell).</li>
            <li><strong>Real-time Status Tracking:</strong> Gives students an updated lifecycle tracker (Submitted &rarr; In Review &rarr; Resolved).</li>
            <li><strong>Centralized Admin Dashboard:</strong> Allows faculty and staff to review, prioritize, and resolve inquiries efficiently without duplicate tickets.</li>
            <li><strong>Responsive Access:</strong> Designed for seamless use on student mobile devices as well as staff workstations.</li>
          </ul>

          <h4>Technical Implementation</h4>
          <p>
            Constructed with standard web fundamentals ensuring high reliability, fast load speeds, and intuitive UX. Engineered with scalable data structures in mind to handle multi-departmental campus workflows.
          </p>

          <div style="margin-top: 1.5rem; display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <span class="tag">HTML5 / Semantic UI</span>
            <span class="tag">CSS3 Responsive Layouts</span>
            <span class="tag">JavaScript Workflow Logic</span>
            <span class="tag">Help-Desk Ticketing</span>
          </div>
        </div>
      `
    },
    barista: {
      title: "Online Barista Cafe Website",
      desc: `
        <div class="modal-header">
          <span class="modal-badge">Design &amp; Development</span>
          <h3 class="modal-title">Online Barista Cafe Website</h3>
        </div>
        <div class="modal-body">
          <p>
            A high-aesthetic, responsive cafe portal developed to elevate customer browsing and online brand presence. 
            Styled with warm artisan branding in Espresso and Peony tones, interactive digital menu exploration, and fluid layouts.
          </p>

          <h4>Core Features &amp; User Experience</h4>
          <ul>
            <li><strong>Interactive Digital Menu:</strong> Category-based browsing (Espresso, Specialty Brews, Artisanal Pastries) with detail cards.</li>
            <li><strong>Artisan Aesthetic:</strong> Clean typography, smooth transitions, and enticing presentation.</li>
            <li><strong>Mobile-First Architecture:</strong> Optimized touch interactions, rapid loading times, and zero layout shift on portable screens.</li>
            <li><strong>Cafe Information &amp; Hours:</strong> Clear location guides, open hours, and fast reservation/contact touchpoints.</li>
          </ul>

          <h4>Key Takeaways</h4>
          <p>
            Showcases proficiency in crafting responsive layouts using modern CSS Flexbox and Grid, paired with vanilla JavaScript for fast client-side responsiveness.
          </p>

          <div style="margin-top: 1.5rem; display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <span class="tag">Responsive Web Design</span>
            <span class="tag">CSS Grid &amp; Flexbox</span>
            <span class="tag">Interactive Menu UI</span>
            <span class="tag">Fast Performance</span>
          </div>
        </div>
      `
    },
    freelancer: {
      title: "Freelancer Marketplace & Talent Platform",
      desc: `
        <div class="modal-header">
          <span class="modal-badge">Full-Stack Web Architecture</span>
          <h3 class="modal-title">Freelancer Marketplace &amp; Talent Platform</h3>
        </div>
        <div class="modal-body">
          <p>
            The <strong>Freelancer Marketplace Platform</strong> is an end-to-end collaborative platform engineered to streamline how businesses and clients connect with independent professionals and developers.
          </p>

          <h4>Core Modules &amp; Architecture</h4>
          <ul>
            <li><strong>Dual User Flows:</strong> Dedicated interfaces and permissions for both Clients (posting gigs, reviewing bids, releasing milestone payments) and Freelancers (browsing jobs, submitting proposals, managing work).</li>
            <li><strong>Dynamic Proposal &amp; Bidding Pipeline:</strong> Structured application flow allowing freelancers to showcase custom pitches, delivery estimates, and portfolios.</li>
            <li><strong>Project Milestone Tracking:</strong> Real-time progress monitor keeping both parties aligned on deliverables and project phases.</li>
            <li><strong>Responsive Client Dashboard:</strong> Optimized for instant contract overview, talent discovery, and mobile accessibility.</li>
          </ul>

          <h4>Development Highlights</h4>
          <p>
            Developed with standard web technologies and structured database modeling to manage relations between users, job postings, proposals, and project milestones.
          </p>

          <div style="margin-top: 1.5rem; display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center;">
            <a href="http://localhost/freelancer-platform/" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" style="text-decoration: none;">
              <i class="fa-solid fa-arrow-up-right-from-square"></i>
              <span>Launch http://localhost/freelancer-platform/</span>
            </a>
            <span class="tag">Marketplace Platform</span>
            <span class="tag">Full-Stack</span>
            <span class="tag">Workflow Management</span>
          </div>
        </div>
      `
    }
  };

  modalTriggers.forEach(btn => {
    btn.addEventListener('click', () => {
      const projectKey = btn.getAttribute('data-project');
      const details = projectDetails[projectKey];
      if (details && modalContent && projectModal) {
        modalContent.innerHTML = details.desc;
        projectModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeModal() {
    if (projectModal) {
      projectModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal && projectModal.classList.contains('active')) {
      closeModal();
    }
  });

  // ==========================================
  // 10. CONTACT FORM SUBMISSION
  // ==========================================
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !subject || !message) {
        showToast('Please fill out all required fields.', 'fa-solid fa-circle-exclamation');
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i><span>Sending...</span>`;
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i><span>Send Message</span>`;
        }
        showToast(`Thank you, ${name}! Your message has been sent.`, 'fa-solid fa-heart');
        contactForm.reset();
      }, 900);
    });
  }

  // ==========================================
  // 11. ACTIVE NAV SCROLLSPY
  // ==========================================
  const sections = document.querySelectorAll('section[id]');
  const navLinkItems = document.querySelectorAll('.nav-links .nav-link');

  function updateActiveNav() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinkItems.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
});
