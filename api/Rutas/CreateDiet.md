##### Route :  
 - http://localhost:8200/api/diet

##### Headers:
 - Token (en minusculas)

##### Method:
 - POST

##### Body:

```js
{
  title: 'test diet title',                       // Required
  price: '19.99',                                 // Required
  owner: '6be67672-3511-4c53-88d7-86eb2107aaee',  // Required
  plan: [                                         // Required
    {
      day: 'monday',
      meals: {
        breakfast: '412a1dab-7180-4f4d-9fb9-8a311f6f1ea9', // Recipe ID
        lunch: '412a1dab-7180-4f4d-9fb9-8a311f6f1ea9',
        dinner: '412a1dab-7180-4f4d-9fb9-8a311f6f1ea9'
      }
    },
    {
      day: 'tuesday',
      meals: {
        breakfast: '412a1dab-7180-4f4d-9fb9-8a311f6f1ea9',
        lunch: '412a1dab-7180-4f4d-9fb9-8a311f6f1ea9',
        dinner: '412a1dab-7180-4f4d-9fb9-8a311f6f1ea9'
      }
    },
    ...
  ] 
}
```
