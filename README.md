# Observabilidad y Machine Learning

## Consideraciones iniciales

   **Observabilidad** es la capacidad de medir el estado actual de un sistema basándose en los datos que este genera (logs, trazas, métricas, eventos)


   **Machine learning** es una rama de la inteligencia artificial cuyo principal objetivo es tomar decisiones o realizar predicciones basadas en datos.

Nuestro objetivo será obtener datos de alguna forma y agregarlos de una manera que nos permita hacer una evaluación del estado actual de nuestros sistemas e indentificar patrones, tendencias y anomalías con el fin de anticiparnos a problemas que afecten el rendimiento del mismo.

Por ejemplo, entender el comportamiento del consumo de CPU de un servidor a lo largo del tiempo o proyectar la ocupación de una LUN de un storage.

Existen herramientas OpenSource para observabilidad muy populares como Prometheus, Grafana, Jaeger que ofrecen gran flexibilidad y customización.
Por otro lado, python es el lenguaje por excelencia para ML. Es un lenguaje eficiente, fácil de aprender y multiplataforma, entre otras características.

Prometheus: https://prometheus.io/<br>Grafana: https://grafana.com/<br>Python: https://www.python.org/

---
## 1. Adquisición de Datos
Los datos son fundamentales en el aprendizaje automático ya que los algoritmos aprenden patrones a partir de ellos.

Con Prometheus tendremos acceso a métricas en formato timeseries, identificadas por nombre y etiquetas.

Tipos de métricas que podemos encontrar:
* Counter: Métrica acumulativa que representa un contador, es decir que solo puede incrementar o reiniciarse a cero.
* Gauge: Representa un solo valor numérico que a diferencia del anterior puede aumentar o disminuir.
* Histogram: Tiene la función de muestrear las observaciones y las cuentas en categorías configurables, además de ofrecer una suma de la totalidad de los valores que haya observado.
* Summary: Similar a un histograma, un resumen de muestras.
    
Doc: https://prometheus.io/docs/concepts/metric_types/.



#### Cómo obtener métricas de Prometheus

Utilizaremos la librería de Python "prometheus-api-client" https://pypi.org/project/prometheus-api-client/

    > pip install prometheus-api-client

En este ejemplo consultamos el uso de CPU del container "argocd-server"

    from prometheus_api_client import PrometheusConnect,  MetricSnapshotDataFrame, MetricRangeDataFrame
    import datetime as dt
    
    promConn = PrometheusConnect(url = "http://prometheus", disable_ssl=True)

    labels = {'container': 'argocd-server'}

    metric_data = promConn.get_metric_range_data(
        'node_namespace_pod_container:container_cpu_usage_seconds_total:sum_irate',
        label_config=labels,
        start_time=(dt.datetime.now() - dt.timedelta(days=14)),
        end_time=dt.datetime.now(),
    )

    df = MetricRangeDataFrame(metric_data)
    df.head()

---
## 2. Preparar los datos - Preprocesamiento y exploracion

Ya tenemos nuestros datos en un dataframe, si lo imprimimos podremos observar varios campos que no son de nuestro interés (los labels de la métrica en Prometheus) y podremos prescindir de ellos.
Además deberemos tomar una desición acerca del muestreo que utilizaremos. Si usamos la configuración de Prometheus por defecto, tendremos un punto métrico por minuto. La cantidad de datos que emplearemos dependerá de la capacidad de procesamiento de nuestra infraestructura (ya sea una notebook o un servidor). Por lo tanto, será necesario determinar si es necesario realizar un "re muestreo" de nuestros datos y cómo se llevará a cabo la agregación.
Por ejemplo, una estrategia podría ser agrupar los datos en intervalos de 30 minutos y calcular el promedio correspondiente.

Una vez que el dataframe está preparado, procederemos a dividir los datos en dos conjuntos:

* Conjunto de Entrenamiento (Train): Este conjunto de datos reales es utilizado para entrenar el modelo, permitiendo que este aprenda de ellos.
* Conjunto de Pruebas (Test): Este subconjunto de datos se emplea para evaluar el ajuste final del modelo utilizando los datos del conjunto de entrenamiento

Una proporción efectiva para comenzar es asignar el 80% de los datos al conjunto de entrenamiento y reservar el 20% restante para pruebas.

#### Cómo preparamos los datos

Nos valdremos de las funciones del Dataframe de la librería Pandas de Python

    # Seleccionamos las columnas que necesitamos para el analisis
    df = df_prom[['value']].copy()
    df = df.set_index(df_prom.index)

    # Hacemos un re-muestreo de los datos. Promedio por hora
    df = df.resample('H').mean()

    # Dividimos nuestros datos para entrenar y prueba
    df_train, df_test = split_df_data(df)

    # ver la funcion split_df_data en la notebook
---
## 3. El modelo ARIMA

El próximo paso es seleccionar un modelo estadístico que se ajuste a nuestra necesidad. 

ARIMA (Autoregressive Integrated Moving Average) es un modelo estadístico utilizado para analizar y predecir series temporales. Puede ser ajustado a datos históricos para hacer predicciones a futuro, lo que lo hace valioso en pronósticos económicos, análisis de ventas, predicción de precios de acciones, entre otros campos.

Utilizaremos SARIMAX, una extensión del modelo que considera factores externos o variables exógenas.

Doc: https://www.statsmodels.org/dev/generated/statsmodels.tsa.statespace.sarimax.SARIMAX.html


#### Cómo utilizar el modelo ARIMA

    from statsmodels.tsa.statespace.sarimax import SARIMAX

    model = SARIMAX(df['Valor'], order=(1, 1, 1), seasonal_order=(1, 1, 1, 12))  # Ajustar los órdenes según la serie temporal

    results = model.fit()


---
## 4. Visualización de los datos
Utilizaremos la librería matplotlib de python para graficar los datos históricos, predicciones e intervalos de confianza.

    # Datos históricos
    plt.figure(figsize=(10, 6))
    plt.plot(df, label='Datos Históricos')

    # Pronóstico
    plt.plot(forecast, color='red', label='Pronóstico')

    # Intervalo de confianza
    plt.fill_between(
        confidence_intervals.index, 
        confidence_intervals['lower value'],  # Límite inferior del intervalo
        confidence_intervals['upper value'],  # Límite superior del intervalo
        color='pink', alpha=0.3, label='Intervalo de Confianza'
    )


    plt.xlabel('Fecha')
    plt.ylabel(query)
    plt.title(labels)
    plt.legend()
    plt.grid(True)
    plt.show()

---
## 5. Próximos pasos

 - Evaluación del modelo
 - Almacenado de datos obtenidos
 - Visualización en Grafana