POST => Path : http://localhost:8200/api/routine/:ownerId

Headers : token => en minusculas

Body: 
{
    "title":"Nombre de la rutina",
    "price": 1500,
    "exercises":[[{"title":"ejercicio1","description":"descr1","video":"video1"},{"title":"ejercicio2","description":"descr2","video":"video2"}],null,[{"title":"ejercicio3","description":"descr1","video":"video1"},{"title":"ejercicio4","description":"descr1","video":"video1"},{"title":"ejercicio5","description":"descr1","video":"video1"}],null,null,null,null],
    "owner":"UUID del creador de la rutina"
}
Importante, "exercises" es un arreglo, el cual en cada índice contiene un arreglo con todos los ejercicios
de ese día, en caso de que en un día en específico no tenga ejercicios, debe ir NULL, la longitud del
arreglo debe ser 7