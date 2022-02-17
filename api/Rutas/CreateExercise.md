POST => Path : http://localhost:8200/api/exercise

Headers : token => en minusculas

Body: 
{
    "exercise": {
        "title": "Abdominales",  //Required
        "description": "Para marcar los ravioles papa", //Required
        "video": "video_url" 
    },
    "userId": "cbdbf7a8-d29b-401e-a251-31c752dd528f"
}
