# HttpProgressive

Muestra un ejemplo de realizar operaciones POST de forma progresiva

## Install

npm install

## Development server

### Levantar el mock de backend con json-server

json-server --watch db.json

Run `ng serve` para servidor de pruebas. Navigate to `http://localhost:4200/`.  

## Detalles

Esta configurado para que el batch sea de 1 en 1 ya que el backend simulado en json-server solo permite por post guardar un elemento.
Cuando se implemente contra un backend qeu reciba un array, se puede modificar la generacion de datos a guardar para mandar un array de elementos 

 
