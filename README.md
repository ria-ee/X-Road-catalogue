# X-tee subsystems and methods catalogue

## Building

```
sudo apt install nodejs npm
sudo -H npm install -g npm@latest
sudo -H npm install -g @angular/cli
git clone <this_repository>
cd <this_repository_name>
npm ci
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
