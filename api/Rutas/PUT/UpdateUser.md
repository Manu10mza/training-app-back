##### Route :  
 - http://localhost:8200/api/user/update/:userId

##### Headers:

```js
 {
  token: "value"
 }
```

##### Method:
 - POST

##### Params:
 - userId

##### Body:

```js
{
    field: "property_name",   // Required
    value: "new_value"        // Required
}
```