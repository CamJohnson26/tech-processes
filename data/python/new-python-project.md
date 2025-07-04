# Setting up a Python program
* run through `new-git-repo.md`
* Open the folder in pycharm or Create a new Repo
* Create
```shell
# .gitignore
*.pyc 
```
* Add the api template OR the cli template OR the file processing template
  * API Template:
```python
# MY_API/create_api.py

from flask import Flask
from flask_cors import CORS

from dotenv import load_dotenv
from os import getenv

from MY_API.routes.get_route import get_route_bp

load_dotenv()


def create_api():
    app = Flask(__name__)

    allowed_origins = getenv('ALLOWED_ORIGINS')
    CORS(app, origins=allowed_origins)

    app.register_blueprint(get_route_bp)

    return app

```
```python
# MY_API/routes/get_route.py

from flask import Blueprint, render_template

get_route_bp = Blueprint('home', __name__)


@get_route_bp.route('/')
def get_route():
    return "Hello World!"
```
```python
# gunicorn_config.py

bind = "0.0.0.0:8080"
workers = 2
```
```python
# api.py

from MY_API.create_api import create_api

app = create_api()

```
* Add a Python interpretter (File > Settings > Project Name > Python Interpretters > Add Interpretter > Local)
* `pip3 install python-dotenv` (Make sure (venv) prefix in terminal)
* Install any template packages:
  * API:
```shell
pip3 install flask flask-cors gunicorn
```
* `pip3 freeze > requirements.txt`
* Create env files
```shell
touch .env
touch .env.sample
```
* Fill out required env values:
  * Api:
```shell
ALLOWED_ORIGINS='http://localhost:3000'
```
* Configure commands
  * API:
    * Test by running `gunicorn --worker-tmp-dir /dev/shm api:app`
    * Open HTTPie and send a request to `http://127.0.0.1:8000` (Should see "Hello World!")
* Update the Readme with description (Goal) and usage instructions and technical details
* Check in the code
* If API, Go through `deploy-python-api.md`