
# Creating a new table
* Don't get fancy, just do this manually in Datagrip
* Create an id column, type uuid, not null, with gen_random_uuid() (Datagrip will show an error)
* For timestamps, do `timestamp` and default to `now()`