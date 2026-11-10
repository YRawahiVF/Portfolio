// Main JavaScript for general functionality

document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
  const closeMenuBtn = document.querySelector('.close-menu-btn');
  
  if (menuToggle && mobileMenuOverlay && closeMenuBtn) {
    menuToggle.addEventListener('click', () => {
      mobileMenuOverlay.classList.add('show');
    });

    closeMenuBtn.addEventListener('click', () => {
      mobileMenuOverlay.classList.remove('show');
    });

    // Close menu if clicking outside the content area
    mobileMenuOverlay.addEventListener('click', (e) => {
      if (e.target === mobileMenuOverlay) { // Check if the click is on the overlay itself
        mobileMenuOverlay.classList.remove('show');
      }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') mobileMenuOverlay.classList.remove('show');
    });
  }

  // Mobile "download cv" buttons (header + drawer) proxy to the real
  // generator button that lives in the (hidden-on-mobile) sidebar console.
  document.querySelectorAll('#header-download-cv, #drawer-download-cv, #sidebar-download-cv').forEach(btn => {
    btn.addEventListener('click', () => {
      if (mobileMenuOverlay) mobileMenuOverlay.classList.remove('show');
      const realBtn = document.getElementById('download-cv-btn');
      if (realBtn) realBtn.click();
    });
  });
  
  // Tab navigation setup is now called from data-loader.js after data loads
  
  // Scrollspy for navigation (Keep if you want sidebar links to highlight on scroll)
  const sections = document.querySelectorAll('.section');
  const navItems = document.querySelectorAll('.sidebar .nav-links a'); 
  
  function resetActiveClass() {
    navItems.forEach(item => {
      item.classList.remove('active');
    });
  }
  
  // Highlight active nav link based on scroll position
  function handleScroll() {
    const scrollPosition = window.scrollY;
    let currentSectionId = null;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = sectionId;
      }
    });

    resetActiveClass();
    if (currentSectionId) {
      const activeNavLink = document.querySelector(`.sidebar .nav-links a[href="#${currentSectionId}"]`);
      if (activeNavLink) {
        activeNavLink.classList.add('active');
      }
    }
  }
  
  // Only add scroll event listener if there are sidebar nav items to update
  if (navItems.length > 0) {
    window.addEventListener('scroll', handleScroll);
  }
  
  // Smooth scrolling for sidebar navigation links (If sidebar links are used)
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = item.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        window.scrollTo({
          top: targetSection.offsetTop - 50,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Contact form submission (remains unchanged)
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const formValues = Object.fromEntries(formData.entries());
      console.log('Form Submitted:', formValues);
      alert('Thank you! Your message has been sent.');
      contactForm.reset();
    });
  }

  // Local clock in the status console
  const clockEl = document.getElementById('local-clock');
  if (clockEl) {
    const tick = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      clockEl.textContent = `${hh}:${mm} GST`;
    };
    tick();
    setInterval(tick, 30000);
  }

  // Typed hero subtitle (progressive enhancement; respects reduced motion)
  const typeTarget = document.querySelector('.type-target');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (typeTarget && !reduceMotion) {
    const full = typeTarget.dataset.type || typeTarget.textContent;
    typeTarget.textContent = '';
    let i = 0;
    const typeNext = () => {
      if (i <= full.length) {
        typeTarget.textContent = full.slice(0, i);
        i++;
        setTimeout(typeNext, 28);
      }
    };
    setTimeout(typeNext, 350);
  }

});

// Function to apply fade-in class to visible elements in a tab
function showTabContent(tabPane) {
  if (!tabPane) return;
  const elements = tabPane.querySelectorAll('.service-card, .timeline-item, .portfolio-item, .skill-item');
  // Redesigned tabs have no entrance animation
  if (document.body.classList.contains('theme-light')) return;
  elements.forEach(element => {
    element.classList.add('fade-in'); 
  });
}

