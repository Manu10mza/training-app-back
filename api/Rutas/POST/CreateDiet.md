<<<<<<< HEAD
##### Route :

- http://localhost:8200/api/diet/:userId
=======
##### Route :  
 - http://localhost:8200/api/diet/:owner
>>>>>>> 7a45d93f80753c9bb0e23026ce09c87e344edf6b

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
<<<<<<< HEAD
      day: 'monday',
      meals:
      {
        breakfast:[
            '412a1dab-7180-4f4d-9fb9-8a311f6f1ea9', // Recipe ID
            '412a1dab-7180-4f4d-9fb9-8a311f6f1ea9', // Recipe ID
            '412a1dab-7180-4f4d-9fb9-8a311f6f1ea9', // Recipe ID
        ],
        lunch:[
             '412a1dab-7180-4f4d-9fb9-8a311f6f1ea9',
             '412a1dab-7180-4f4d-9fb9-8a311f6f1ea9',
             '412a1dab-7180-4f4d-9fb9-8a311f6f1ea9',
        ]
        dinner:[
            '412a1dab-7180-4f4d-9fb9-8a311f6f1ea9',
            '412a1dab-7180-4f4d-9fb9-8a311f6f1ea9',
            '412a1dab-7180-4f4d-9fb9-8a311f6f1ea9',
            '412a1dab-7180-4f4d-9fb9-8a311f6f1ea9',
        ]
      }
    },
    {
      day: 'sunday',
      meals:
      {
        breakfast:[
            '412a1dab-7180-4f4d-9fb9-8a311f6f1ea9', // Recipe ID
            '412a1dab-7180-4f4d-9fb9-8a311f6f1ea9', // Recipe ID
            '412a1dab-7180-4f4d-9fb9-8a311f6f1ea9', // Recipe ID
        ],
        lunch:[
             '412a1dab-7180-4f4d-9fb9-8a311f6f1ea9',
             '412a1dab-7180-4f4d-9fb9-8a311f6f1ea9',
             '412a1dab-7180-4f4d-9fb9-8a311f6f1ea9',
        ]
        dinner:[
            '412a1dab-7180-4f4d-9fb9-8a311f6f1ea9',
            '412a1dab-7180-4f4d-9fb9-8a311f6f1ea9',
            '412a1dab-7180-4f4d-9fb9-8a311f6f1ea9',
            '412a1dab-7180-4f4d-9fb9-8a311f6f1ea9',
        ]
      }
    },
  ]
=======
    'day': 'monday',
    'meals': {
      'breakfast': ['63093705-fae2-446c-8b50-23a8d25d06c8'],
      'lunch': ['63093705-fae2-446c-8b50-23a8d25d06c8'],
      'dinner':['63093705-fae2-446c-8b50-23a8d25d06c8']
    }
  }
    ...
  ] 
>>>>>>> 7a45d93f80753c9bb0e23026ce09c87e344edf6b
}
```
