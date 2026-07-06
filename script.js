document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // SIDEBAR TAB SECTION TOGGLING
    // ==========================================================================
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');

    function switchSection(targetId) {
        // Remove active class from all nav items and sections
        navItems.forEach(item => item.classList.remove('active'));
        sections.forEach(sec => sec.classList.remove('active-section'));

        // Add active class to corresponding nav item and target section
        const activeNav = document.querySelector(`.nav-item[href="${targetId}"]`);
        if (activeNav) {
            activeNav.classList.add('active');
        }

        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.classList.add('active-section');
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }

    // Attach click listeners to sidebar nav items
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('href');
            switchSection(targetId);
            
            // Update URL hash without jumping
            history.pushState(null, null, targetId);
        });
    });

    // Check URL hash on page load
    if (window.location.hash) {
        const hash = window.location.hash;
        const exists = document.querySelector(hash);
        if (exists && exists.classList.contains('content-section')) {
            switchSection(hash);
        }
    }

    // Attach click listeners to CTA buttons in hero section
    const ctaContact = document.getElementById('cta-contact');
    if (ctaContact) {
        ctaContact.addEventListener('click', (e) => {
            e.preventDefault();
            switchSection('#contact');
            history.pushState(null, null, '#contact');
        });
    }

    // ==========================================================================
    // CONTACT FORM VALIDATION & HANDLER
    // ==========================================================================
    window.handleFormSubmit = function(event) {
        event.preventDefault();

        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        const feedbackSpan = document.getElementById('form-feedback');
        const submitBtn = document.getElementById('form-submit-btn');

        // Simple validation
        if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
            feedbackSpan.textContent = "Error: All fields are required.";
            feedbackSpan.className = "form-feedback-text error";
            return false;
        }

        // Email validation regex
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(emailInput.value.trim())) {
            feedbackSpan.textContent = "Error: Please enter a valid email address.";
            feedbackSpan.className = "form-feedback-text error";
            return false;
        }

        // Simulate submission
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending Message...";
        feedbackSpan.textContent = "";

        setTimeout(() => {
            feedbackSpan.textContent = "Success: Secure message sent. Thank you!";
            feedbackSpan.className = "form-feedback-text success";
            
            // Reset form fields
            nameInput.value = "";
            emailInput.value = "";
            messageInput.value = "";
            
            submitBtn.disabled = false;
            submitBtn.textContent = "Send Secure Message";
        }, 1200);

        return false;
    };
});
