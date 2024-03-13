const { createProxyMiddleware } = require('http-proxy-middleware');
const utils = require("../utils/utils")

module.exports = {
    
    loadProxies(app, proxyEntries){
        let proxyKeys = Object.keys(proxyEntries);
        // Load proxy entries
        for (const key of proxyKeys) {
            let value = proxyEntries[key];
            if ( value.target ){
                let target = utils.getValueFromVariable(value.target);
                app.use(key, createProxyMiddleware({
                    target,
                    changeOrigin: true,
                    onProxyReq: (proxyReq, req, res)=>{
                        if ( value.authorization ){
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
