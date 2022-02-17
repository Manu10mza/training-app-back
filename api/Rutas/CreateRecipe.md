POST => Path: http://localhost:8200/api/recipe/:userId

Headers : token => en minusculas

Body
{
    "title":"pollo al disco", //Required
    "description": "Tremendo plato con queso paadre", //Required
    "kcal": 12,
    "carbohydrates": 15.4,
    "grease": 154,
    "proteins": 12.3
}