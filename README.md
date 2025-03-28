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
You can run SonarQube tests via the command line, optionally providing a hostname and access token:
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
