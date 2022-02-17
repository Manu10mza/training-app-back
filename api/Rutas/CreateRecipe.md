POST => Path: http://localhost:8200/api/recipe

Headers : token => en minusculas

Body
{
    "recipe":{
        "title":"pollo al disco", //Required
        "description": "Tremendo plato con queso paadre", //Required
        "kcal": 12,
        "carbohydrates": 15.4,
        "grease": 154,
        "proteins": 12.3
    },
    "userId": "01089e4c-c574-46ce-9e34-d6d72aab9d85"
}