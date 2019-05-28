const btnSubmitFood = document.querySelector("#submit-food-btn");

const divFoodList = document.querySelector("#show-food-list");
const divShowFoodContainer = document.querySelector("#show-food-info");

const divFoodProgress = document.querySelector("#food-progess");
const divWaterProgress = document.querySelector("#water-progess");

const divAddBtnContainer = document.querySelector("#add-btn-container");
const btnAddFood = document.querySelector("#add-food-btn");

const divNewFood = document.querySelector("#new-food-div");

const btnSubmitPersonalInfo = document.querySelector(
  "#submit-personal-details-btn"
);

const inputFoodName = document.querySelector("#ip-food-name");
const inputCarbohydrate = document.querySelector("#ip-carb");
const inputFat = document.querySelector("#ip-fat");
const inputProtien = document.querySelector("#ip-protien");
const inputWater = document.querySelector("#ip-water");

const divInputDetails = document.querySelector("#personal-details-form");
const inputAge = document.querySelector("#age-ip");
const inputWeight = document.querySelector("#weight-ip");
const inputHeight = document.querySelector("#height-ip");
const inputActivity = document.querySelector("#activity-select");
const inputGender = document.querySelector("#gender-select");

const divShowPersonalDetails = document.querySelector("#show-personal-details");

let Food = class {
  constructor(protien, fat, carbohydrate, water, name) {
    this.id = new Date().getTime();
    this.protien = protien;
    this.fat = fat;
    this.carbohydrate = carbohydrate;
    this.water = water;
    this.name = name;
    this.calories = this.protien * 4 + this.fat * 9 + this.carbohydrate * 4;
  }

  // get calories() {
  //   return this.protien * 4 + this.fat * 9 + this.carbohydrate * 4;
  // }
};

let foodsList = [];
caloriesConsumedToday = 0;
waterConsumedToday = 0;

let Person = class {
  constructor(height, weight, age, gender, activity) {
    this.height = height;
    this.weight = weight;
    this.age = age;
    this.gender = gender;
    this.activity = activity;
  }

  get dailyCalories() {
    return this.calcDailyCalories();
  }
  calcDailyCalories() {
    return (
      (10 * this.weight +
        6.25 * this.height -
        5 * this.age +
        (this.gender === "Male" ? 5 : -161)) *
      this.activity
    );
  }
};

if (localStorage.getItem("person")) {
  showPersonalDetails(JSON.parse(localStorage.getItem("person")));
  foodsList = JSON.parse(localStorage.getItem("foodsList"));
  caloriesConsumedToday = Number(localStorage.getItem("caloriesConsumedToday"));
  waterConsumedToday = Number(localStorage.getItem("waterConsumedToday"));
  refreshFoodList();
} else {
}

btnSubmitPersonalInfo.addEventListener("click", () => {
  if (
    !inputAge.value ||
    !inputHeight.value ||
    !inputWeight.value ||
    !inputActivity.value ||
    !inputGender.value
  ) {
    alert(" ⚠ All fields are compulsary ");
  } else {
    let person = new Person(
      inputHeight.value,
      inputWeight.value,
      inputAge.value,
      inputGender.value,
      inputActivity.value
    );
    if (person.dailyCalories < 10) {
      alert("Please senter proper values");
    } else {
      console.log(`${JSON.stringify(person)} 👈 new person`);
      localStorage.setItem("person", JSON.stringify(person));
      localStorage.setItem("recomendedCalories", person.dailyCalories);
      divInputDetails.classList.add("hidden");
      divShowPersonalDetails.classList.remove("hidden");
      divAddBtnContainer.classList.remove("hidden");

      divShowPersonalDetails.innerHTML = `
        Height   :  ${person.height} cm<br>
        Weight   :  ${person.weight} kg<br>
        Age      :  ${person.age}  years<br>
        Gender   :  ${person.gender} <br>
        Activity :  ${
          person.activity == 1.53
            ? "Sedentary/Light activity"
            : person.activity == 1.76
            ? "Moderately active"
            : "Vigorously active"
        } <br>
        Recomended Calories per day : ${person.dailyCalories}
        <br><br>
        <button id="edit-personal-details" onClick="editPersonelDetails()">Edit personal details</button>
        `;

        refreshFoodList();
    }
  }
});

