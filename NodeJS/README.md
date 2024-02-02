
## Observabilidad en NodeJS
La adopción de observabilidad en software proporciona múltiples ventajas incluyendo una mejor capacidad para resolver problemas y una disminución en el tiempo de respuesta frente a incidentes en producción. También es fundamental su implementación en pipelines de CI/CD dado su creciente complejidad.

En este ejemplo veremos cómo recopilar información en una aplicación NodeJS para cada uno de los pilares de la observabilidad utilizando herramientas Open Source:

1. Métricas con Prometheus: datos cuantitativos sobre el rendimiento del sistema 
2. Trazas con OpenTelemetry: información sobre el recorrido de los requests
2. Logs con FluentBit: eventos y acciones que ocurren en el sistema



### 1. Métricas 

#### 1.1 Prometheus: Librería Prom-Client

Las librerías de cliente de [Prometheus](https://prometheus.io/) permiten instrumentar en nuestro código las difiniciones y exposición de las métricas para distintos lenguajes de programación.

Instalar librerias "prom-client" para NodeJS en nuestro proyecto NodeJS
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



La librería prom-client permite definir métricas custom. 
Ejemplo de una métrica Counter:

    const hitscounter = new prom.Counter({
        name: 'miapp_number_of_hits_total',
        help: 'The number of hits, total'
    });


#### 1.2 Dynatrace: Cómo colectar métricas de Prometheus
https://docs.dynatrace.com/docs/shortlink/monitor-prometheus-metrics

El operador de Kubernetes incluye una función para colectar métricas de Prometheus en Dynatrace. De esta manera podremos construir SLO, dashboards y detectar anomalías con los datos obtenidos a través de las métricas de Prometheus.

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
                "miapp_number_of_hits_total"
                ]
          }

En Dynatrace, ir a la página de configuración del Kubernetes cluster y habilitar:

    Monitor annotated Prometheus exporters



### 2. Trazas

Alternativas con Opentelemetry:

#### 2.1 Instrumentación de Opentelemetry

https://opentelemetry.io/

Instalar la librería Opentelemetry para NodeJS

    npm install @opentelemetry/sdk-node \
    @opentelemetry/api \
    @opentelemetry/auto-instrumentations-node \
    @opentelemetry/sdk-metrics \
    @opentelemetry/sdk-trace-node


La configuración de la instrumentación debe ejecutarse antes del código de la aplicación.
Package.json:
    "start": "node -r ./otel-tracing.js ./bin/www"

Crear un archivo otel-tracing.js

    // Require dependencies
    const { NodeSDK } = require('@opentelemetry/sdk-node');
    const { ConsoleSpanExporter } = require('@opentelemetry/sdk-trace-node');
    const {
    getNodeAutoInstrumentations,
    } = require('@opentelemetry/auto-instrumentations-node');

    const sdk = new NodeSDK({
    traceExporter: new ConsoleSpanExporter(),
    instrumentations: [getNodeAutoInstrumentations()],
    });

    sdk.start();

#### 2.2 K8s OTEL Operator
https://opentelemetry.io/docs/kubernetes/operator/

No es necesario instalar librerías.

Crear el recurso otel-instrumentation.yaml en el namespace. 

    apiVersion: opentelemetry.io/v1alpha1
    kind: Instrumentation
    metadata:
    name: pc-instrumentation
    spec:
    exporter:
        endpoint: http://otel-collector.opentelemetry-operator-system:4317
    propagators:
        - tracecontext
        - baggage
        - b3
    sampler:
        type: parentbased_traceidratio
        argument: "1" 

Agregar la anotación en el pod:

    annotations:
            instrumentation.opentelemetry.io/inject-nodejs: "true"



#### 2.3 Dynatrace: Colectar trazas

Si tenemos OneAgent simplemente habilitamos el feature de Opentelemetry para NodeJS:
    Settings -> Preference -> OneAgent features: OpenTelemetry (Node.js)

Una alternativa es enviar las trazas a un colector OTEL y utilizar el exporter para ingestarlas

exporters:
  otlphttp:
    endpoint: "https://<YOUR-ENVIRONMENT-STRING>.live.dynatrace.com/api/v2/otlp"
    headers:
      Authorization: "Api-Token <YOUR-DYNATRACE-API-KEY>" 


### 3. Logs

[FluentBit](https://docs.fluentbit.io/) provee plugins para obtener información de distintas fuentes, parsar, filtrar y enviar a diversos destinos.
Funciona como un pipeline con los siguientes pasos:

    input 
        --> parser 
            --> filter 
                --> buffer 
                    --> routing
                        --> output 1
                        ...
                        --> output N

#### 3.1 Input

    [INPUT]
        Name              tail
        Tag               kube.*
        Path              /var/log/containers/tiendapc*.log
        Parser            docker
        DB                /run/fluent-bit/flb_kube.db
        Mem_Buf_Limit     5MB
        Buffer_Chunk_size 32k
        Buffer_Max_size   32k


#### 3.2 Filter

    [FILTER]
        Name           kubernetes
        Match          tiendapc.*
        Kube_URL       https://kubernetes.default.svc:443
        Merge_Log On
        K8S-Logging.Exclude Off
        K8S-Logging.Parser Off


#### 3.3 Output
El plugin "http output" de FluentBit nos permite enviar los logs al endpoint para la ingesta de Dynatrace:
https://docs.dynatrace.com/docs/shortlink/lma-stream-logs-with-fluent-bit

    [OUTPUT]
        name  http
        match *
        header Content-Type application/json; charset=utf-8
        header Authorization Api-Token {your-API-token-here}
        allow_duplicated_headers false
        host  {your-environment-id}.live.dynatrace.com
        Port  443
        URI   /api/v2/logs/ingest
        Format json
        json_date_format iso8601
        json_date_key timestamp
        tls On
        tls.verify Off