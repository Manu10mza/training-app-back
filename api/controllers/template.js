const template = (entry) => {
      const diets = entry.Diets.length && entry.Diets.map(diet => {
            return {
                  id: diet.id,
                  plan: diet.plain // plain => plan
            };
      });

      const exercises = entry.Exercises.length && entry.Exercises.map(exercise => {
            return {
                  id: exercise.id,
                  description: exercise.description,
                  video: exercise.video
            };
      });

      const routines = entry.Routines.length && entry.Routines.map(routine => {
            return {
                  id: routine.id,
                  title: routine.title,
                  price: routine.price,
                  days: routine.days
            };
      });

      const recipes = entry.Recipes.length && entry.Recipes;

      if (entry.is_nutritionist && entry.is_personal_trainer) {
            return {
                  user_id: entry.id,
                  routines: routines || null,
                  exercises: exercises || null,
                  recipes: recipes || null,
                  diets: diets || null
            };      
      } else if (entry.is_personal_trainer) {
            return {
                  user_id: entry.id,
                  routines: routines || null,
                  exercises: exercises || null,
            };     
      } else if (entry.is_nutritionist) {
            return {
                  uesr_id: entry.id,
                  recipes: recipes || null,
                  diets: diets || null
            };
      }
};

module.exports = template;