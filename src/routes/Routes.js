import { createProxyMiddleware } from "http-proxy-middleware";

export const ROUTES = [
  {
    url: "/student",
    auth: false,
    // creditCheck: false,
    // rateLimit: {
    //   windowMs: 15 * 60 * 1000,
    //   max: 5,
    // },
    proxy: {
      target: "http://localhost:4801",
      // changeOrigin: true,
      // pathRewrite: {
      //   [`^/student/`]: "",
      //   // [`^/student/`]: "",
      // },
    },
  },
  {
    url: "/vaccineDrive",
    auth: false,
    // creditCheck: false,
    // rateLimit: {
    //   windowMs: 15 * 60 * 1000,
    //   max: 5,
    // },
    proxy: {
      target: "http://localhost:4802",
      // changeOrigin: true,
      // pathRewrite: {
      //   [`^/vaccineDrive`]: "",
      // },
    },
  },
];

export const setupProxies = (app, routes) => {
  routes.forEach((r) => {
    app.use(r.url, createProxyMiddleware(r.proxy));
  });
};

// exports.setupProxies = setupProxies

// const express = require('express')

// const {ROUTES} = require("./routes");

// const {setupLogging} = require("./logging");
// const {setupProxies} = require("./proxy");

// const app = express()
// const port = 3000;

// setupLogging(app);
// setupProxies(app, ROUTES);

// app.listen(port, () => {
//     console.log(`Example app listening at http://localhost:${port}`)
// })

//npm install keycloak-connect express-session --save
//Now we create a separate file called auth.js in order to configure our authentication and apply the different rules to the routes of our configuration:

// const Keycloak = require('keycloak-connect');
// const session = require('express-session');

// const setupAuth = (app, routes) => {
//     var memoryStore = new session.MemoryStore();
//     var keycloak = new Keycloak({ store: memoryStore });

//     app.use(session({
//         secret:'<RANDOM GENERATED TOKEN>',
//         resave: false,
//         saveUninitialized: true,
//         store: memoryStore
//     }));

//     app.use(keycloak.middleware());

//     routes.forEach(r => {
//         if (r.auth) {
//             app.use(r.url, keycloak.protect(), function (req, res, next) {
//                 next();
//             });
//         }
//     });
// }

// exports.setupAuth = setupAuth
//Within our file we define a function called setupAuth, which takes the express app and our route configuration as input parameters. In order to enable the Keycloak integration we need to create a new memory store, setup the app to use sessions and activate the Keycloak middleware. Next, we can secure our endpoints by the following snippet:

// app.use(r.url, keycloak.protect(), function (req, res, next) {
//       next();
// });
//This code adds the Keycloak middleware (keycloak.protect()) on the specified URL. An additional callback function is added enabling us to add additional logging to the code. In this case we just call the next() function which tells Express to just continue processing the request.

//In order to make the Keycloak integration work, we also need an additional configuration file that contains some Keycloak specific information. Please refer to the official Keycloak documentation for more information on the setup. Below is an example keycloak.json configuration that was used within this project:

// {
//   "realm": "<REALM>",
//   "bearer-only": true,
//   "auth-server-url": "<AUTH_URL>",
//   "ssl-required": "external",
//   "resource": "<CLIENT>",
//   "confidential-port": 0
// }
//The next step is to include the authentication setup into our main server. We can do this by updating our server.js file with the following code:

// const express = require('express')

// const {ROUTES} = require("./routes");

// const {setupLogging} = require("./logging");
// const {setupProxies} = require("./proxy");
// const {setupAuth} = require("./auth");

// const app = express()
// const port = 3000;

// setupLogging(app);
// setupAuth(app, ROUTES);
// setupProxies(app, ROUTES);

// app.listen(port, () => {
//     console.log(`Example app listening at http://localhost:${port}`)
// })
// After restarting the server, you will notice that navigating to the premium url (http://localhost:3000/premium) will now result in an "Access Denied" page. However, the free url (http://localhost:3000/free) is still accessible 👍. You can use tools like Postman to add an access token to your requests in order to check if the Keycloak integration is working. In this case, Postman should also show the Google website when executing a GET request to the premium url.

// Rate limiting ⛔️
// The next phase of our implementation will add rate limiting to our gateway endpoints. In our example we will apply rate limiting to our free services. Reducing the throughput on certain services can have multiple advantages, such as a reduced and more controlled load on certain micro services, motivating users to go premium to remove throughput constraints,…

// Just as with the other features we have implemented, there is already an NPM library, called express-rate-limit (https://www.npmjs.com/package/express-rate-limit), available to integrate rate limiting into an existing Express server. It can be installed by executing the following command:

// npm install --save express-rate-limit
// Following the installation, we continue our developments by creating a separate ratelimit.js file with the following contents:

// const rateLimit = require("express-rate-limit");

// const setupRateLimit = (app, routes) => {
//     routes.forEach(r => {
//         if (r.rateLimit) {
//             app.use(r.url, rateLimit(r.rateLimit));
//         }
//     })
// }

// exports.setupRateLimit = setupRateLimit
// You will notice it again looks quite similar to the implementation of the other features. The above snippet loops through all routes and adds a rate limiting middleware if applicable for the given url. The settings provided to the rate limiting middleware can be found in the documentation of the module (https://www.npmjs.com/package/express-rate-limit) and is read directly from the configuration of the route in the routes.js file.

// If we look at the routes.js config, we can see that we did apply rate limiting for the free routes by specifying the following property:

// rateLimit: {
//     windowMs: 15 * 60 * 1000,
//     max: 5
// },
// These setting limit requests to the endpoint to a maximum of 5 requests each 15 minutes.

