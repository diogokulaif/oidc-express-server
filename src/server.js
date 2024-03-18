const express = require("express");
const expressSesssion = require('express-session');
const cookieParser = require('cookie-parser');
const morganMiddleware = require("./middlewares/morgan.middleware");
const { Issuer, Strategy, TokenSet } = require('openid-client');
const passport = require('passport');

// The morgan middleware does not need this.
// This is for a manual log
const logger = require("./utils/logger");
const app = express();
const proxyMiddleware = require("./middlewares/proxy-middleware");

// Add the morgan middleware
app.use(morganMiddleware);
app.disable('etag');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

class MyStrategy extends Strategy{
    constructor(){
        super();
    }
}

module.exports = (options, next)=>{

    if ( options.oidc.enabled ){
    
        Issuer.discover( options.oidc.discoveryUrl ).then(async (criiptoIssuer) => {
            
            options.oidc.userinfo_endpoint = criiptoIssuer.userinfo_endpoint,
            options.oidc.introspection_endpoint = criiptoIssuer.introspection_endpoint,
            options.oidc.logout_endpoint = criiptoIssuer.end_session_endpoint,
            options.oidc.token_endpoint = criiptoIssuer.token_endpoint

            var client = new criiptoIssuer.Client(options.oidc);
    
            // TODO CHANGE TO REDIS SESSION
            app.use(expressSesssion({
                secret: 'keyboard cat',
                resave: false,
                saveUninitialized: true
            }));
    
            app.use(passport.initialize());
            app.use(passport.session());
    
            passport.use('oidc', new Strategy({ client }, (tokenSet, userinfo, done) => {
                return done(null, tokenSet);
            }));
          
            // handles serialization and deserialization of authenticated user
            passport.serializeUser(function(user, done) {
                logger.debug("Serializing user");
                logger.debug( user );
                done(null, user);
            });
    
            passport.deserializeUser(function(user, done) {
                logger.debug("Deserializing user");
                logger.debug( user );
                done(null, user);
            });
    
            // authentication callback
            app.get('/public/login/callback', (req, res, next) => {
                passport.authenticate('oidc', { successRedirect: options.appContextPath, failureRedirect: '/error' })(req, res, next);
            });
    
            // TODO IMPLEMENT MULTIPLE PROTECTED PATHS
            app.use(options.protectedPath, async ( req, res, next )=>{
                if ( !req.isAuthenticated() ){
                    if ( req.headers.accept && req.headers.accept.indexOf('json') > -1 ){
                        res.status(401).send({active: false});
                    }else{
                        passport.authenticate( 'oidc' )(req, res, next);
                    }
                }else{
                    let tokenSet = new TokenSet(req.user)
                    if ( tokenSet.expired() ){
                        res.status(401).send({active: false})
                    }else{
                        logger.debug("################################################");
                        return next();
                    }
                }
            });
    
            // TODO IMPLEMENT MULTIPLE PUBLIC PATHS
    
            app.use( options.appContextPath, express.static( options.appRootPath ) );
    
            app.get("/api/healthcheck", (req, res) => {
                logger.info("Checking the API status: Everything is OK");
                res.status(200).send({
                    status: "UP",
                    message: "The API is up and running!"
                });
            });
    
            // USED TO HANDLE HTTP STATUS ERROR
            /*app.use((req, res, next) => {
                logger.error( "####### ERROR MIDDLEWARE ##############" );
                if ( req.statusCode? >= 400 ){
                    res.status(500).send('Something broke!')
                }
            });*/
    
            /*app.listen(options.listenPort, () => {
                logger.info(`Server is running on port ${options.listenPort}`);
            });*/
    
            if ( options.proxy ){
                proxyMiddleware.loadProxies(app, options.proxy );
            }

            next(app);

        }).catch((error)=>{
            logger.error( error );
        })
    }else{
        next(app);
    }
}