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

const divDate = document.querySelector("#div-date");
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
const ordinal = ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th']

let timeNow = new Date();
let dateLastDigit = timeNow.getDate() < 10 ? timeNow.getDate() : timeNow.getDate() % 10;
console.log(`${dateLastDigit} 👈`);

divDate.innerHTML = `${timeNow.getDate()}<sup>${ordinal[dateLastDigit]}</sup> ${months[timeNow.getMonth()]}    ${timeNow.getUTCFullYear()}`
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
    return Math.floor(this.calcDailyCalories());
  }
  calcDailyCalories() {
    //calories that the person must consume everyday
    //Calcultated using a Harris-Benedic equation
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
  //checks if a user has already used the website
  showPersonalDetails(JSON.parse(localStorage.getItem("person")));
  foodsList = JSON.parse(localStorage.getItem("foodsList"));
  caloriesConsumedToday = Number(localStorage.getItem("caloriesConsumedToday"));
  waterConsumedToday = Number(localStorage.getItem("waterConsumedToday"));

  refreshFoodList(); // Shows the list of foods in the foodsList array
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
    // checks for empty inputs
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
      // checks for impossible inputs
      alert("Please enter proper values");
    } else {
      console.log(`${JSON.stringify(person)} 👈 new person`);
      localStorage.setItem("person", JSON.stringify(person));
      localStorage.setItem("recomendedCalories", person.dailyCalories);

      showPersonalDetails(person);

      refreshFoodList();
    }
  }
});

btnAddFood.addEventListener("click", () => {
  // show the div with the input fields for adding a new food
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
    inputProtien.value = "";
    inputFoodName.value = "";
    inputFat.value = "";
    inputCarbohydrate.value = "";
    inputWater.value = "";
  }
});

function showPersonalDetails(person) {
  divInputDetails.classList.add("hidden");
  divShowPersonalDetails.classList.remove("hidden");
  divAddBtnContainer.classList.remove("hidden");

  divShowPersonalDetails.innerHTML = `
  <h3> Your info : </h3>
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

        <button id="edit-personal-details" onClick="editPersonelDetails()"><i class="fas fa-user-edit"></i></button>
        `;
}
function editPersonelDetails() {
  let oldDetails = JSON.parse(localStorage.getItem("person"));

  inputAge.value = oldDetails.age;
  inputWeight.value = oldDetails.weight;
  inputHeight.value = oldDetails.height;
  inputGender.value = oldDetails.gender;
  inputActivity.value = oldDetails.activity;

  divInputDetails.classList.remove("hidden");
  divShowPersonalDetails.classList.add("hidden");
}

function showEditFoodForm(id) {
  let editingFoodIndex = foodsList.findIndex(f => f.id == id);

  let editingFood = foodsList[editingFoodIndex];
  caloriesConsumedToday -= editingFood.calories;
  waterConsumedToday -= editingFood.water;

  let divFoodToEdit = document.querySelector(`#food${id}`);
  divFoodToEdit.classList.add("editing");
  divFoodToEdit.innerHTML = `
  <h4>Edit your food</h4>
  <div class="ip-label">Name :</div>
      <input type="text" id="edit-food-name" value="${
        editingFood.name
      }" /><br />
      <div class="ip-label">Carbohydrates :</div>
      <input type="number" id="edit-carb" value="${
        editingFood.carbohydrate
      }"/><br />
      <div class="ip-label">Fats :</div>
      <input type="number" id="edit-fat" value="${editingFood.fat}"/><br />
      <div class="ip-label">Protiens :</div>
      <input type="number" id="edit-protien" value="${
        editingFood.protien
      }" /><br />
      <div class="ip-label">Water (ml) :</div>
      <input type="number" id="edit-water" value="${editingFood.water}"/>
      <br />
      <button id="submit-edit-food-btn" onClick="updateFood(${id}, ${editingFoodIndex})">OK</button>
      <br /><br />
  `;
}

function updateFood(foodID, foodIndex) {
  let divFoodToEdit = document.querySelector(`#food${foodID}`);

  if (
    !divFoodToEdit.querySelector("#edit-protien").value ||
    !divFoodToEdit.querySelector("#edit-fat").value ||
    !divFoodToEdit.querySelector("#edit-carb").value ||
    !divFoodToEdit.querySelector("#edit-water").value ||
    !divFoodToEdit.querySelector("#edit-food-name").value
  ) {
    alert("Hey, all fields are compulsary");
  } else {
    let newFood = new Food(
      divFoodToEdit.querySelector("#edit-protien").value,
      divFoodToEdit.querySelector("#edit-fat").value,
      divFoodToEdit.querySelector("#edit-carb").value,
      divFoodToEdit.querySelector("#edit-water").value,
      divFoodToEdit.querySelector("#edit-food-name").value
    );

    caloriesConsumedToday += newFood.calories;
    waterConsumedToday += Number(newFood.water);

    newFood = { ...newFood, id: foodID }; // to use the old ID

    foodsList[foodIndex] = newFood;
    refreshFoodList();
    console.log(`${JSON.stringify(newFood)} 👈 refreshed food obj`);
  }
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

  // Deletes all the items in the DOM and shows every item in the list again
  localStorage.setItem("foodsList", JSON.stringify(foodsList));
  localStorage.setItem("caloriesConsumedToday", caloriesConsumedToday);
  localStorage.setItem("waterConsumedToday", waterConsumedToday);

  divFoodList.innerHTML = "";
  divFoodProgress.innerHTML = "";
  divWaterProgress.innerHTML = "";

  console.log(`${JSON.stringify(foodsList)} 👈 latest food list`);

  if (foodsList.length > 0) {
    divShowFoodContainer.classList.remove("hidden");
    for (const food of foodsList) {
      console.log(`${food.name} 👈 fnmae`);
      divFoodList.innerHTML += `
      <div id="food${food.id}" class="show-food-container">
      <div class="show-food-name"> ${food.name} </div>    
      <div class="show-food-calories">${food.calories} kCalories </div>
      <button class="delete-food-button food-button" id="deleteFood" onClick = 'refreshFoodList(${JSON.stringify(
        food
      )}, "delete")'> <i class="fas fa-trash"></i></button>
      
      <button class="edit-food-button food-button" onClick="showEditFoodForm('${
        food.id
      }')"><i class="fas fa-edit"></i></button>
      </div>
      

      `;
    } // end of food loop
    divFoodProgress.innerHTML = `${
      caloriesConsumedToday < localStorage.getItem("recomendedCalories")
        ? "👍"
        : "⚠"
    }${caloriesConsumedToday}kCal / ${localStorage.getItem(
      "recomendedCalories"
    )} kCal`;

    divWaterProgress.innerHTML = `${
      waterConsumedToday > 1600 ? "👍" : "⚠"
    }  ${waterConsumedToday}mL / 2000 mL`;
  } else {
    // if there are no food items, the "Food info" title and calories consumed today aren't shown
    divShowFoodContainer.classList.add("hidden");
  }
}
