**Task Management REST API**
This is a back-end code repository.
This is a full featured Task Management REST API back-end built with Node.js and MongoDB. Features include:

Pagination and filtering of server responses to avoid slow page load times.
Full CRUD features for User and Task instances.
Hash encryption of passwords and access management with JWT tokens.
Restricted user access to CRUD operations based on JWT tokens.

Setup instruction:

To use this code you will require an account with SendGrid. Sign-up is free and no credit card is required to access a free-tier API Key.
Node.js version 12+ and npm must be installed on your machine. In terminal type the following commands:

https://github.com/rahman113/TaskManagerAPI.git
cd task-manger-api
sudo npm install
mkdir config
cd config
touch dev.env
vim dev.env
Insert the following lines in dev.env, replacing all <content> with your own information:

PORT=<port number>
MONGODB_URL=<mongodb connection string>
SENDGRID_API_KEY=<api key>
JWT_SECRET=<unique key of your choice to generate JSON web tokens>


To run the web server return to the root of the repository and type:

npm run dev