// Setup tab navigation (for main tabs and mobile menu)
function setupTabNavigation() {
  const mainTabButtons = document.querySelectorAll('.tab-navigation .tab-btn');
  const mobileNavContainer = document.querySelector('.mobile-nav-links');
  const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay'); // Reference for closing menu
  const tabPanes = document.querySelectorAll('.tab-pane');
  
  // Clear mobile nav container initially
  if(mobileNavContainer) mobileNavContainer.innerHTML = '';

  // Find the initially active tab and pane
  let initialActivePane = null;
  let activeTabId = 'about'; // Default to 'about'

  if (mainTabButtons.length > 0 && tabPanes.length > 0) {
    // Start from a clean slate so the statically-active pane in the HTML
    // doesn't stay visible when a different tab is the initial one.
    tabPanes.forEach(pane => pane.classList.remove('active'));

    // Find the initially active button based on class or default
    let initialActiveButton = document.querySelector('.tab-navigation .tab-btn.active');
    if (!initialActiveButton) {
      initialActiveButton = mainTabButtons[0]; // Default to the first button
      if (initialActiveButton) initialActiveButton.classList.add('active');
    }
    if(initialActiveButton) {
        activeTabId = initialActiveButton.getAttribute('data-tab');
    }
    
    initialActivePane = document.getElementById(activeTabId);
    if (initialActivePane) {
      initialActivePane.classList.add('active');
      showTabContent(initialActivePane); // Show content for initial tab
    } else if(tabPanes.length > 0) {
      // Fallback if active tab id doesn't match a pane
      tabPanes[0].classList.add('active');
      showTabContent(tabPanes[0]);
      if(mainTabButtons[0]) mainTabButtons[0].classList.add('active');
    }
  }

  // The redesigned light theme applies to the tabs redesigned so far
  const LIGHT_TABS = ['about', 'resume', 'honors'];
  document.body.classList.toggle('theme-light', LIGHT_TABS.includes(activeTabId));

  // Function to handle tab switching
  const handleTabClick = (targetId) => {
      document.body.classList.toggle('theme-light', LIGHT_TABS.includes(targetId));

      // Remove active class from all main buttons and panes
      mainTabButtons.forEach(btn => btn.classList.remove('active'));
      tabPanes.forEach(pane => pane.classList.remove('active'));
      
      // Add active class to the clicked main button and corresponding pane
      const clickedMainButton = document.querySelector(`.tab-navigation .tab-btn[data-tab="${targetId}"]`);
      if(clickedMainButton) clickedMainButton.classList.add('active');
      
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
        showTabContent(targetPane);
      }
      // Close mobile menu after selection
      if (mobileMenuOverlay) mobileMenuOverlay.classList.remove('show');
  };

  // Add click listeners to main tab buttons
  mainTabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-tab');
      handleTabClick(targetId);
    });
  });

  // Light / dark switch for the redesigned pages (initial class set inline in <body>)
  const themeSwitches = document.querySelectorAll('.js-theme-switch');
  const syncThemeSwitches = () => {
    const isDark = document.body.classList.contains('theme-dark');
    themeSwitches.forEach(sw => sw.setAttribute('aria-checked', String(isDark)));
  };
  themeSwitches.forEach(sw => {
    sw.addEventListener('click', () => {
      const isDark = document.body.classList.toggle('theme-dark');
      try { localStorage.setItem('theme', isDark ? 'dark' : 'light'); } catch (e) {}
      syncThemeSwitches();
    });
  });
  syncThemeSwitches();

  // Populate mobile nav and add listeners
  if (mobileNavContainer && mainTabButtons.length > 0) {
      mainTabButtons.forEach(mainButton => {
          const mobileLink = document.createElement('a');
          mobileLink.href = `#${mainButton.dataset.tab}`;
          mobileLink.textContent = mainButton.textContent;
          mobileLink.className = 'mobile-nav-link'; // Add class for styling
          if (mainButton.classList.contains('active')) {
              mobileLink.classList.add('active'); // Sync active state
          }

          mobileLink.addEventListener('click', (e) => {
              e.preventDefault(); // Prevent default anchor behavior
              const targetId = mainButton.dataset.tab;
              handleTabClick(targetId);
              // Update active class on mobile links
              mobileNavContainer.querySelectorAll('.mobile-nav-link').forEach(link => link.classList.remove('active'));
              mobileLink.classList.add('active');
          });
          mobileNavContainer.appendChild(mobileLink);
      });
  }
} 