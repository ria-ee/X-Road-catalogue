# X-tee subsystems and methods catalogue

## Building

```
sudo apt install nodejs npm
sudo -H npm install -g npm@latest
sudo -H npm install -g @angular/cli
git clone <this_repository>
cd <this_repository_name>
npm ci
npm run lint
npm run test
```

## Sonarqube
If you have a local sonarqube server listening on `http://localhost:9000` then you can run Sonarqube test with a command:
```
docker run -it --rm -v $(pwd):/usr/src sonarsource/sonar-scanner-cli:latest
```
Alternatively you can provide hostname and access token with command line:
```
docker run -it --rm -v $(pwd):/usr/src sonarsource/sonar-scanner-cli:latest -Dsonar.host.url=<server> -Dsonar.login=<token>
```

## Updating angular version
```
ng update @angular/cli @angular/core
```

## Deploy for local manual testing
```
ng serve --host 0.0.0.0
```

## Build for production
```
npm run build
```
