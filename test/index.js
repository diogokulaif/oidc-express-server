require('dotenv').config();

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
    listenPort: LISTEN_PORT,
    appRootPath: APP_ROOT_PATH,
    appContextPath: APP_CONTEXT_PATH,
    oidc:{
        enabled: (SECURITY_ENABLED === "true"),
        discoveryUrl: OIDC_DISCOVERY_URL,
        client_id: OAUTH2_CLIENT_ID,
        client_secret: OAUTH2_CLIENT_SECRET,
        redirect_uris: [ OAUTH2_REDIRECT_URI ],
        post_logout_redirect_uris: [ OAUTH2_POST_LOGOUT_REDIRECT_URI ],
        userinfo_endpoint: criiptoIssuer.userinfo_endpoint,
        introspection_endpoint: criiptoIssuer.introspection_endpoint,
        logout_endpoint: criiptoIssuer.end_session_endpoint,
        token_endpoint: criiptoIssuer.token_endpoint
    },
    proxy:{

    }
}