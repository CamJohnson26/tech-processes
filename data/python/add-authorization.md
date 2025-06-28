
# Add authorization to Flask
* Outdated, have a template file in pycharm_templates now
* Following https://auth0.com/docs/quickstart/backend/python/interactive
* Create a new API, add your url to it
* pip3 install Authlib
* pip3 freeze > requirements.txt
* Copy the test api token from the Test page on the api. Just copy response body from one of the curl calls
* in httpie, choose "Auth", "Token", and paste just the jwt
* Create auth0 folder and copy TokenValidator.py from template
* Copy the private_route template into api. replace the route name
* Copy the changes from api.py
* Update the env vars: AUTH0_DOMAIN. Get from Global Settings/Custom Domain and API GeneralSettings/Identifier (AUTH0_AUDIENCE). Audience is the url you provided. The domain is like barely documented but looks like: dev-rie5o6v7bea3cz88.us.auth0.com (It's in text on the page, weird)
* Run locally, request the endpoint with the access token from test
* Commit changes
* Update env vars in DO
* Update Access-Control-Allow-Headers in DO to include Authorization