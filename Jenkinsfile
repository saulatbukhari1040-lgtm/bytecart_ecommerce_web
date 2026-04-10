pipeline {
    agent any

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/saulatbukhari1040-lgtm/bytecart_ecommerce_web.git'
            }
        }

        stage('Build and Deploy') {
            steps {
                sh 'docker compose -f docker-compose.jenkins.yml down || true'
                sh 'docker compose -f docker-compose.jenkins.yml up -d --build'
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed - ByteCart is running on port 3001'
        }
        failure {
            echo 'Pipeline failed - check the logs above'
        }
    }
}
