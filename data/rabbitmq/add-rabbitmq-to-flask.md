
# Add RabbitMQ to Flask app
* Copy over the rabbitmq/publish_message file and directory
*
```
pip3 install pika
pip3 freeze > requirements.txt
```
* Copy Rabbit MQ env vars from bitwarden
* Create a new endpoint and publish the message
* Run locally and test with no auth
* Deploy and add rabbit env vars to DO
* Add content type to Cors headers in DO