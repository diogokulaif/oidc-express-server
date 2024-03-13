const { createProxyMiddleware } = require('http-proxy-middleware');
const proxyEntries = require("../../proxy-config");
const utils = require("../utils/utils")

let proxyKeys = Object.keys(proxyEntries);

module.exports = {

    loadProxies(app, options){
        // Load proxy entries
        for (const key of proxyKeys) {
            let value = proxyEntries[key];
            if ( value.target ){
                let target = utils.getValueFromVariable(value.target);
                app.use(key, createProxyMiddleware({
                    target,
                    changeOrigin: true,
                    onProxyReq: (proxyReq, req, res)=>{
                        if ( options.securityEnabled ){
                            if ( req.isAuthenticated() && req.user && req.user.access_token ){
                                proxyReq.setHeader("authorization", `Bearer ${req.user.access_token}`);
                            }
                        }
                    }
                }));
            }
        }
    }

}
