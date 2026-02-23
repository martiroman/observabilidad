const prom = require('prom-client');

const collectDefaultMetrics = prom.collectDefaultMetrics;
collectDefaultMetrics({ prefix: 'tiendapc_' });


const getMetrics = async function (req, res, next) {
    res.set('Content-Type', prom.register.contentType);
    //res.end(prom.register.metrics());
    prom.register.metrics().then(data => res.send(data));
 
};

module.exports = {
    getMetrics
}  