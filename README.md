# ProjectManager
Project Manager is a web based application that allows a group or organization to create projects
and then have tickets for bugs, features, suggestions, etc, that are automatically assigned to user groups
to handle those tickets.

## For developement
```
npm run dev
```
This will provide a hot reloaded web server on localhost:8080

## For production
```
npm run build
```
```
npm start
```
This will build the files into the dist folder and then run the server.

## Additional information
This application requires a MongoDB backend, provide the connect statement to that in a dotenv file as "DB_CONNECT".

You also must provide a secret token for handling JWTs. Provide this as "TOKEN_SECRET" in the dotenv file.

## API Reference

### User API

#### Create a new user
Permission: admin / Method: POST
```
/api/user
```
##### Body:
```json
{
	"name": "String",
	"email": "String, must be email",
	"password": "String, must be atleast 8 characters",
	"isAdmin": false
}
```

#### Delete an existing user
Permission: admin / Method: DELETE
```
/api/user/:userID
```

#### Edit existing user
Permission: admin / Method: PUT
```
/api/user/:userID
```
##### Body:
```json
{
	"name": "String, not required",
	"email": "String, must be email, not required",
	"isAdmin": false
}
```

#### Login - Aquire JWT for auth
Permission: N/A / Method: POST
```
/api/user/login
```
##### Body:
```json
{
	"email": "String, must be an email",
	"password": "String, must be atleast 8 characters"
}
```

#### Assign a project role to a user
Permission: assignProjectRole / Method: POST
```
/api/user/role/:userID/:projectID
```
##### Body:
```json
{
	"role": "String"
}
```

#### Assign a project role to a user
Permission: removeProjectRole / Method: DELETE
```
/api/user/role/:userID/:projectID
```
##### Body:
```json
{
	"role": "String"
}
```

### Project API

#### Create a new project
Permission: admin / Method: POST
```
/api/project
```
##### Body:
```json
{
	"name": "String"
}
```

#### Get project names
Permission: N/A / Method: GET
```
/api/project
```

#### Delete a project
Permission: admin / Method: DELETE
```
/api/project/:projectID
```

#### Change project name
Permission: changeProjectName / Method: PUT
```
/api/project/:projectID
```
##### Body:
```json
{
	"name": "String"
}
```

### Ticket API

#### Create a new ticket
Permission: createTicket / Method: POST
```
/api/ticket/:projectID
```
##### Body:
```json
{
	"type": "String, must be 'bug' or 'suggestion'",
	"title": "String",
	"description": "String",
	"severity": "String, must be 'low', 'medium', 'high', or 'severe'"
}
```

#### Post a comment to a ticket
Permission: comment / Method: POST
```
/api/ticket/:projectID/:ticketID
```
##### Body:
```json
{
	"text": "String"
}
```

#### Edit an existing ticket
Permission: editTicket / Method: PUT
```
/api/ticket/:projectID/:ticketID
```
##### Body:
```json
{
	"type": "String, must be 'bug' or 'suggestion'",
	"title": "String",
	"description": "String",
	"severity": "String, must be 'low', 'medium', 'high', or 'severe'"
}
```

#### Delete a ticket
Permission: deleteTicket / Method: DELETE
```
/api/ticket/:projectID/:ticketID
```

#### Get all tickets in a project
Permission: getTicket / Method: GET
```
/api/ticket/:projectID
```

#### Get how many tickets of each severity exist
Permission: getStats / Method: GET
```
/api/ticket/severity/:projectID
```

#### Get how many tickets of each type exist
Permission: getStats / Method: GET
```
/api/ticket/type/:projectID
```