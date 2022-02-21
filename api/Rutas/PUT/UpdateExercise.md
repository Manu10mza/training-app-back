##### Route :  
 - http://localhost:8200/api/exercise/:userId/:exerciseId

##### Headers:
 - Token (en minusculas)

##### Method:
 - POST

##### Body:

```js
{
    title: "Abdominales",  //Required
    description: "Para marcar los ravioles papa", //Required
    video: "video_url" 
}
```