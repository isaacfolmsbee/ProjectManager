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
