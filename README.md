# oidc-express-server

This project was created to make it easier for developers to integrate their web server with an OIDC Compliant IAM. Furthermore, this server helps frontend developers such as Vue, React and others to use their proxy to access APIs protected by the Authorization Server OIDC.

```javascript
require('dotenv').config();
const server = require("../index");
const logger = require("../src/utils/logger");

// TODO Validate all env variables
const LISTEN_PORT = process.env.WEBSERVER_LISTEN_PORT || 3000
const APP_ROOT_PATH = process.env.WEBSERVER_APP_ROOT_PATH || "app";
const APP_CONTEXT_PATH = process.env.WEBSERVER_APP_CONTEXT_PATH || "";
const PUBLIC_PATHS = process.env.WEBSERVER_SECURITY_PUBLIC_PATHS;
const SECURITY_ENABLED = process.env.WEBSERVER_SECURITY_ENABLED || "false";
const OIDC_DISCOVERY_URL = process.env.WEBSERVER_SECURITY_OIDC_DISCOVERY_URL;
const OAUTH2_REDIRECT_URI = process.env.WEBSERVER_SECURITY_OAUTH2_REDIRECT_URI;
const OAUTH2_POST_LOGOUT_REDIRECT_URI = process.env.WEBSERVER_SECURITY_OAUTH2_POST_LOGOUT_REDIRECT_URI;
const OAUTH2_CLIENT_ID = process.env.WEBSERVER_SECURITY_OAUTH2_CLIENT_ID;
const OAUTH2_CLIENT_SECRET = process.env.WEBSERVER_SECURITY_OAUTH2_CLIENT_SECRET;
const PROTECTED_PATHS = process.env.WEBSERVER_SECURITY_PROTECTED_PATHS;

let options = {
    appRootPath: APP_ROOT_PATH,
    appContextPath: APP_CONTEXT_PATH,
    protectedPath: PROTECTED_PATHS,
    oidc:{
        enabled: (SECURITY_ENABLED === "true"),
        discoveryUrl: OIDC_DISCOVERY_URL,
        client_id: OAUTH2_CLIENT_ID,
        client_secret: OAUTH2_CLIENT_SECRET,
        redirect_uris: [ OAUTH2_REDIRECT_URI ],
        post_logout_redirect_uris: [ OAUTH2_POST_LOGOUT_REDIRECT_URI ],
    },
    proxy:{
        "/api":{
            target: "${PROXY_API_HOST}",
            options:{},
            authorization: true //enables header bearer token
        }
    }
}

server(options, (app)=>{
    app.listen(LISTEN_PORT, () => {
        logger.info(`Server is running on port ${LISTEN_PORT}`);
    });
});
```