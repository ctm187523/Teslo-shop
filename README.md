# Next.js TesloShop
para correr localmente, se necesita la base de datos
```
docker-compose up -d
```

* El -d, significa _detached_

## Configurar las varaibles de entorno
Renombrar el archivo __.env.template__  a __.env__

MongoDB URL Local:
```
mongodb://localhost:27017/teslodb
```

* Reconstruir los módulos de node y levantar Next
```
yarn install
yarn dev
```

## LLenar la base de datos con información de pruebas

Llamar a:
```
http://localhost:3000/api/seed con postman por ejemplo