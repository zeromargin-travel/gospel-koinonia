/**
 * Gospel Koinonia Enschede - Interactive JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Drawer Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileMenuBtn.setAttribute('aria-expanded', isOpen);
    });

    // Auto-close menu when clicking a navigation link
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!mobileMenuBtn.contains(e.target) && !mobileDrawer.contains(e.target)) {
        mobileDrawer.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 2. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all others (accordion behavior)
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
        }
      });

      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        item.classList.remove('active');
        answer.style.maxHeight = null;
      }
    });
  });

  // Open the first FAQ item by default
  if (faqItems.length > 0) {
    const firstItem = faqItems[0];
    const firstAnswer = firstItem.querySelector('.faq-answer');
    firstItem.classList.add('active');
    if (firstAnswer) {
      firstAnswer.style.maxHeight = firstAnswer.scrollHeight + 'px';
    }
  }

  // 3. Contact Form Submission (Direct to yamasaki_jun@hotmail.com via FormSubmit)
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnHtml = submitBtn.innerHTML;

      // Loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Sending message...</span> <i class="fa-solid fa-spinner fa-spin"></i>';
      formStatus.style.display = 'none';

      const formData = new FormData(contactForm);
      const name = formData.get('name') || 'Friend';

      try {
        const response = await fetch('https://formsubmit.co/ajax/yamasaki_jun@hotmail.com', {
          method: 'POST',
          headers: {
            'Accept': 'application/json'
          },
          body: formData
        });

        const data = await response.json();

        if (data.success === "true" || data.success === true) {
          formStatus.className = 'form-status success';
          formStatus.innerHTML = `Thank you, <strong>${name}</strong>! Your message has been sent directly to our email (yamasaki_jun@hotmail.com). We will be in touch shortly.`;
          formStatus.style.display = 'block';
          contactForm.reset();
        } else if (data.message && data.message.includes('needs Activation')) {
          formStatus.className = 'form-status error';
          formStatus.innerHTML = `<strong>Action Required:</strong> FormSubmit sent an activation email to <strong>yamasaki_jun@hotmail.com</strong>.<br>Please check your inbox (or Junk / Spam folder) and click the <strong>"Activate Form"</strong> button to enable message delivery.`;
          formStatus.style.display = 'block';
        } else if (data.message && data.message.includes('web server')) {
          formStatus.className = 'form-status error';
          formStatus.innerHTML = `<strong>Notice:</strong> Please access via local server (http://localhost:8008) instead of file:// for form submission.`;
          formStatus.style.display = 'block';
        } else {
          // Fallback message
          formStatus.className = 'form-status error';
          formStatus.innerHTML = data.message || 'Unable to send message right now. Please try again or email us directly.';
          formStatus.style.display = 'block';
        }
      } catch (err) {
        console.error('Submission error:', err);
        // Fallback: submit natively via POST to https://formsubmit.co/yamasaki_jun@hotmail.com
        contactForm.submit();
        return;
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }

      // Auto hide success notice after 10 seconds
      setTimeout(() => {
        formStatus.style.display = 'none';
      }, 10000);
    });
  }

  // 4. Update Copyright Year automatically
  const copyrightYear = document.getElementById('copyrightYear');
  if (copyrightYear) {
    copyrightYear.textContent = new Date().getFullYear();
  }

  // 5. Scroll spy for active navigation highlight
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
});
