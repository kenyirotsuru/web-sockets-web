# Express Boilerplate

Este proyecto lo puedes utilizar como base para construir tus sistemas.

El proyecto ya viene configurado con algunos paquetes comunes que utilizamos.

## Instalación

1. Descarga las dependencias del proyecto
```shell
npm install
```

2. Copia el `template` de las variables de entorno y configuralas según tu ambiente.
```shell
cp .env.example .env
```

3. Ejecuta las migraciones del sistema
```shell
knex migrate:latest
```

4. Ejecuta las semillas del sistema
```
knex seed:run
```

## Ejecución
```
node server.js
```
