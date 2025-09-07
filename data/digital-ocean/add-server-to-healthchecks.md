# Add a server to the healthchecks deploy
* Login to http://24.199.116.58:8000/ (Password in bitwarden)
* Click "Add Check"
* Set it up and download the ping url
* SSH into the server, and run:
* `crontab -e`
* Add: `*/5 * * * * curl -fsS --retry 3 http://24.199.116.58:8000/ping/ae701629-809c-486d-9808-fd6ac3deec10 > /dev/null`
* See if it fired with: `grep CRON /var/log/syslog`