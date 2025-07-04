
# Creating a new table
* Don't get fancy, just do this manually in Datagrip
* Give tables the singular version of their entity
* Create an id column, type uuid, not null, with gen_random_uuid() (Datagrip will show an error)
* For timestamps, do `timestamp` and default to `now()`
* Add any other columns
* Save the table
* Edit table and fill out any default data
* TODO: The id is not creating a primary key, add that to this runbook