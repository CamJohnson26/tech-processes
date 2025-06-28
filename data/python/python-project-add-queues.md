# Adding queues to a Python program
* Add the background job template
* Add the rabbit mq template
* Install aio-pika and pika
* Update env vars and combine with existing file
* Add setup rabbit mq to the background job
* Add the background job to the cli
* Create queues/queue_names.py file with queue names to prevent a circular import
* Create queues/workers and move the my_queues there
* Move background_jobs, rabbitmq to the queues folder
* Update the my queue file with a custom name
* Add a retry call to the CLI
* Validate sending and recieving messages.