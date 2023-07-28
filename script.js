const search = document.getElementById("search"),
  submit = document.getElementById("submit"),
  random = document.getElementById("random"),
  mealsEL = document.getElementById("meals"),
  resultHeading = document.getElementById("result-heading"),
  single_Meal = document.getElementById("single-meal");

// search meal and fetch from Api
function searchMeal(e) {
  e.preventDefault();
  console.log("e", e.target);
  //clear single meal
  single_Meal.innerHTML = "";

  //Get Search Term
  const term = search.value;
  //Check if term exists

  if (term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        resultHeading.innerHTML = `<h2>Search results for '${term}':</h2>`;

        if (data.meals === null) {
          resultHeading.innerHTML = `<p>There are no search results. Try again!<p>`;
        } else {
          mealsEL.innerHTML = data.meals
            .map(
              (meal) => `
            <div class="meal">
              <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
              <div class="meal-info" data-mealID="${meal.idMeal}">
                <h3>${meal.strMeal}</h3>
              </div>
            </div>
          `
            )
            .join("");
        }
      });
    search.value = "";
  } else {
    alert("Please enter a search term");
  }
}

function getMealById(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then((res) => res.json())
    .then((data) => {
      //console.log(data.meals[0]);
      const meal = data.meals[0];
      showMealDetails(meal);
    });
}
function getRandomMeal() {
  mealsEL.innerHTML = "";
  resultHeading.innerHTML = "";
  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then((res) => res.json())
    .then((data) => {
      if (data.meals && data.meals.length > 0) {
        // Check if data.meals is not null and is an array
        const meal = data.meals[0];
        getMealById(meal);
      } else {
        console.log("No meal found in the API response.");
        // Handle the case where no meal is found in the API response
      }
    })
    .catch((error) => {
      console.log("Error fetching random meal:", error);
      // Handle fetch error, if any
    });
}

function showMealDetails(meal) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }

  single_Meal.innerHTML = `
     <div class="single-meal">
       <h1>${meal.strMeal}</h1>
       <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
       <h4>Tags: ${meal.strTags}</h4>
              <h5><a href="${
                meal.strYoutube
              }" target=_blank>Click here to watch vedio</a></h5>
       <div class="single-meal-info">
         ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ""}
         ${meal.strArea ? `<p>${meal.strArea}</p>` : ""}
       </div>
       <div class="main">
         <p>${meal.strInstructions}</p>
         <h2>Ingredients</h2>
         <ul>
           ${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
         </ul>
       </div>
     </div>
   `;
}

//Event listener
search.addEventListener("click", (e) => {
  console.log("e", e.target);
});
submit.addEventListener("submit", searchMeal);
random.addEventListener("click", getRandomMeal);
mealsEL.addEventListener("click", (e) => {
  let mealInfo = e.target;

  // Traverse the DOM tree upwards until you find an element with class "meal-info"
  while (mealInfo && !mealInfo.classList.contains("meal-info")) {
    mealInfo = mealInfo.parentNode;
  }

  if (mealInfo) {
    const mealID = mealInfo.getAttribute("data-mealid");
    getMealById(mealID);
  }
});
