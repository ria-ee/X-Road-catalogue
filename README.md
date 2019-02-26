# X-tee subsystems and methods catalogue

## Building

```
sudo apt install nodejs
sudo apt install npm
sudo npm install -g npm@latest
sudo npm install -g @angular/cli

git clone <this_repository>
npm install
```

## Testing locally
```
ng serve --host 0.0.0.0
```

## Update angular
```
ng update @angular/cli @angular/core
```

## Build for production
```
ng build --prod --base-href /methods/
```
