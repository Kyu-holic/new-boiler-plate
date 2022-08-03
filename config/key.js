if(process.env.NODE_ENV === 'production'){
    modules.exports = require("./prod")
} else {
    module.exports = require("./dev")
}