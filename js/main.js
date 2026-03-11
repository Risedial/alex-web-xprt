document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // Mobile nav toggle
  // Hamburger open/close + aria-expanded
  // Close on outside click or nav link click
  // ============================================================
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  function closeMobileMenu() {
    if (!hamburger || !mobileMenu) return;
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    mobileMenu.classList.remove('open');
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', String(!isOpen));
      mobileMenu.setAttribute('aria-hidden', String(isOpen));
      mobileMenu.classList.toggle('open', !isOpen);
    });

    // Close when a mobile nav link is clicked
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      const nav = document.getElementById('nav');
      if (nav && !nav.contains(e.target)) {
        closeMobileMenu();
      }
    });
  }

  // ============================================================
  // Nav scroll shadow
  // Adds `.scrolled` class to nav when scrollY > 40px
  // ============================================================
  const nav = document.getElementById('nav');

  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ============================================================
  // Smooth scroll for anchor links
  // Native CSS scroll-behavior: smooth is set on <html>;
  // this handles the edge case of links that need JS scroll
  // and prevents the default jump behavior where needed.
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href').slice(1);
      if (!targetId) return; // bare # href
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ============================================================
  // Active nav link on scroll (IntersectionObserver)
  // Highlights the nav link whose section is in the viewport
  // ============================================================
  const sectionIds = ['hero', 'services', 'how-it-works', 'portfolio', 'about', 'contact'];
  const navLinks = document.querySelectorAll('.nav-link');

  function setActiveLink(sectionId) {
    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === `#${sectionId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveLink(entry.target.id);
        }
      });
    },
    {
      rootMargin: '-40% 0px -55% 0px',
      threshold: 0,
    }
  );

  sectionIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) sectionObserver.observe(el);
  });

  // ============================================================
  // Scroll reveal (IntersectionObserver on .reveal elements)
  // Fade up: opacity 0→1, translateY 16px→0, 400ms ease-out
  // Stagger first 3 siblings: 0ms, 80ms, 160ms
  // ============================================================
  const revealEls = document.querySelectorAll('.reveal');

  // Assign stagger delays within each parent container (first 3 only)
  const staggerContainers = new Set();
  revealEls.forEach((el) => {
    staggerContainers.add(el.parentElement);
  });

  staggerContainers.forEach((container) => {
    const siblings = container.querySelectorAll('.reveal');
    siblings.forEach((el, i) => {
      if (i < 3) {
        el.style.transitionDelay = `${i * 80}ms`;
      }
    });
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  // ============================================================
  // FAQ accordion
  // <details>/<summary> — only one open at a time
  // ============================================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        faqItems.forEach((other) => {
          if (other !== item && other.open) {
            other.removeAttribute('open');
          }
        });
      }
    });
  });

  // ============================================================
  // Contact form: fetch POST to Formspree
  // Show success message on submit; handle network errors
  // ============================================================
  const contactForm = document.getElementById('contact-form');
  const contactSuccess = document.getElementById('contact-success');

  if (contactForm && contactSuccess) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { Accept: 'application/json' },
        });

        if (response.ok) {
          contactForm.hidden = true;
          contactSuccess.hidden = false;
          contactSuccess.focus();
        } else {
          const data = await response.json().catch(() => ({}));
          const msg =
            data?.errors?.map((err) => err.message).join(', ') ||
            'Something went wrong. Please try again or email me directly.';
          showFormError(contactForm, msg);
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
      } catch {
        showFormError(
          contactForm,
          'Could not send your message — check your connection and try again.'
        );
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }

  function showFormError(form, message) {
    let errorEl = form.querySelector('.form-error');
    if (!errorEl) {
      errorEl = document.createElement('p');
      errorEl.className = 'form-error';
      errorEl.setAttribute('role', 'alert');
      form.insertBefore(errorEl, form.querySelector('[type="submit"]'));
    }
    errorEl.textContent = message;
  }

  // ============================================================
  // Initialize Lucide icons
  // ============================================================
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

});