btnAddFood.addEventListener("click", () => {
  divAddBtnContainer.classList.add("hidden");
  divNewFood.classList.remove("hidden");
});

btnSubmitFood.addEventListener("click", () => {
  if (
    !inputProtien.value ||
    !inputFoodName.value ||
    !inputFat.value ||
    !inputCarbohydrate.value ||
    !inputWater.value
  ) {
    alert(" ⚠ All fields are compulsary ");
  } else {

    

    let newFood = new Food(
      inputProtien.value,
      inputFat.value,
      inputCarbohydrate.value,
      inputWater.value,
      inputFoodName.value
    );

    divAddBtnContainer.classList.remove("hidden");
    divNewFood.classList.add("hidden");

    // newFood = { ...newFood, calories: newFood.calories };
    refreshFoodList(newFood, "add");
    
    // Reset  the values in the input field
    inputProtien.value  = '';
    inputFoodName.value = '';
    inputFat.value  ='';
    inputCarbohydrate.value =''
    inputWater.value = '';
  }
});

function showPersonalDetails(person) {
  divInputDetails.classList.add("hidden");
  divShowPersonalDetails.classList.remove("hidden");
  divAddBtnContainer.classList.remove("hidden");

  divShowPersonalDetails.innerHTML = `
        Height   :  ${person.height} cm<br>
        Weight   :  ${person.weight} kg<br>
        Age      :  ${person.age}  years<br>
        Gender   :  ${person.gender} <br>
        Activity :  ${
          person.activity == 1.53
            ? "Sedentary/Light activity"
            : person.activity == 1.76
            ? "Moderately active"
            : "Vigorously active"
        } <br>
        Recomended Calories per day : ${localStorage.getItem(
          "recomendedCalories"
        )}

        <button id="edit-personal-details" onClick="editPersonelDetails()">Edit</button>
        `;
}
function editPersonelDetails() {
  divInputDetails.classList.remove("hidden");
  divShowPersonalDetails.classList.add("hidden");
}

function refreshFoodList(food, action) {
  if (action === "add") {
    foodsList.push(food);

    caloriesConsumedToday += food.calories;
    waterConsumedToday += Number(food.water);
  } else if (action === "delete") {
    caloriesConsumedToday -= food.calories;
    waterConsumedToday -= Number(food.water);

    let indexToDelete = foodsList.findIndex(f => f.id == food.id);
    foodsList.splice(indexToDelete, 1);
  }

  localStorage.setItem("foodsList", JSON.stringify(foodsList));
  localStorage.setItem("caloriesConsumedToday", caloriesConsumedToday);
  localStorage.setItem("waterConsumedToday", waterConsumedToday);

  divFoodList.innerHTML = "";
  divFoodProgress.innerHTML = "";
  divWaterProgress.innerHTML = "";

  console.log(`${JSON.stringify(foodsList)} 👈 latest food list`);

  if (foodsList.length > 0) {

    
    divFoodList.innerHTML = `<h3> Your foods </h3>`;
    for (const food of foodsList) {
      console.log(`${food.name} 👈 fnmae`);
      divFoodList.innerHTML += `
      <b> ${food.name} </b>    
      ${food.calories} kCalories
      <button id="deleteFood" onClick = 'refreshFoodList(${JSON.stringify(
        food
      )}, "delete")'> Delete this food</button>
      <br>
      `;
    } // end of food loop
    divFoodProgress.innerHTML = `${caloriesConsumedToday< localStorage.getItem('recomendedCalories') ? '👍':'⚠'}${caloriesConsumedToday}kCal / ${localStorage.getItem(
      "recomendedCalories"
    )} kCal`;
    divWaterProgress.innerHTML = `${waterConsumedToday > 1600 ? '👍' : '⚠'}  ${waterConsumedToday}mL / 2000 mL`;
    //alert(localStorage.getItem(recomendedCalories));
  }
}
