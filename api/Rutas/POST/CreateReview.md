##### Route :  
 - http://localhost:8200/api/review
##### Headers:
 - Token (en minusculas)

##### Method:
 - POST

##### Body:

```js
{
  senderId: '6be67672-3511-4c53-88d7-86eb2107aaee',
  productId: '8c74ccdc-4a2e-4da8-bb99-d5b580a0f1a4',    // Required
  points: '3',                                          // Required
  comments: 'this is a comment'
}
```
