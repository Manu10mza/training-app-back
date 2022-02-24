##### Route :  
 - http://localhost:8200/api/diet/:owner

##### Headers:
 - Token (en minusculas)

##### Method:
 - POST

##### Params:
 - owner: owner uid

##### Body:

```js
{
  title: 'test diet title',                       // Required
  price: '19.99',                                 // Required
  plan: [                                         // Required
    {
    'day': 'monday',
    'meals': {
      'breakfast': ['63093705-fae2-446c-8b50-23a8d25d06c8'],
      'lunch': ['63093705-fae2-446c-8b50-23a8d25d06c8'],
      'dinner':['63093705-fae2-446c-8b50-23a8d25d06c8']
    }
  }
    ...
  ] 
}
```
