# Add a python service to the healthchecks deploy
* Make sure your Python project has `initiate_background_jobs`
* Login to http://24.199.116.58:8000/ (Password in bitwarden)
* Click "Add Check"
* Set it up and download the ping url
* In python, add a HEALTHCHECK_URL env var
- Create background jobs folder
```bash
mkdir -p YOUR_PROJECT/background_jobs
touch YOUR_PROJECT/background_jobs/__init__.py
```
- Update `__init__.py`:

```python
"""This package contains background jobs that run periodically.

"""
```
- Create `your_project/background_jobs/healthcheck.py` with the following content:
```python
"""This module contains the healthcheck functionality.

It provides a mechanism for pinging an external healthcheck endpoint
at regular intervals to verify that the application is still running.
"""

import asyncio
import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Default to a no-op URL if not specified
HEALTHCHECK_URL = os.environ.get("HEALTHCHECK_URL", "https://example.com/healthcheck")

async def healthcheck_ping():
    """Ping the healthcheck endpoint.

    This function will be called periodically to ping the healthcheck endpoint
    to verify that the application is still running.
    """
    try:
        response = requests.get(HEALTHCHECK_URL, timeout=10)
        print(f" [x] Healthcheck ping sent to {HEALTHCHECK_URL}, status: {response.status_code}")
        return True
    except Exception as e:
        print(f" [!] Error pinging healthcheck endpoint: {e}")
        return False

async def schedule_periodic_healthcheck(interval_seconds=900):  # 15 minutes = 900 seconds
    """Schedule periodic healthcheck pings.

    This function will schedule periodic healthcheck pings at the specified interval.
    """
    while True:
        await healthcheck_ping()
        await asyncio.sleep(interval_seconds)

def get_healthcheck_task():
    """Get the periodic healthcheck task.

    This function will return a coroutine that schedules periodic healthcheck pings.
    """
    return schedule_periodic_healthcheck()
```
- Update initiate_background_tasks() and add
```python
import asyncio
from threading import Thread

from your_project.background_jobs.healthcheck import get_healthcheck_task

def initiate_background_tasks():
    """Initiate the background tasks."""
    try:
        # Create a new event loop
        loop = asyncio.new_event_loop()
        
        # Start the event loop in a background thread
        start_background_thread(loop)
        
        # Schedule the periodic healthcheck task
        asyncio.run_coroutine_threadsafe(get_healthcheck_task(), loop)
        print(" [*] Scheduled periodic healthcheck task (every 15 minutes)")
    except Exception as e:
        print("Error:", e)

def start_background_thread(loop: asyncio.AbstractEventLoop):
    """Start the event loop in a background thread."""
    t = Thread(target=loop.run_forever, daemon=True)
    t.start()
```
