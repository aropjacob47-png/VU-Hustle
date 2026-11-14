// Only show this page right after a listing was sent.
(function () {
    if (!sessionStorage.getItem('vu_listed')) { location.replace('list-business.html'); return; }
    sessionStorage.removeItem('vu_listed');
    document.getElementById('thanks').hidden = false;
})();
