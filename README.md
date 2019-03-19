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
npm run test-headless
```

## Sonarqube
By default `http://localhost:9000` is used as a sonarqube server.
If you have a remote sonarqube server, update `sonar-project.properties` cunfiguration file and run the test with:
```
npm run sonar
```
Alternatively you can provide hostname and access token with command line:
```
./node_modules/sonar-scanner/bin/sonar-scanner -Dsonar.host.url=<server> -Dsonar.login=<token>
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
ng build --prod --base-href /catalogue/
```
