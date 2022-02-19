PUT => Path : http://localhost:8200/api/routine/update/:ownerId/:rutineId

Headers : token => en minusculas

Body: 
{
    "value":{
        "title":"titulo",
        "price":"precio",
        exercises: Arreglo, de forma idéntica a cuando se crea una Rutina
    }
}
No necesariamente deben ir todos los valores, solo el que se desea modificar