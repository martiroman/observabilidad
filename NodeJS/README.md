
## Observabilidad en NodeJS
La adopción de medidas de observabilidad puede proporcionar múltiples ventajas incluyendo una mejor capacidad para resolver problemas y una disminución en el tiempo de respuesta frente a incidentes. Es clave para comprender los problemas en los sistemas distribuidos.

En este ejemplo veremos cómo recopilar información en una aplicación NodeJS para cada uno de los pilares de la observabilidad:

1. Métricas: datos cuantitativos sobre el rendimiento del sistema 
2. Logs: eventos y acciones que ocurren en el sistema
3. Trazas: información sobre el recorrido de los requests


### 1. Métricas 

#### Prometheus: Librería Prom-Client

Las librerías de cliente de [Prometheus](https://prometheus.io/) permiten instrumentar en nuestro código las difiniciones y exposición de las métricas para distintos lenguajes de programación.

Instalar librerias "prom-client" para NodeJS 
https://prometheus.io/docs/instrumenting/clientlibs/

    > npm install prom-client --save

Declarar el uso de la librería en la aplicación

    const prom = require('prom-client');

Incluir las métricas por defecto para NodeJS.
Podremos obtener datos sobre:
* NodeJS Version
* Active requests
* Active Handles
* % CPU usage
* Event loop lag
* Memory: External memory, Process memory, Heap space size,

Incluir las siguientes líneas, podemos indicar un prefijo para indentificar las métricas en la herramienta de observabilidad:

    const collectDefaultMetrics = prom.collectDefaultMetrics;

    collectDefaultMetrics({ prefix: 'miapp' });

Exponer las métricas

    app.get('/metrics', function (request, result) {
        res.set('Content-Type', prom.register.contentType);
        prom.register.metrics().then(data => result.send(data));

    });

Counters

Definir una métrica custom de tipo contador:

    const hitscounter = new prom.Counter({
        name: 'miapp_number_of_hits_total',
        help: 'The number of hits, total'
    });


#### Dynatrace: Cómo colectar métricas de Prometheus

El operador de Kubernetes incluye una función para colectar métricas de Prometheus en Dynatrace. De esta manera podremos construir SLO, dashboards y detectar anomalías con los datos obtenidos.

Para habilitar esta función simplemente deberemos incluir las anotaciones en nuestros pods. En este ejemplo utilizamos una anotación para filtrar algunas métricas específicas que nos interesa ingestar. 

    annotations:
        metrics.dynatrace.com/scrape: 'true'
        metrics.dynatrace.com/path: '/metrics'
        metrics.dynatrace.com/port: '3000'
        metrics.dynatrace.com/secure: 'false'
        metrics.dynatrace.com/filter: |
          {
            "mode": "include",
            "names": [
                "miapp_process_heap_bytes",
                "miapp_number_of_hits_total"
                ]
          }

##Próximos pasos:
### 2. Logs
### 3. Metricas



#### Construir imagen:

    docker build -t miapp:latest .

    docker login -u [nombre_usuario]

    docker tag miapp [nombre_usuario]/miapp

    docker push [nombre_usuario]/miapp
