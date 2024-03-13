module.exports = {

    getValueFromVariable( value ){
    
        if ( Array.isArray( value ) || !value.matchAll ){
            return value;
        }
    
        let values = [...value.matchAll("[${]{2}")];
    
        values.reverse();
    
        if ( values.length < 1 ){
            return value;
        }
    
        for (const v of values) {
            let startIndex = v.index;
            let endIndex = value.indexOf("}",startIndex);
            if ( endIndex == -1 ){
                return value;
            }
            let envVar = value.substring(startIndex+2,endIndex);
            let envValue = process.env[envVar];
            if ( !envValue ){
                continue;
            }
            value = value.replace( "${" + envVar + "}", envValue );
        }
    
        return value;
    
    }
}

