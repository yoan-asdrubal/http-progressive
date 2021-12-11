# HttpProgressive

Muestra un ejemplo de realizar operaciones POST de forma progresiva

## Install

npm install

## Development server

### Levantar el mock de backend con json-server

json-server --watch db.json

Run `ng serve` para servidor de pruebas. Navigate to `http://localhost:4200/`.  

## Detalles

### Esta configurado para que el batch sea de 1 en 1 ya que el backend simulado en json-server solo permite por post guardar un elemento.
### Cuando se implemente contra un backend qeu reciba un array, se puede modificar la generacion de datos a guardar para mandar un array de elementos 

### Al realizar el post progresivo, si se hace con muchos elementos se podra notar una barra de progreso, como ejemplo de una integracion sencilla con el progreso de la operacion qeu se esta haciendo. 
### Las tablas tienen una implementacion de filtro basada en formulario reactivo y rxjs.
### Se muestran dos tablas, una para generar datos y enviar para el backend, y la otra para visualizar los datos ya guardados.
### Si se intenta guardar datos previamente registrados dara error del backend por id repetido. 
### Se agrego un ejemplo para exportar datos de la tabla a excel usando exceljs
