
# Connect frontend to a REST api
* Add an env var to .env.local and .env: REACT_APP_MY_API_URL
* npm install axios
* Create folder dataAccess/myApi
* copy the one of the existing api endpoint hooks
* use the hook and fetch the data
* Edit the ALLOWED_ORIGINS env var in DO to comma include the new origin, ie http://localhost:3000,https://camjohnson26.github.io/stable-diff-frontend/ and add the route to the DigitalOcean CORS options, Prefix. Don't forget to click Save
* Update DO > api > HTTP Request Routes, and add an entry for the new origin
* npm run deploy