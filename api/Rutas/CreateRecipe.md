##### Route :  
 - http://localhost:8200/api/recipe/:userId

##### Headers:
 - Token (en minusculas)

##### Method:
 - POST

##### Params:
 - userId

##### Body:

```js
{
    title: "pollo al disco",                           // Required
    description: "Tremendo plato con queso paadre",    // Required
    kcal: 12,
    carbohydrates: 15.4,
    grease: 154,
    proteins: 12.3
}
```