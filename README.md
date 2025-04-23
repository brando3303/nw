# nw
Next Star Football Full Stack Website

Includes frontend, backend, and data synchronization application (originally coined Asynchronous Data Retreival). 

# Front-end
React.js, Postgres.js

Relies on backend server to be operational. Displays the players in the database and player pages when activated. Utilizes React-Router.js for routing and back button functionality.

run:
```
npm run start

```
to run the program locally, hosted on port num 3000.

# Back-end
Express.js

to test the backend locally run: ``` npm run start ```

fetches player list and player data, performs CORS checking. see nw-backend/api/index.js for allowed origins.

