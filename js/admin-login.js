// Demo admin login. A real site checks the password on the server (the PHP version does).
(function () {
    if (sessionStorage.getItem('vu_admin')) { location.replace('admin-listings.html'); return; }
    document.getElementById('loginForm').addEventListener('submit', function (e) {
        e.preventDefault();
        var u = document.getElementById('username').value.trim();
        var p = document.getElementById('password').value;
        if (u === VU.CONFIG.ADMIN_USER && p === VU.CONFIG.ADMIN_PASS) {
            sessionStorage.setItem('vu_admin', '1');
            location.href = 'admin-listings.html';
        } else {
            VU.showErrors(document.getElementById('loginErrors'), ['Wrong username or password.']);
        }
    });
})();
