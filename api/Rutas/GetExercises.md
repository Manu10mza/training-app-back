OBTENER TODOS LOS EJERCICIOS DE UN USUARIO
GET => Path: http://localhost:8200/api/exercise
Headers : token => en minusculas

Body:
{
    "userId": "cbdbf7a8-d29b-401e-a251-31c752dd528f"
}

OBTENER UN EJERCICIO EN ESPECIFICO
GET => Path : http://localhost:8200/api/exercise/:exerciseId
Headers : token => en minusculas