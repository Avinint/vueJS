# Fit Arena - dev stack

## Description
Environnement de dev Docker Front-v2-API   

### Release notes (décembre 2023)
Cette version inclut node 16.15.0 (l'api est exposée par la stack admin-v2-api)

## Mise en oeuvre
L'url de l'api est configurée dans le fichier `.env` :

```
VITE_API_URL=http://fit-arena.dev.local:8080
```

Configurez un DNS local sur votre machine à l'aide du fichier `hosts` :
```
echo '127.0.0.1 fit-arena.dev.local' | sudo tee -a /etc/hosts
```

## Lancement
Requis : avoir lancé les stacks docker-fit-arena/php-apache-7.4 et admin-v2-api

Avec docker compose :  
```
docker compose up &
```
