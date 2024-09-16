# 🧐 DailySAT API

Overview: The DailySat API enables the backend of the web-platform DailySat which is written in ReactJS and TypeScript using ViteJS buildpack.

# 💻 Technologies used:

- ### Drizzle ORM
Drizzle acts as an ORM but also a query builder which brings mid-level abstraction from SQL code, meaning it is much more performant. The only issue with this setup is the developers are expected to have knowledge within SQL which is a fair trade in the DailySat developers opinons. Reference this video for more information: [YouTube Video](https://www.youtube.com/watch?v=b8W4bupOmxw)

- ### NodeJS with TSC
NodeJS is a runtime environment for the JavaScript programming language. Through NodeJS, you can employ JavaScript code to run server-side which allows all your code from the web-app to the API to be within the same programming language, lifting the developer experience. Additionally, it's asynchronous features and promises add to the value/appeal of NodeJS as a framework! TSC is the TypeScript complier for NodeJS as TypeScript is not natively supported!

- ### Redis Clusters
Redis is an in-memory database, meaning all the data is stored within the RAM of the server instanace. This means it is much faster than a tradional database like SQL or NoSQL options (MongoDB, Cassendra, etc) as it doesn't need to read off the disk. But, this also means it is prone to losing data whenever the server shuts down. This narrows the use-case for this technology to data that can be lost such as sessions or verification codes which is the use-case for it within this API. The clusters enables horizontal sharding which helps with scalability as that is a major concern when using session-based authentication. Refer to this video for more information: [YouTube Video](https://www.youtube.com/watch?v=2HvxYMdHYcY)

- ### Express Sessions
This technology abstracts the session-based authentication logic from the developer which leads to a better developer experience. Additioanlly, it provides industry best practices in-terms of security and scalablilty.

- ### Swagger
This is used to provide API documentation very seamlessly

# 🧱 API architecture:

This API abstracts it's logic into 3 main folders:

- #### Controllers
This has all the business logic such as db queries for your API endpoints

- #### Routes
This has all the endpoints for a speific type of logic such as authentication 

- #### Middleware
This includes code that will be run before any other logic within an endpoint so it is good for pre-processing requests. Beneificial within scenrios such as checking if a user is authenticated or not!

# 📝 Endpoint Docs:

To find out the diffrent endpoints + their intended use-cases, please navigate to the route `/api-docs`
