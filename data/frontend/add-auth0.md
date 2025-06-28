
# Add Auth0 to Frontend app
* Go to Auth0, create application, name it, single page app. Select React.
* Set the callback url and logout url and allowable origins to your site's url in application settings, and also http://localhost:3000. Comma separated, provide the trailing url slash.
* `npm install @auth0/auth0-react`
* Create .env file on frontend to have REACT_APP_AUTH0_DOMAIN and REACT_APP_AUTH0_CLIENT_ID and REACT_APP_ORIGIN_URL. Fill from settings and set the URL to the deployed location, with trailing url if needed. Create .env.local and Copy from the settings and set to http://localhost:3000
* ALSO create .env.production.local to make sure deployed app uses the right env vars
* To prevent this issue: https://community.auth0.com/t/silent-authorization-not-working-after-login-signup/37114/5 Turn on refresh tokens
* Add the Auth0Provider from Frontend Templates to wrap the app in index.tsx
* Copy the LoginButton file from templates and add it to the homepage
* npm run start, verify it works
* Guard the main components by user from `useAuth0`
* Copy the LogoutButton and UserProfile components
* Add all the components to App.tsx, make sure they work
* Commit and push changes,
* npm run deploy
* Make sure it works on deployed app
