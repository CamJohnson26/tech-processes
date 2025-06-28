
# Create a Python API on DO App Platform
* Out of date, should be able to copy the files from the api template now
* Follow this: https://docs.digitalocean.com/products/app-platform/getting-started/sample-apps/flask/#deploy-the-app
* Create a new repo and open in PyCharm
* Settings / Project / Add Local Interpretter
* pip3 install Flask gunicorn flask-cors python-dotenv (Make sure (venv) prefix in terminal)
* pip3 freeze > requirements.txt
* Create .env file and add `ALLOWED_ORIGINS='http://localhost:3000'`
* Create api.py, copy from the pycharm-templates project.
* Copy gunicorn_config.py from the pycharm-templates project.
* Test by running `gunicorn --worker-tmp-dir /dev/shm api:app`
* Commit to github
* Go to DO and open Apps on the sidebar. Create App
* Github, select the repo, autodeploy.
* Edit, run command, `gunicorn --worker-tmp-dir /dev/shm api:app`
* Add ALLOWED_ORIGINS='http://localhost:3000' to DO env vars
* add the route to the DigitalOcean CORS options, Prefix
* Add all allowed Methods to DO CORS options
* Next next until billing, edit plan, Basic, $5.00 a month. Create resources
* Check the url by clicking Live App, or check it in HTTPie.