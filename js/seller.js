// Seller profile: products, reviews, review form, report form, call and WhatsApp.
(function () {
    var d = VU.load();
    var id = parseInt(VU.param('id'), 10);
    var s = d.sellers.filter(function (x) { return x.id === id && x.status === 'approved'; })[0];
    var root = document.getElementById('profile');

    if (!s) {
        document.title = 'Page not found | VU Hustle';
        root.innerHTML = '<section class="section"><div class="container center"><h1>Seller not found</h1><p>This seller does not exist or is not approved yet.</p><a class="btn btn-primary" href="directory.html">Back to the Directory</a></div></section>';
        return;
    }

    document.title = s.business_name + ' | VU Hustle';
    VU.setCrumbs([['Home', 'index.html'], ['Directory', 'directory.html'], [s.business_name, null]]);

    var st = VU.stats(d, s.id);
    var reviews = d.reviews.filter(function (r) { return r.seller_id === s.id && r.status === 'visible'; })
        .sort(function (a, b) { return b.created_at.localeCompare(a.created_at); });
    var phone = VU.cleanPhone(s.phone);
    var wa = VU.digits(s.whatsapp || s.phone);
    var waText = encodeURIComponent('Hello ' + s.business_name + ', I found you on VU Hustle.');
    var logoAlt = s.logo ? 'Logo of ' + s.business_name : 'No photo yet for ' + s.business_name;

    var products = s.products.length ? '<div class="grid">' + s.products.map(function (p) {
        return '<article class="card"><img src="' + VU.esc(p.photo || 'img/placeholder.svg') + '" alt="' + VU.esc(p.name) + '" loading="lazy" style="width:100%;aspect-ratio:4/3;object-fit:cover">' +
            '<div class="card-body"><h3>' + VU.esc(p.name) + '</h3><p class="price">' + VU.esc(VU.ugx(p.price)) + '</p></div></article>';
    }).join('') + '</div>' : '<p>This seller has not added products yet.</p>';

    var reviewList = reviews.length ? '<p>' + VU.ratingLine(st) + '</p>' + reviews.map(function (r) {
        return '<div class="review"><p>' + VU.stars(r.rating) + ' <strong>' + VU.esc(r.reviewer_name) + '</strong> <span class="small muted">' + VU.esc(VU.fmtDate(r.created_at)) + '</span></p><p>' + VU.br(r.comment) + '</p></div>';
    }).join('') : '<p>No reviews yet. Be the first to share your experience.</p>';

    root.innerHTML =
        '<section class="section"><div class="container"><div class="profile-head">' +
        '<img src="' + VU.esc(s.logo || 'img/placeholder.svg') + '" alt="' + VU.esc(logoAlt) + '"><div>' +
        '<span class="tag">' + VU.esc(VU.catName(s.category_id)) + '</span><h1>' + VU.esc(s.business_name) + '</h1>' +
        '<p>' + VU.ratingLine(st) + '</p><p><strong>Find them on campus:</strong> ' + VU.esc(s.campus_location) + '</p>' +
        '<p>' + VU.br(s.description) + '</p><div class="actions">' +
        '<a class="btn btn-primary" href="tel:' + VU.esc(phone) + '">Call</a>' +
        '<a class="btn btn-wa" href="https://wa.me/' + VU.esc(wa) + '?text=' + waText + '">WhatsApp</a>' +
        '<a class="btn btn-outline" href="#review-form">Leave a review</a></div></div></div></div></section>' +
        '<section class="section soft"><div class="container"><h2>Products and prices</h2>' + products + '</div></section>' +
        '<section class="section" id="reviews"><div class="container"><h2>Reviews</h2>' + reviewList +
        '<h2 id="review-form" style="margin-top:32px">Leave a review</h2><div id="reviewErrors"></div>' +
        '<form class="form" id="reviewForm" novalidate>' +
        '<div class="field"><label for="reviewer_name">Your name</label><input type="text" id="reviewer_name" maxlength="60" required></div>' +
        '<div class="field"><label for="rating">Rating</label><select id="rating" required><option value="">Choose a rating</option>' +
        [5, 4, 3, 2, 1].map(function (n) { return '<option value="' + n + '">' + n + ' out of 5</option>'; }).join('') + '</select></div>' +
        '<div class="field"><label for="comment">Your comment</label><textarea id="comment" maxlength="500" required></textarea></div>' +
        '<button class="btn btn-primary" type="submit">Submit</button></form>' +
        '<details class="report"><summary>Report this seller</summary><div id="reportErrors"></div>' +
        '<form class="form" id="reportForm" novalidate><div class="field"><label for="reason">What is the problem</label><textarea id="reason" maxlength="500" required></textarea></div>' +
        '<button class="btn btn-danger" type="submit">Send report</button></form></details></div></section>';

    document.getElementById('reviewForm').addEventListener('submit', function (e) {
        e.preventDefault();
        var name = document.getElementById('reviewer_name').value.trim();
        var rating = parseInt(document.getElementById('rating').value, 10) || 0;
        var comment = document.getElementById('comment').value.trim();
        var errors = [];
        if (name.length < 2 || name.length > 60) { errors.push('Enter your name (2 to 60 characters).'); }
        if (rating < 1 || rating > 5) { errors.push('Choose a rating from 1 to 5.'); }
        if (comment.length < 5 || comment.length > 500) { errors.push('Write a comment between 5 and 500 characters.'); }
        VU.showErrors(document.getElementById('reviewErrors'), errors);
        if (errors.length) { return; }
        var fresh = VU.load();
        fresh.reviews.push({ id: VU.nextId(fresh.reviews), seller_id: s.id, reviewer_name: name, rating: rating, comment: comment, status: 'visible', created_at: new Date().toISOString() });
        VU.save(fresh);
        VU.flash('Thank you. Your review has been added.');
        location.hash = 'reviews';
        location.reload();
    });

    document.getElementById('reportForm').addEventListener('submit', function (e) {
        e.preventDefault();
        var reason = document.getElementById('reason').value.trim();
        var errors = (reason.length < 5 || reason.length > 500) ? ['Explain the problem in 5 to 500 characters.'] : [];
        VU.showErrors(document.getElementById('reportErrors'), errors);
        if (errors.length) { return; }
        var fresh = VU.load();
        fresh.reports.push({ id: VU.nextId(fresh.reports), seller_id: s.id, reason: reason, created_at: new Date().toISOString() });
        VU.save(fresh);
        VU.flash('Thank you. The site team will look at your report.');
        location.reload();
    });
})();
