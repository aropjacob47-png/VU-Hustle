// Home page: category cards, featured sellers and the hero picture.
(function () {
    var d = VU.load();

    var hero = document.getElementById('heroImg');
    if (hero) {
        VU.tryImage(hero, 'img/hero', function (img) { img.src = 'img/hero-default.svg'; });
    }

    var cats = document.getElementById('cats');
    cats.innerHTML = VU.CATEGORIES.map(function (c) {
        return '<a class="cat" href="directory.html?category=' + c.id + '">' +
            '<span class="cat-media"><img class="cat-img" data-cat="' + VU.esc(c.name) + '" alt="" loading="lazy"></span>' +
            '<span class="cat-label"><span class="cat-icon">' + VU.icon(c.name) + '</span><strong>' + VU.esc(c.name) + '</strong></span>' +
            '<span class="cat-arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></a>';
    }).join('');
    Array.prototype.forEach.call(cats.querySelectorAll('img.cat-img'), function (img) {
        var name = img.getAttribute('data-cat');
        VU.tryImage(img, 'img/categories/' + VU.slug(name), function (broken) {
            var span = document.createElement('span');
            span.className = 'cat-img cat-fallback';
            span.innerHTML = VU.icon(name);
            broken.parentNode.replaceChild(span, broken);
        });
    });

    var approved = d.sellers.filter(function (s) { return s.status === 'approved'; });
    approved.sort(function (a, b) {
        var sa = VU.stats(d, a.id).avg, sb = VU.stats(d, b.id).avg;
        return sb - sa || b.created_at.localeCompare(a.created_at);
    });
    var featured = approved.slice(0, 6);
    var box = document.getElementById('featured');
    if (featured.length) {
        box.innerHTML = '<div class="grid">' + featured.map(function (s) { return VU.card(s, d); }).join('') + '</div>' +
            '<p style="margin-top:20px"><a class="btn btn-outline" href="directory.html">See all sellers</a></p>';
    } else {
        box.innerHTML = '<p>No sellers are listed yet. Be the first to list your business.</p><a class="btn btn-primary" href="list-business.html">List Your Business</a>';
    }
})();
