// Contact page: checks the form and keeps the message in the browser.
(function () {
    document.getElementById('contactForm').addEventListener('submit', function (e) {
        e.preventDefault();
        var name = document.getElementById('name').value.trim();
        var email = document.getElementById('email').value.trim();
        var message = document.getElementById('message').value.trim();
        var errors = [];
        if (name.length < 2 || name.length > 80) { errors.push('Enter your name (2 to 80 characters).'); }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 120) { errors.push('Enter a valid email address.'); }
        if (message.length < 10 || message.length > 1000) { errors.push('Write a message between 10 and 1000 characters.'); }
        VU.showErrors(document.getElementById('contactErrors'), errors);
        if (errors.length) { return; }
        var d = VU.load();
        d.messages.push({ id: VU.nextId(d.messages), name: name, email: email, message: message, created_at: new Date().toISOString() });
        VU.save(d);
        VU.flash('Thank you. Your message was sent to the site team.');
        location.reload();
    });
    document.getElementById('contactEmail').textContent = VU.CONFIG.SITE_EMAIL;
    document.getElementById('contactWa').textContent = VU.CONFIG.SITE_WHATSAPP;
})();
