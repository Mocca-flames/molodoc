/* Phase 1 bootstrap: prepare for interactivity in later phases */
(function () {
  // Replace no-js class for progressive enhancement
  document.documentElement.classList.remove('no-js');

  // Accessibility: ensure any tabpanels with hidden attribute are not focusable
  document.querySelectorAll('[role="tabpanel"][hidden]').forEach(el => {
    el.setAttribute('tabindex', '-1');
    el.setAttribute('aria-hidden', 'true');
  });

  // Phase 2: Navigation menu toggle and smooth scrolling
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuClose = document.querySelector('.mobile-menu-close');
  const mobileMenuLinks = mobileMenu.querySelectorAll('a');

  function openMenu() {
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = ''; // Restore scroll
  }

  menuToggle.addEventListener('click', () => {
    if (mobileMenu.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  mobileMenuClose.addEventListener('click', () => {
    closeMenu();
    menuToggle.focus();
  });

  // Close mobile menu when a link is clicked
  mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Smooth scrolling for all nav links (desktop and mobile)
  const navLinks = document.querySelectorAll('.site-nav a, .mobile-menu-nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
          // Close mobile menu after clicking a link
          if (mobileMenu.classList.contains('open')) {
            closeMenu();
          }
        }
      }
    });
  });

  // Active link highlighting based on scroll position
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const navListLinks = document.querySelectorAll('.site-nav .nav-list a');

  function onScroll() {
    const scrollPos = window.scrollY + 100; // Offset for header height
    let currentSectionId = '';
    for (const section of sections) {
      if (section.offsetTop <= scrollPos) {
        currentSectionId = section.id;
      }
    }
    navListLinks.forEach(link => {
      if (link.getAttribute('href') === '#' + currentSectionId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll);
  onScroll();

  console.log('Molo Phase 2: navigation interactivity loaded.');

  // Phase 3: Hero section interactivity
  const tabs = document.querySelectorAll('[role="tab"]');
  const tabPanels = document.querySelectorAll('[role="tabpanel"]');
  const heroCta = document.querySelector('.hero-cta .btn-accent');

  // Tab switching functionality
  function switchTab(newTab) {
    const targetPanelId = newTab.getAttribute('aria-controls');
    const targetPanel = document.getElementById(targetPanelId);

    // Update tab states
    tabs.forEach(tab => {
      tab.setAttribute('aria-selected', 'false');
      tab.classList.remove('active');
    });
    newTab.setAttribute('aria-selected', 'true');
    newTab.classList.add('active');

    // Update panel visibility
    tabPanels.forEach(panel => {
      panel.setAttribute('hidden', '');
      panel.setAttribute('aria-hidden', 'true');
      panel.setAttribute('tabindex', '-1');
    });
    targetPanel.removeAttribute('hidden');
    targetPanel.setAttribute('aria-hidden', 'false');
    targetPanel.removeAttribute('tabindex');

    // Update hero CTA text based on selected service
    const serviceType = newTab.id.replace('tab-', '');
    let ctaText = 'Get the app';
    switch (serviceType) {
      case 'ride':
        ctaText = 'Request Ride';
        break;
      case 'deliver':
        ctaText = 'Send Package';
        break;
      case 'dine':
        ctaText = 'Order Food';
        break;
      case 'business':
        ctaText = 'Get Quote';
        break;
    }
    heroCta.textContent = ctaText;
  }

  // Add click handlers to tabs
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      switchTab(tab);
    });
  });

  // Keyboard navigation for tabs
  tabs.forEach((tab, index) => {
    tab.addEventListener('keydown', (e) => {
      let newIndex = index;
      if (e.key === 'ArrowRight') {
        newIndex = (index + 1) % tabs.length;
      } else if (e.key === 'ArrowLeft') {
        newIndex = (index - 1 + tabs.length) % tabs.length;
      } else if (e.key === 'Home') {
        newIndex = 0;
      } else if (e.key === 'End') {
        newIndex = tabs.length - 1;
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        switchTab(tab);
        return;
      } else {
        return; // Not a navigation key
      }
      e.preventDefault();
      tabs[newIndex].focus();
      switchTab(tabs[newIndex]);
    });
  });

  // Form validation and submission
  const forms = document.querySelectorAll('.service-form');
  forms.forEach(form => {
    const inputs = form.querySelectorAll('input');
    const submitBtn = form.querySelector('.service-cta');

    // Real-time validation
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        validateInput(input);
      });

      input.addEventListener('input', () => {
        if (input.classList.contains('invalid')) {
          validateInput(input);
        }
      });
    });

    // Form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      inputs.forEach(input => {
        if (!validateInput(input)) {
          isValid = false;
        }
      });

      if (isValid) {
        // Simulate form submission
        submitBtn.textContent = 'Processing...';
        submitBtn.disabled = true;

        setTimeout(() => {
          submitBtn.textContent = 'Success!';
          submitBtn.style.background = '#10B981'; // green

          setTimeout(() => {
            // Reset button
            const serviceType = form.closest('[role="tabpanel"]').id.replace('panel-', '');
            let originalText = 'Request Ride';
            switch (serviceType) {
              case 'ride':
                originalText = 'Request Ride';
                break;
              case 'deliver':
                originalText = 'Send Package';
                break;
              case 'dine':
                originalText = 'Order Food';
                break;
              case 'business':
                originalText = 'Get Quote';
                break;
            }
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = '';
            form.reset();
          }, 2000);
        }, 1500);
      }
    });
  });

  function validateInput(input) {
    const value = input.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Remove existing error styling
    input.classList.remove('invalid');
    const existingError = input.parentNode.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }

    // Basic validation
    if (input.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'This field is required';
    } else if (input.type === 'number' && input.hasAttribute('min')) {
      const min = parseInt(input.getAttribute('min'));
      if (parseInt(value) < min) {
        isValid = false;
        errorMessage = `Minimum value is ${min}`;
      }
    }

    if (!isValid) {
      input.classList.add('invalid');
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-message';
      errorDiv.textContent = errorMessage;
      errorDiv.style.color = '#EF4444';
      errorDiv.style.fontSize = '0.875rem';
      errorDiv.style.marginTop = '4px';
      input.parentNode.appendChild(errorDiv);
    }

    return isValid;
  }

  // Initialize with first tab active
  switchTab(tabs[0]);

  console.log('Molo Phase 3: hero section interactivity loaded.');
})();
