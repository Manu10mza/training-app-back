##### Route :  
 - http://localhost:8200/api/user/nutritionists

##### Method:
 - GET

##### Response

```js
[
  {
    id: "91505938-43ad-486b-a656-8eba0a95e8bc",
    recipes: [
      {
        UserId: "91505938-43ad-486b-a656-8eba0a95e8bc",
        carbohydrates: 100,
        createdAt: "2022-02-19T01:47:09.122Z",
        description: "description for test recipe",
        grease: 100,
        grs: 100,
        id: "428d933b-5f3b-4705-bd9a-1c05bc869990",
        kcal: 100,
        proteins: 100,
        title: "test recipe",
        updatedAt: "2022-02-19T01:47:09.165Z"
      },
      ...
    ],
    diets: [
      {
        id: "4b3a45ca-cb66-462e-8ed2-e9375c0e51e0",
        plan: {
          monday: {
            breakfast: {
              UserId: "91505938-43ad-486b-a656-8eba0a95e8bc",
              carbohydrates: 100,
              createdAt: "2022-02-19T01:47:09.122Z",
              description: "description for test recipe",
              grease: 100,
              grs: 100,
              id: "428d933b-5f3b-4705-bd9a-1c05bc869990",
              kcal: 100,
              proteins: 100,
              title: "test recipe",
              updatedAt: "2022-02-19T01:47:09.165Z"
            },
            dinner: {...},
            lunch: {...}
          },
          ...
        }
      }
    ]
  },
  ...
]
```