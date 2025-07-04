* # Deploy Python API
* Go to DO and open App Platform on the sidebar. Create App
* Github, select the repo, autodeploy.
* Edit size, $5 a month
* Edit, run command, `gunicorn --worker-tmp-dir /dev/shm api:app`
* Edit Environment Variables,  Add ALLOWED_ORIGINS='http://localhost:3000' to DO env vars
* Click "Create App"
* Check the url by clicking the link to the Live App, or check it in HTTPie.
* Notes: https://docs.digitalocean.com/products/app-platform/getting-started/sample-apps/flask/#deploy-the-app
* DEPRECATED, but verify not needed:
  * add the route to the DigitalOcean CORS options, Prefix
  * Add all allowed Methods to DO CORS options