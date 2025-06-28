
# Add a protected endpoint
* In auth 0, under your api, create a new permission for this action
* Create a role in auth 0 under Users > Roles, add the permission
* Assign the role to users
* Create the endpoint in the python api, and pass the permission as a string