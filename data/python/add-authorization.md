
# Add authorization to Flask
* Go to Auth0 > Applications > APIs > Create API
* Set the identifier to project-name-api, keep default options
* Install python library
```shell
pip3 install Authlib 
pip3 freeze > requirements.txt
```
* Test the API by going to the test tab and running the CURL command
* Create token validator file
```python
# auth0/token_validator.py
import json
from urllib.request import urlopen

from authlib.oauth2.rfc7523 import JWTBearerTokenValidator
from authlib.jose.rfc7517.jwk import JsonWebKey


class Auth0JWTBearerTokenValidator(JWTBearerTokenValidator):
    def __init__(self, domain, audience):
        issuer = f"https://{domain}/"
        jsonurl = urlopen(f"{issuer}.well-known/jwks.json")
        public_key = JsonWebKey.import_key_set(
            json.loads(jsonurl.read())
        )
        super(Auth0JWTBearerTokenValidator, self).__init__(
            public_key
        )
        self.claims_options = {
            "exp": {"essential": True},
            "aud": {"essential": True, "value": audience},
            "iss": {"essential": True, "value": issuer},
        }
```
* Create a auth protector decorator
```python
# auth0/auth_protector.py
from dotenv import load_dotenv
from os import getenv

from authlib.integrations.flask_oauth2 import ResourceProtector
from auth0.TokenValidator import Auth0JWTBearerTokenValidator

load_dotenv()


def load_require_auth():
    resource_protector = ResourceProtector()

    domain = getenv('AUTH0_DOMAIN')
    audience = getenv('AUTH0_AUDIENCE')

    validator = Auth0JWTBearerTokenValidator(
        f"{domain}",
        f"{audience}"
    )

    resource_protector.register_token_validator(validator)
    return resource_protector


require_auth = load_require_auth()

```
* Create a new private route
```python
# MY_API/routes/get_private.py
from flask import Blueprint, jsonify

from auth0.auth_protector import require_auth

get_private_bp = Blueprint('get_private', __name__)


@get_private_bp.route('/private')
@require_auth()
def get_private():
    return 'Hello, World! (shhh)'

```
* Add the route to create_api
```python
# MY_API/create_api.py

    app.register_blueprint(get_private_bp)
```
* Add env vars:
  * `AUTH0_DOMAIN` env var from auth0.com > Settings > Custom Domain (The domain is like barely documented but looks like: dev-rie5o6v7bea3cz88.us.auth0.com (It's in text on the page, weird))
  * `AUTH0_AUDIENCE` from auth0.com > apis > MY_API, and audience is listed (identifier from earlier)
* Run `gunicorn --worker-tmp-dir /dev/shm api:app`
* Open HTTPie, change route to /private
* Choose "Auth", "Bearer Token", and paste just the jwt from the API test page
* Should see "Hello, World! (shhh)". Verify it returns 401 without a token
* Commit changes
* Update env vars in DO
* Update HTTP Request Routes > Configure CORS > Access-Control-Allow-Headers in DO to include Authorization. Don't forget to click save
* Wait for deploy 
* Work through `new-frontend-protected-api.md`