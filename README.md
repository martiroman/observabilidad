express --view=jade ejemplo

    npm install
    npm install jsonwebtoken
    npm install mongoose
    npm install bcrypt

DEBUG=ejemplo:* npm start


### Logs
    > npm install winston


    const winston = require('winston');

    const logger = winston.createLogger({
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console(),
    ],
    });

    logger.info('Hello, Fluent Bit!');

### Construir imagen:

> docker build -t tiendapc:latest .

> docker login -u [nombre_usuario]

> docker tag tiendapc mnroman/tiendapc 

> docker push [nombre_usuario]/tiendapc

