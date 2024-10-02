# Budgeting app

Long story short, I used to track my incomes/expenses in Notion in a long list of tabular data.

I decided to add some graphs to have some better insights visualization but Notion does not support them natively without relying on third party solutions.
Since I neither wanted to transfer my data to an external service nor to use any app, the other solution that came into my mind (immediately discarded) was to create a dashboard on Excel.

I wanted a service that was always accessible and allowed me to synchronize data between devices.
What better opportunity to built it from scratch to study and improve both my full stack and the DevOps skills.

So here we are, you can access the app [here](https://budget.mattiacrispino.xyz/).

## Architecture

The app is built with React and the backend with Node.js, relies on a SQLite database (hope to migrate it soon to PostgreSQL) and the user authentication is done via JWT.

## Deployment

Everything is deployed to a VPS rented on [Hetzner](https://www.hetzner.com/cloud/), on which I’ve installed the SSL certificate via [Let’s Encrypt](https://letsencrypt.org/it/) along with NGINX that acts as reverse proxy to handle incoming requests to the server.

The services above are deployed as Docker containers togheter with the backend and frontend: all of these are in the same Docker network and managed by Docker Compose.

The CI/CD pipeline is built with GitHub Actions.

## Next steps

I'm planning to migrate the app's architecture in microservices, managing them via Kubernetes.
