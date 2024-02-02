pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDENTIALS = credentials('docker-hub-credentials-id')
        IMAGE_NAME = 'tiendapc'
        APP_DIR = 'NodeJS/ejemplo'
    }

    stages {
        stage('Debug') {
            steps {
                script {
                    echo "Clonando desde: https://github.com/martiroman/observabilidad.git en la rama main"
                }
            }
        }

        stage('Build and Push to Docker Hub') {
            steps {
                script {
                    checkout([$class: 'GitSCM', branches: [[name: 'main']], userRemoteConfigs: [[url: 'https://github.com/martiroman/observabilidad.git']]])

                    // Cambiar al subdirectorio
                    dir(APP_DIR) {
                        // Construir la imagen Docker
                        sh 'docker build -t $IMAGE_NAME .'
    
                        // Iniciar sesión en Docker Hub y realizar acciones después de iniciar sesión
                        withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials-id', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                            sh "docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD"
                            sh "docker tag $IMAGE_NAME:latest $DOCKER_USERNAME/$IMAGE_NAME:latest"
                            sh "docker push $DOCKER_USERNAME/$IMAGE_NAME:latest"
                        }
                    }
                }
            }
        }
    }
}
