OBTENER TODOS LAS RECETAS DE UN USUARIO
GET => Path: http://localhost:8200/api/recipe
Headers : token => en minusculas

Body:
{
      "userId": "01089e4c-c574-46ce-9e34-d6d72aab9d85" //Required
}

OBTENER UNA RECETA EN ESPECIFICO
GET => Path : http://localhost:8200/api/recipe/:recipeId
Headers : token => en minusculas