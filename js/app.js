// Shared helpers, saved data, header and footer for every page.
(function () {
    var VU = window.VU;
    var C = VU.CONFIG;
    VU.KEY = 'vu_hustle_data_v1';

    /* ---------- small helpers ---------- */
    VU.esc = function (s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    };
    VU.br = function (s) { return VU.esc(s).replace(/\n/g, '<br>'); };
    VU.ugx = function (n) { return 'UGX ' + Number(n).toLocaleString('en-US'); };
    VU.param = function (name) { return new URLSearchParams(location.search).get(name) || ''; };
    VU.digits = function (p) {
        var d = String(p || '').replace(/\D/g, '');
        if (d.length === 10 && d.charAt(0) === '0') { d = '256' + d.slice(1); }
        return d;
    };
    VU.cleanPhone = function (p) { return String(p || '').replace(/[^\d+]/g, ''); };
    VU.validPhone = function (p) { return /^\+?\d{9,15}$/.test(VU.cleanPhone(p)); };
    VU.slug = function (name) { return String(name).toLowerCase().split(' ')[0].replace(/[^a-z0-9]/g, ''); };
    VU.fmtDate = function (iso) {
        var d = new Date(iso);
        var m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return d.getDate() + ' ' + m[d.getMonth()] + ' ' + d.getFullYear();
    };
    VU.catName = function (id) {
        var c = VU.CATEGORIES.filter(function (x) { return x.id === Number(id); })[0];
        return c ? c.name : '';
    };

    /* ---------- saved data (this browser only) ---------- */
    VU.save = function (d) {
        try { localStorage.setItem(VU.KEY, JSON.stringify(d)); return true; } catch (e) { return false; }
    };
    VU.load = function () {
        try {
            var raw = localStorage.getItem(VU.KEY);
            if (raw) { return JSON.parse(raw); }
        } catch (e) { /* fall through to sample data */ }
        var d = JSON.parse(JSON.stringify(VU.SEED));
        VU.save(d);
        return d;
    };
    VU.resetData = function () { try { localStorage.removeItem(VU.KEY); } catch (e) { /* ignore */ } };
    VU.nextId = function (arr) {
        return arr.reduce(function (m, x) { return Math.max(m, x.id); }, 0) + 1;
    };

    /* ---------- ratings ---------- */
    VU.stats = function (d, sellerId) {
        var r = d.reviews.filter(function (x) { return x.seller_id === sellerId && x.status === 'visible'; });
        var sum = r.reduce(function (t, x) { return t + x.rating; }, 0);
        return { count: r.length, avg: r.length ? Math.round(sum / r.length * 10) / 10 : 0 };
    };
    VU.stars = function (avg) {
        var full = Math.round(avg), out = '';
        for (var i = 1; i <= 5; i++) { out += '<span class="star' + (i <= full ? ' on' : '') + '" aria-hidden="true">&#9733;</span>'; }
        return '<span class="stars" role="img" aria-label="' + Number(avg).toFixed(1) + ' out of 5">' + out + '</span>';
    };
    VU.ratingLine = function (st) {
        if (!st.count) { return '<span class="muted small">No reviews yet</span>'; }
        return VU.stars(st.avg) + ' <span class="small">' + st.avg.toFixed(1) + ' (' + st.count + (st.count === 1 ? ' review' : ' reviews') + ')</span>';
    };

    /* ---------- category icons ---------- */
    VU.icon = function (name) {
        var n = String(name).toLowerCase(), p;
        if (n.indexOf('food') > -1) {
            p = '<path d="M22 5V2l-5.89 5.89"/><circle cx="16.6" cy="15.89" r="3"/><circle cx="8.11" cy="7.4" r="3"/><circle cx="12.35" cy="11.65" r="3"/><circle cx="13.91" cy="5.85" r="3"/><circle cx="18.15" cy="10.09" r="3"/><circle cx="6.56" cy="13.2" r="3"/><circle cx="10.8" cy="17.44" r="3"/><circle cx="5" cy="19" r="3"/>';
        } else if (n.indexOf('fashion') > -1) {
            p = '<path d="M2.048 18.566A2 2 0 0 0 4 21h16a2 2 0 0 0 1.952-2.434l-2-9A2 2 0 0 0 18 8H6a2 2 0 0 0-1.952 1.566z"/><path d="M8 11V6a4 4 0 0 1 8 0v5"/>';
        } else if (n.indexOf('beauty') > -1) {
            p = '<path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/>';
        } else if (n.indexOf('phone') > -1) {
            p = '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>';
        } else if (n.indexOf('service') > -1) {
            p = '<path d="M14 6a4 4 0 005 5l-9 9a2.1 2.1 0 01-3-3l9-9a4 4 0 01-2-2z"/>';
        } else {
            p = '<rect x="4" y="4" width="7" height="7"/><rect x="13" y="4" width="7" height="7"/><rect x="4" y="13" width="7" height="7"/><rect x="13" y="13" width="7" height="7"/>';
        }
        return '<svg viewBox="0 0 24 24" aria-hidden="true">' + p + '</svg>';
    };

    // Tries photo.jpg, then .png, .webp, .jpeg. Runs onFail when none exist.
    VU.tryImage = function (img, base, onFail) {
        var exts = ['jpg', 'png', 'webp', 'jpeg'], i = 0;
        img.addEventListener('error', function () {
            i++;
            if (i < exts.length) { img.src = base + '.' + exts[i]; } else { onFail(img); }
        });
        img.src = base + '.' + exts[0];
    };

    /* ---------- seller card ---------- */
    VU.card = function (s, d) {
        var st = VU.stats(d, s.id), link = 'seller.html?id=' + s.id;
        var img = s.logo || 'img/placeholder.svg';
        var alt = s.logo ? 'Photo of ' + s.business_name : 'No photo yet for ' + s.business_name;
        var desc = s.description.length > 90 ? s.description.slice(0, 90) + '...' : s.description;
        return '<article class="card"><a class="card-img" href="' + link + '"><img src="' + VU.esc(img) + '" alt="' + VU.esc(alt) + '" loading="lazy"></a>' +
            '<div class="card-body"><span class="tag">' + VU.esc(VU.catName(s.category_id)) + '</span>' +
            '<h3><a href="' + link + '">' + VU.esc(s.business_name) + '</a></h3>' +
            '<p class="muted">' + VU.esc(desc) + '</p>' +
            '<p class="small"><strong>Find them:</strong> ' + VU.esc(s.campus_location) + '</p>' +
            '<p>' + VU.ratingLine(st) + '</p></div></article>';
    };

    /* ---------- messages, breadcrumbs ---------- */
    VU.flash = function (msg, type) {
        try { sessionStorage.setItem('vu_flash', JSON.stringify({ msg: msg, type: type || 'ok' })); } catch (e) { /* ignore */ }
    };
    VU.setCrumbs = function (list) {
        var el = document.getElementById('crumbs');
        if (!el || !list || !list.length) { return; }
        el.innerHTML = '<nav class="breadcrumb container" aria-label="Breadcrumb"><ol>' + list.map(function (c) {
            return '<li>' + (c[1] ? '<a href="' + c[1] + '">' + VU.esc(c[0]) + '</a>' : '<span aria-current="page">' + VU.esc(c[0]) + '</span>') + '</li>';
        }).join('') + '</ol></nav>';
    };
    VU.showErrors = function (el, errors) {
        if (!el) { return; }
        el.innerHTML = errors.length ? '<div class="alert alert-error" role="alert"><ul>' + errors.map(function (e) { return '<li>' + VU.esc(e) + '</li>'; }).join('') + '</ul></div>' : '';
    };

    /* ---------- header and footer ---------- */
    function layout() {
        var body = document.body;
        var admin = body.getAttribute('data-admin') === '1';
        if (admin && !sessionStorage.getItem('vu_admin')) { location.replace('admin-login.html'); return; }
        var cur = location.pathname.split('/').pop() || 'index.html';
        function link(href, label) {
            return '<li><a href="' + href + '"' + (cur === href ? ' aria-current="page"' : '') + '>' + label + '</a></li>';
        }
        var items = admin
            ? link('admin-listings.html', 'Pending listings') + link('admin-reviews.html', 'Reviews and reports') + '<li><a href="#" id="logout">Log out</a></li>'
            : link('index.html', 'Home') + link('directory.html', 'Directory') + link('list-business.html', 'List Your Business') + link('about.html', 'About') + link('contact.html', 'Contact');

        var h = document.getElementById('site-header');
        if (h) {
            h.innerHTML = '<header class="site-header"><div class="container bar">' +
                '<a class="brand" href="index.html"><img src="img/logo.svg" alt="" width="36" height="36"><span>VU Hustle</span></a>' +
                '<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>' +
                '<nav id="site-nav" aria-label="Main menu"><ul>' + items + '</ul></nav></div></header>';
        }
        var f = document.getElementById('site-footer');
        if (f) {
            var email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(C.SITE_EMAIL) ? '<a href="mailto:' + VU.esc(C.SITE_EMAIL) + '">' + VU.esc(C.SITE_EMAIL) + '</a>' : VU.esc(C.SITE_EMAIL);
            var wa = VU.digits(C.SITE_WHATSAPP).length >= 10 ? '<a href="https://wa.me/' + VU.digits(C.SITE_WHATSAPP) + '">Chat with us</a>' : VU.esc(C.SITE_WHATSAPP);
            f.innerHTML = '<footer class="site-footer"><div class="container footer-grid">' +
                '<div><h2>VU Hustle</h2><p>A student business directory for Victoria University Uganda.</p></div>' +
                '<div><h2>Contact the site team</h2><p>Email: ' + email + '</p><p>WhatsApp: ' + wa + '</p></div>' +
                '<div><h2>Help</h2><p><a href="safety-terms.html">Safety and Terms</a></p></div></div>' +
                '<p class="copy">&copy; ' + new Date().getFullYear() + ' VU Hustle. Group 14, Victoria University Uganda.</p></footer>';
        }

        var crumbs = body.getAttribute('data-crumbs');
        if (crumbs) { try { VU.setCrumbs(JSON.parse(crumbs)); } catch (e) { /* ignore */ } }

        var fl = null;
        try { fl = JSON.parse(sessionStorage.getItem('vu_flash')); sessionStorage.removeItem('vu_flash'); } catch (e) { fl = null; }
        var flEl = document.getElementById('flash');
        if (fl && flEl) {
            flEl.innerHTML = '<div class="container"><div class="alert alert-' + (fl.type === 'error' ? 'error' : 'ok') + '" role="status">' + VU.esc(fl.msg) + '</div></div>';
        }

        var toggle = document.querySelector('.menu-toggle'), nav = document.getElementById('site-nav');
        if (toggle && nav) {
            toggle.addEventListener('click', function () {
                var open = nav.classList.toggle('open');
                toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            });
        }
        var lo = document.getElementById('logout');
        if (lo) {
            lo.addEventListener('click', function (e) {
                e.preventDefault();
                sessionStorage.removeItem('vu_admin');
                location.href = 'admin-login.html';
            });
        }
        Array.prototype.forEach.call(document.querySelectorAll('input[type=file]'), function (input) {
            input.addEventListener('change', function () {
                if (input.files[0] && input.files[0].size > 3 * 1024 * 1024) {
                    window.alert('That photo is bigger than 3 MB. Please choose a smaller one.');
                    input.value = '';
                }
            });
        });
    }
    layout();
})();
