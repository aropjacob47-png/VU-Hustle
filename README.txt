VU HUSTLE (HTML, CSS and JavaScript version)
Group 14, Internet Technologies and Web Design, Victoria University Uganda

HOW TO RUN IT IN VS CODE
1. Open VS Code, click File, then Open Folder, and choose the vu-hustle-static folder.
2. Click the Extensions icon on the left and install the extension called Live Server.
3. Right click index.html and choose Open with Live Server.
   The site opens in your browser. When you save a file, the page refreshes by itself.
You can also double click index.html to open it in the browser without Live Server.

BEFORE YOU START
Open js/config.js and replace the placeholder email and WhatsApp number.

HOW IT KEEPS DATA
There is no database in this version. Listings, reviews, reports and messages are saved
in your own browser (localStorage). That means:
- Each person sees only the data saved in their own browser.
- Clearing browser data removes new listings. The sample sellers come back.
- Photos are shrunk before saving so the browser storage does not fill up.
For a site where every visitor sees the same sellers, use the PHP and MySQL version.

ADMIN (DEMO ONLY)
Open admin-login.html. Username: admin  Password: ChangeMe123!
The password sits in js/config.js and anyone can read it, so this login is only for the demo.
The PHP version checks the password on the server.

FILES
index.html, directory.html, seller.html, list-business.html, thank-you.html, about.html,
contact.html, safety-terms.html, 404.html   The pages
admin-login.html, admin-listings.html, admin-reviews.html   The admin pages
css/style.css   Colors, spacing and the phone layout
js/config.js    Your settings
js/data.js      Categories and sample sellers
js/app.js       Shared helpers, header and footer
js/home.js, directory.js, seller.js, list.js, contact.js, thank-you.js, admin-login.js, admin.js   One script per page
img/            Logo, placeholder, hero picture and category photos

CHANGING PICTURES
Home picture: save your photo as img/hero.jpg (png and webp also work).
Category photos: replace the files in img/categories (food, fashion, beauty, phones, services, other).
