# Setup healthchecks on DigitalOcean
* Login to DigitalOcean (cameronrossjohnson@gmail, email code)
* Make sure you've setup a docker service
* Open the console, run:
```bash
docker create \
  --name=healthchecks \
  -p 8000:8000 \
  --restart unless-stopped \
  -e DB=sqlite \
  -e DB_NAME=/data/hc.sqlite \
  -e DEBUG=False \
  -e SECRET_KEY=--- \
  -e SITE_ROOT=http://24.199.116.58:8000/ \
  -v healthchecks-data:/data \
  healthchecks/healthchecks:latest
docker start healthchecks
docker exec -it healthchecks /opt/healthchecks/manage.py createsuperuser
```
* Set a default username and password
* Note: I got 999 by running `docker exec -it healthchecks id` after create. Otherwise it can't write data
* Note: A docker gotcha is the volume can't be in root, it's blocked
* Go to DOCKER_IP:8000
* Add healthchecks to the services Google Sheet
* TODO: Configure email sending with mailgun or similar