
# Assessment Test Guide

This is a guide to the assessment test. While it's not as perfect as it could be, it handles the required features needed. Due to time constraints, I inherited an existing project and redesigned it to fit the required features. I hope this approach works out.

## Backend Instructions:

To start the backend server, please create a `.env` file at the root of the project and then run the command `npm start`. This will start your server on `localhost:8080`.

Here are the details for the `.env` file:

```
DB_URI=mongodb+srv://nheeon:Newman11@cluster0.knjtv5p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=yourjwtsecret
SALT=10
BASE_URL=http://localhost:8080
FRONTEND_URL=http://localhost:3000
FRONTEND_PROD_URL=https://gbd.nyeusi.org
EMAIL_HOST=smtp.gmail.com
EMAIL_SERVICE=gmail
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=seacube.com@gmail.com
EMAIL_PASSWORD=qfeyubkcjcarotnt
RECAPTCHA_SECRET_KEY=6LdGcaEpAAAAALu61rRFBnKMgVEk9W_DoGkv0JaC

INSTAGRAM_SESSION_ID=your_instagram_access_token
FACEBOOK_ACCESS_TOKEN=your_facebook_access_token
TIKTOK_ACCESS_TOKEN=your_tiktok_access_token

DEFAULT_ADMIN_USERNAME=superadmin
DEFAULT_ADMIN_EMAIL=superadmin@example.com
DEFAULT_ADMIN_PASSWORD=P@ssword2024
```

## Frontend Instructions:

To start the frontend, run the command `npm run dev`. Similarly, you need to create a `.env` file at the root of the frontend project. Here are the details for the frontend `.env` file:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
NEXT_PUBLIC_RECAPCHA_SITE_KEY=6LdGcaEpAAAAAA4WbYujBktTZGih6nKdOD58IQox
```

Please note that the frontend root URL does not display anything by default. To test the requested features, you will need to log in, as I implemented it as an admin dashboard. To log in, navigate to `localhost:3000/login`, which will then direct you to `localhost:3000/dashboard`. If you attempt to access the dashboard without logging in, it won't display any data, so please ensure you log in first.

Once logged in, you can test the search feature and view individual products by clicking on the action icon.

## Final Notes:

Thank you for your understanding. I didn't have much time to work on something more extensive, but this implementation addresses the features you mentioned. I had only about 2 hours to work on this. Also, the login credentials (username and password) are in the `.env` file of the server code.