// Next we need to activate the rate limiting settings upon creation of the server. This can be done by extending the server.js file with the following contents:

// const express = require('express')

// const {ROUTES} = require("./routes");

// const {setupLogging} = require("./logging");
// const {setupRateLimit} = require("./ratelimit");
// const {setupProxies} = require("./proxy");
// const {setupAuth} = require("./auth");

// const app = express()
// const port = 3000;

// setupLogging(app);
// setupRateLimit(app, ROUTES);
// setupAuth(app, ROUTES);
// setupProxies(app, ROUTES);

// app.listen(port, () => {
//     console.log(`Example app listening at http://localhost:${port}`)
// })
// So now let's test our solution. Restart your server and go to the free endpoint at http://localhost:3000/free. Nothing has changed, right? Now refresh the page a couple of times. After refreshing about 5 times, you will see an error message: "Too many requests, please try again". We have now successfully limited the throughput to our services by applying rate limiting.

// Credit Check 💰
// The last thing we want to add is a credit check for requests to the premium endpoint. If the user does not have sufficient credits in his/her account to execute the request, it should be blocked.

// In this post, however, we will create a more generic implementation of the credit check example. The goal of this chapter is to create any type of middleware where you want to do additional checks before redirecting or blocking the requests.

// As you may have noticed during previous paragraphs, we've always made use of an Express middleware in order to combine them in a chain of request evaluation/execution. Express allows us to create a custom middleware and add it to the validation chain. Each middleware is defined as a function:

// function(request, response, next) {
//     // Add custom code here
// }
// In the middleware function you have access to the request and response object and to a function called next. During the execution of the middleware, you have several choices:

// End the processing of the request by sending a response to the client through the response object, for example:
// res.status(500).send({error});
// Finish the middleware and continue to the next middleware in the chain. This is where the next() function comes in. It tells Express that your middleware did not encounter any errors and it can continue the evaluation of the request through the next middleware.
// So now let's put this into practice. In our example we want to do a credit check for each incoming request. We start by creating a function that will execute the actual credit check in a file called creditcheck.js.

// const checkCredit = (request) => {
//     return new Promise((resolve, reject) => {
//            // Custom code here
//            if (ok) {
//               resolve();
//            } else {
//               reject('No credits');
//            }
//     })
// }
// In the example above we have left out the actual code implementation of the credit check as that this can replaced by any custom code where you want to do additional checks based on the request object. However, to test the code, we could write some code that will result in a negative credit check with a delay of 500ms, simulating the execution of an additional request:

// const checkCredit = (req) => {
//     return new Promise((resolve, reject) => {
//         console.log("Checking credit with token", req.headers["authorization"]);
//         setTimeout(() => {
//             reject('No sufficient credits');
//         }, 500);
//     })
// }
// As you can see in the code above, we will reject the promise, which represents an error or negative credit balance of the user. This code can easily be replaced by executing any additional request to another micro service that actually returns the amount of credits.

// Our next step is to add the creditCheck function as a middleware in order to process our incoming requests:

// const checkCredit = (req) => {
//     return new Promise((resolve, reject) => {
//         console.log("Checking credit with token", req.headers["authorization"]);
//         setTimeout(() => {
//             reject('No sufficient credits');
//         }, 500);
//     })
// }

// const setupCreditCheck = (app, routes) => {
//     routes.forEach(r => {
//         if (r.creditCheck) {
//             app.use(r.url, function(req, res, next) {
//                 checkCredit(req).then(() => {
//                     next();
//                 }).catch((error) => {
//                     res.status(402).send({error});
//                 })
//             });
//         }
//     })
// }

// exports.setupCreditCheck = setupCreditCheck
// The code above introduces a new middleware for each requests that should execute the credit check. Based on its execution requests will either be redirected or blocked. The actual code of the middleware is contained in the following snippet:

// function(req, res, next) {
//    checkCredit(req).then(() => {
//       next();
//     }).catch((error) => {
//       res.status(402).send({error});
//     })
// });
// In this code we execute the creditCheck function and wait for its result. If it resolves correctly, we notify Express that the middleware has been executed successfully by calling the next() function. If the credit check was rejected, we stop the processing of the request and send a response back to the client.

// The very last step in our implementation is to add the credit check configuration to the startup script of the server, resulting in our final server.js file:

// const express = require('express')

// const {ROUTES} = require("./routes");

// const {setupLogging} = require("./logging");
// const {setupRateLimit} = require("./ratelimit");
// const {setupCreditCheck} = require("./creditcheck");
// const {setupProxies} = require("./proxy");
// const {setupAuth} = require("./auth");

// const app = express()
// const port = 3000;

// setupLogging(app);
// setupRateLimit(app, ROUTES);
// setupAuth(app, ROUTES);
// setupCreditCheck(app, ROUTES);
// setupProxies(app, ROUTES);

// app.listen(port, () => {
//     console.log(`Example app listening at http://localhost:${port}`)
// })
// The only thing left to do is to restart the server and the credit check will be applied to relevant routes in your routes.js configuration. You can easily test the credit check by enabling for your free routes as well. If you restart the server and navigate to the free url (http://localhost:3000/free), you will receive a message that you don't have sufficient credits 👍.

// Keep in mind that we have also applied rate limiting to this route, so you may be too quick and have to wait for 15 minutes or disable the rate limiting all together.

// All done! 👍

// Great job! We have created our custom API gateway implementation. You can also find the full code on Github (https://github.com/JanssenBrm/api-gateway). I hope this post gave you a better insight on how to use a middleware in Express and the inspiration to add even more useful features to your API gateway. Keep coding!

// Api Gateway
// Nodejs
// Express
// Middleware
// Marketplaces
// 396

// 5
