// PEIMA Website - Main JavaScript File

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the website
    initWebsite();
});

function initWebsite() {
    // Initialize Bootstrap components
    initBootstrapComponents();
    
    // Setup page navigation
    setupPageNavigation();
    
    // Setup form validation
    setupFormValidation();
    
    // Setup back to top button
    setupBackToTop();
    
    // Initialize page-specific features
    initPageFeatures();
}

function initBootstrapComponents() {
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Initialize popovers
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
}

function setupPageNavigation() {
    // Hide all pages except home
    document.querySelectorAll('.page').forEach(page => {
        if (!page.classList.contains('active')) {
            page.style.display = 'none';
        }
    });
    
    // Setup navigation links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            // Check if it's a page link
            if (href.startsWith('#') && href.length > 1) {
                const pageId = href.substring(1);
                showPage(pageId);
                e.preventDefault();
                
                // Update active nav item
                updateActiveNav(this);
            }
        });
    });
    
    // Handle browser back/forward buttons
    window.addEventListener('hashchange', function() {
        const hash = window.location.hash.substring(1) || 'home';
        showPage(hash);
    });
}

function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.style.display = 'none';
        page.classList.remove('active');
    });
    
    // Show selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.style.display = 'block';
        setTimeout(() => {
            targetPage.classList.add('active');
        }, 10);
        
        // Scroll to top of page
        window.scrollTo(0, 0);
        
        // Update URL hash
        window.location.hash = pageId;
    } else {
        // Default to home if page not found
        showPage('home');
    }
}

function updateActiveNav(clickedLink) {
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to clicked link
    clickedLink.classList.add('active');
    
    // Also update parent dropdown if exists
    const dropdownToggle = clickedLink.closest('.dropdown-item')?.closest('.dropdown')?.querySelector('.dropdown-toggle');
    if (dropdownToggle) {
        dropdownToggle.classList.add('active');
    }
}

function setupFormValidation() {
    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        // Character counter for message field
        const messageField = document.getElementById('message');
        const charCount = document.getElementById('charCount');
        
        if (messageField && charCount) {
            messageField.addEventListener('input', function() {
                const length = this.value.length;
                charCount.textContent = `${length}/1000 characters`;
                
                if (length > 1000) {
                    charCount.classList.add('text-danger');
                    this.classList.add('is-invalid');
                } else {
                    charCount.classList.remove('text-danger');
                    this.classList.remove('is-invalid');
                }
            });
        }
        
        // Form submission
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            let isValid = true;
            const requiredFields = this.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.classList.add('is-invalid');
                    isValid = false;
                } else {
                    field.classList.remove('is-invalid');
                }
            });
            
            // Message length validation
            if (messageField && messageField.value.length > 1000) {
                messageField.classList.add('is-invalid');
                isValid = false;
            }
            
            if (isValid) {
                // Show success message
                alert('Thank you for your message! We will get back to you soon.');
                this.reset();
                
                // Reset character counter
                if (charCount) {
                    charCount.textContent = '0/1000 characters';
                    charCount.classList.remove('text-danger');
                }
            }
        });
        
        // Remove invalid class on input
        contactForm.querySelectorAll('input, textarea, select').forEach(field => {
            field.addEventListener('input', function() {
                this.classList.remove('is-invalid');
            });
        });
    }
}

function setupBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    
    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.style.display = 'block';
            } else {
                backToTopButton.style.display = 'none';
            }
        });
        
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

