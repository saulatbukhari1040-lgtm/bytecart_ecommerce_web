pipeline {
    agent any

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/saulatbukhari1040-lgtm/bytecart_ecommerce_web.git'
            }
        }

        stage('Deploy to Staging') {
            steps {
                sh 'docker compose -f docker-compose.jenkins.yml down || true'
                // Start only the app and db to save resources and run tests later
                sh 'docker compose -f docker-compose.jenkins.yml up -d --build db app'
            }
        }

        stage('Run Selenium Tests') {
            steps {
                // Wait for Next.js to finish building and start
                sh '''
                timeout 600 bash -c 'while [[ "$(curl -s -o /dev/null -w ''%{http_code}'' http://localhost:3001)" != "200" ]]; do echo "Waiting for app to start..."; sleep 10; done'
                '''
                // Run the test container. --exit-code-from test will fail the Jenkins pipeline if tests fail!
                sh 'docker compose -f docker-compose.jenkins.yml up --build --exit-code-from test test'
            }
        }
    }

    post {
        always {
            script {
                // get committer email to avoid unregistered user errors
                env.COMMITTER_EMAIL = sh(script: "git log -1 --pretty=format:'%ae'", returnStdout: true).trim()
            }
            // send test results to committer
            emailext (
                subject: "Jenkins Test Results: Job '${env.JOB_NAME}' [${env.BUILD_NUMBER}] - ${currentBuild.currentResult}",
                body: """
                    <p>The Selenium Automated Test phase has concluded.</p>
                    <p><strong>Result:</strong> ${currentBuild.currentResult}</p>
                    <p>Check the full console output and test logs here: <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
                """,
                mimeType: 'text/html',
                to: "${env.COMMITTER_EMAIL}"
            )
        }
        success {
            echo 'Pipeline completed - ByteCart staging running on Port 3001 with Tests Passed!'
        }
        failure {
            echo 'Pipeline failed - Check the test logs above!'
        }
    }
}
