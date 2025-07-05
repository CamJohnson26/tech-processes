
# Connecting Python to a database
* Create a new folder: my_project_db
* On mac, brew install openssl, brew install postgresql
* 
```shell
pip3 install psycopg2-binary
pip3 freeze > requirements.txt
```
* Create db_actions.py
```python
# MY_DB/db_actions.py
from dotenv import load_dotenv

import os

from MY_DB.queries.get_entity_query import get_entity_query

from psycopg2 import pool

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

connection_pool = pool.SimpleConnectionPool(
    1,      # Minimum number of connections
    10,     # Maximum number of connections
    DATABASE_URL
)


def get_entity_db():
    return get_entity_query(connection_pool)

```
* Create base test query
```python
# MY_DB/queries/get_entity_query.py
def get_entity_query(connection_pool):
    conn = None
    try:
        conn = connection_pool.getconn()
        cursor = conn.cursor()
        cursor.execute("""SELECT * FROM users;""")
        records = cursor.fetchall()
        cursor.close()
        if records is not None:
            print(f"Fetched {len(records)} records")
            return records
        else:
            print(f"Couldn't find")
            return None
    except Exception as e:
        print(e)
    finally:
        connection_pool.putconn(conn)

```
* Set DATABASE_URL connection string from services google sheet (Bookmark DB) in `.env` and `.env.sample`
* Add a protected route to call the database action
* Run `gunicorn --worker-tmp-dir /dev/shm api:app` with token from Auth0 test page, and verify can hit the endpoint
  * Note: I changed the test application to a SPA once, which breaks the test page token. You can just use a different application to get the token
* Add `DATABASE_URL` to Digital Ocean
* Add a route to frontend and verify fetching the data