function initPageFeatures() {
    // Publications page filtering
    const publicationTabs = document.querySelectorAll('#publicationTabs .nav-link');
    if (publicationTabs.length > 0) {
        publicationTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const category = this.textContent.toLowerCase();
                filterPublications(category);
                
                // Update active tab
                publicationTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
    
    // Smooth scrolling for anchor links within pages
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Check if it's an anchor within current page
            if (href.startsWith('#') && document.querySelector(href)) {
                const targetElement = document.querySelector(href);
                const currentPage = this.closest('.page.active');
                
                if (currentPage && targetElement && currentPage.contains(targetElement)) {
                    e.preventDefault();
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Filter publications by category
function filterPublications(category) {
    const publications = document.querySelectorAll('.publication-card');
    const noResults = document.getElementById('no-results');
    
    let visibleCount = 0;
    
    publications.forEach(pub => {
        if (category === 'all' || pub.dataset.category === category) {
            pub.style.display = 'flex';
            visibleCount++;
        } else {
            pub.style.display = 'none';
        }
    });
    
    // Show/hide no results message
    if (noResults) {
        noResults.style.display = visibleCount > 0 ? 'none' : 'block';
    }
}

// Initiative detail functions
const initiativeData = {
    'foundation': {
        title: 'Foundation Assisted Schools',
        subtitle: 'Improving school infrastructure & resources',
        launch: 'January 2016',
        coverage: '500+ schools across 15 districts',
        budget: 'PKR 2.5 billion (2022-23)',
        contact: 'fas@PEIMA.gov.pk | Ext: 301',
        content: `
            <h3>Overview</h3>
            <p>The Foundation Assisted Schools program is one of PEIMA's flagship initiatives aimed at improving educational quality in partner schools through comprehensive support.</p>
            
            <h4 class="mt-4">Objectives</h4>
            <ul>
                <li>Improve physical infrastructure of partner schools</li>
                <li>Enhance teaching quality through targeted training</li>
                <li>Provide learning materials and resources</li>
                <li>Strengthen school management and governance</li>
                <li>Improve student learning outcomes</li>
            </ul>
            
            <h4 class="mt-4">Program Components</h4>
            <div class="row mt-3">
                <div class="col-md-6">
                    <h5>Infrastructure Development</h5>
                    <p>Construction and renovation of classrooms, libraries, science labs, and washroom facilities.</p>
                </div>
                <div class="col-md-6">
                    <h5>Teacher Training</h5>
                    <p>Regular professional development programs focusing on pedagogy, subject knowledge, and assessment.</p>
                </div>
                <div class="col-md-6">
                    <h5>Learning Resources</h5>
                    <p>Provision of textbooks, teaching aids, science kits, and digital learning materials.</p>
                </div>
                <div class="col-md-6">
                    <h5>Capacity Building</h5>
                    <p>Training for school administrators and management committees on school governance.</p>
                </div>
            </div>
            
            <h4 class="mt-4">Impact</h4>
            <p>Since its inception, the program has:</p>
            <ul>
                <li>Improved learning environments for over 200,000 students</li>
                <li>Trained more than 8,000 teachers</li>
                <li>Increased student enrollment by 25% in partner schools</li>
                <li>Improved student retention rates by 18%</li>
                <li>Enhanced learning outcomes as measured by standardized tests</li>
            </ul>
        `
    },
    'voucher': {
        title: 'Education Voucher Scheme',
        subtitle: 'Financial assistance for deserving students',
        launch: 'March 2017',
        coverage: '50,000+ students in 10 districts',
        budget: 'PKR 1.8 billion (2022-23)',
        contact: 'evs@PEIMA.gov.pk | Ext: 302',
        content: `
            <h3>Overview</h3>
            <p>The Education Voucher Scheme provides targeted financial assistance to students from low-income families, enabling them to access quality education in partner private schools.</p>
            
            <h4 class="mt-4">Eligibility Criteria</h4>
            <ul>
                <li>Family income below poverty threshold</li>
                <li>Student age between 5-16 years</li>
                <li>Resident of Punjab province</li>
                <li>Not currently enrolled in any government or private school</li>
                <li>Preference given to female students and special needs children</li>
            </ul>
            
            <h4 class="mt-4">Application Process</h4>
            <ol>
                <li>Online application through PEIMA portal or designated centers</li>
                <li>Document verification (income certificate, CNIC, etc.)</li>
                <li>Home visit and assessment by verification team</li>
                <li>Approval and voucher issuance</li>
                <li>School selection and admission</li>
            </ol>
            
            <h4 class="mt-4">Voucher Coverage</h4>
            <p>The voucher covers:</p>
            <ul>
                <li>Full tuition fees for the academic year</li>
                <li>Textbooks and stationery</li>
                <li>School uniform (two sets annually)</li>
                <li>Examination fees</li>
                <li>Transportation allowance (where applicable)</li>
            </ul>
            
            <h4 class="mt-4">Impact</h4>
            <p>The scheme has significantly increased access to quality education:</p>
            <ul>
                <li>50,000+ students supported since inception</li>
                <li>Female enrollment increased by 35% in target areas</li>
                <li>97% voucher renewal rate indicating program satisfaction</li>
                <li>Improved learning outcomes comparable to regular students</li>
            </ul>
        `
    },
    'teacher': {
        title: 'Teacher Training Project',
        subtitle: 'Professional development for educators',
        launch: 'August 2018',
        coverage: 'All 36 districts of Punjab',
        budget: 'PKR 850 million (2022-23)',
        contact: 'ttp@PEIMA.gov.pk | Ext: 303',
        content: `
            <h3>Overview</h3>
            <p>A comprehensive professional development program for teachers focusing on modern pedagogical approaches, classroom management, subject knowledge enhancement, and assessment techniques.</p>
            
            <h4 class="mt-4">Training Modules</h4>
            <ul>
                <li>Modern Teaching Methodologies</li>
                <li>Classroom Management Strategies</li>
                <li>Subject-Specific Pedagogy</li>
                <li>Assessment and Evaluation Techniques</li>
                <li>Educational Technology Integration</li>
                <li>Special Needs Education</li>
            </ul>
            
            <h4 class="mt-4">Training Delivery</h4>
            <div class="row mt-3">
                <div class="col-md-6">
                    <h5>Face-to-Face Workshops</h5>
                    <p>Intensive 5-day workshops at regional training centers.</p>
                </div>
                <div class="col-md-6">
                    <h5>Online Modules</h5>
                    <p>Self-paced online courses through PEIMA Learning Portal.</p>
                </div>
                <div class="col-md-6">
                    <h5>School-Based Training</h5>
                    <p>On-site coaching and mentoring by master trainers.</p>
                </div>
                <div class="col-md-6">
                    <h5>Peer Learning</h5>
                    <p>Teacher learning circles and professional learning communities.</p>
                </div>
            </div>
            
            <h4 class="mt-4">Impact</h4>
            <p>The program has transformed teaching practices across Punjab:</p>
            <ul>
                <li>10,000+ teachers trained since 2018</li>
                <li>85% improvement in classroom engagement</li>
                <li>70% increase in use of modern teaching methods</li>
                <li>Improved student satisfaction and learning outcomes</li>
            </ul>
        `
    },
    'digital': {
        title: 'Digital Learning Program',
        subtitle: 'Technology-enhanced education',
        launch: 'June 2019',
        coverage: '200 schools in 25 districts',
        budget: 'PKR 1.2 billion (2022-23)',
        contact: 'dlp@PEIMA.gov.pk | Ext: 304',
        content: `
            <h3>Overview</h3>
            <p>Integrating technology in classrooms through digital content, learning management systems, and teacher training on educational technology to enhance learning outcomes and digital literacy.</p>
            
            <h4 class="mt-4">Program Components</h4>
            <div class="row mt-3">
                <div class="col-md-6">
                    <h5>Smart Classrooms</h5>
                    <p>Installation of interactive whiteboards, projectors, and audio systems in classrooms.</p>
                </div>
                <div class="col-md-6">
                    <h5>Student Tablets</h5>
                    <p>Provision of tablets with pre-loaded educational content and apps.</p>
                </div>
                <div class="col-md-6">
                    <h5>Digital Content</h5>
                    <p>Development of interactive lessons, videos, and simulations aligned with curriculum.</p>
                </div>
                <div class="col-md-6">
                    <h5>Learning Management System</h5>
                    <p>Online platform for content delivery, assignments, and progress tracking.</p>
                </div>
            </div>
            
            <h4 class="mt-4">Teacher Training</h4>
            <p>Comprehensive training program for teachers on:</p>
            <ul>
                <li>Using educational technology effectively</li>
                <li>Creating digital content</li>
                <li>Managing digital classrooms</li>
                <li>Online assessment techniques</li>
            </ul>
            
            <h4 class="mt-4">Impact</h4>
            <p>The program has revolutionized learning experiences:</p>
            <ul>
                <li>200 smart classrooms established</li>
                <li>5,000 tablets distributed to students</li>
                <li>500+ hours of digital content created</li>
                <li>30% improvement in student engagement</li>
                <li>Enhanced digital literacy among students and teachers</li>
            </ul>
        `
    }
};

function showInitiativeDetail(initiative) {
    if (initiativeData[initiative]) {
        const data = initiativeData[initiative];
        
        document.getElementById('initiative-title').textContent = data.title;
        document.getElementById('initiative-subtitle').textContent = data.subtitle;
        document.getElementById('initiative-launch').textContent = data.launch;
        document.getElementById('initiative-coverage').textContent = data.coverage;
        document.getElementById('initiative-budget').textContent = data.budget;
        document.getElementById('initiative-contact').textContent = data.contact;
        document.getElementById('initiative-content').innerHTML = data.content;
        
        // Hide initiatives list and show detail
        document.getElementById('initiatives').style.display = 'none';
        document.getElementById('initiative-detail').style.display = 'block';
        
        // Scroll to top
        window.scrollTo(0, 0);
    }
}

function hideInitiativeDetail() {
    document.getElementById('initiative-detail').style.display = 'none';
    document.getElementById('initiatives').style.display = 'block';
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Initialize the website when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWebsite);
} else {
    initWebsite();
}
// Leadership Carousel Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize leadership carousel
    initLeadershipCarousel();
});

function initLeadershipCarousel() {
    const carousel = document.querySelector('.leadership-carousel');
    const slides = document.querySelectorAll('.leadership-slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevButton = document.querySelector('.carousel-nav.prev');
    const nextButton = document.querySelector('.carousel-nav.next');
    
    if (!carousel || slides.length === 0) return;
    
    let currentSlide = 0;
    let autoSlideInterval;
    const slideInterval = 8000; // 8 seconds
    
    // Function to show a specific slide
    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Remove active class from all indicators
        indicators.forEach(indicator => {
            indicator.classList.remove('active');
        });
        
        // Show the selected slide
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
        currentSlide = index;
        
        // Update button states
        updateButtonStates();
    }
    
    // Function to go to next slide
    function nextSlide() {
        let nextIndex = currentSlide + 1;
        if (nextIndex >= slides.length) {
            nextIndex = 0;
        }
        showSlide(nextIndex);
        resetAutoSlide();
    }
    
    // Function to go to previous slide
    function prevSlide() {
        let prevIndex = currentSlide - 1;
        if (prevIndex < 0) {
            prevIndex = slides.length - 1;
        }
        showSlide(prevIndex);
        resetAutoSlide();
    }
    
    // Function to update button states
    function updateButtonStates() {
        // For a 2-slide carousel, we don't need to disable buttons
        // But we can add visual feedback if needed
    }
    
    // Function to start auto sliding
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, slideInterval);
    }
    
    // Function to reset auto slide timer
    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }
    
    // Function to stop auto sliding
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }
    
    // Event Listeners
    if (prevButton) {
        prevButton.addEventListener('click', prevSlide);
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', nextSlide);
    }
    
    // Indicator click events
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
            resetAutoSlide();
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });
    
    // Pause auto-slide on hover
    carousel.addEventListener('mouseenter', stopAutoSlide);
    carousel.addEventListener('mouseleave', startAutoSlide);
    
    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoSlide();
    });
    
    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoSlide();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50; // Minimum swipe distance
        
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left - next slide
            nextSlide();
        }
        
        if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right - previous slide
            prevSlide();
        }
    }
    
    // Initialize
    showSlide(0);
    startAutoSlide();
    
    // Clean up on page hide
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopAutoSlide();
        } else {
            startAutoSlide();
        }
    });
}
