const API_KEY = 'BuoaQ26wWo1Si0B8QDqvvHDPod8aMWoVVT6ekGmP';
const SEARCH_API_URL = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${API_KEY}&query=`;
const DETAILS_API_URL = `https://api.nal.usda.gov/fdc/v1/food/`;

const searchInput = document.getElementById('food-search');
const foodSelect = document.getElementById('food-select');
const nutritionInfo = document.getElementById('nutrition-info');
const addButton = document.getElementById('add-button');
const totalCalories = document.getElementById('total-calories');
const totalProtein = document.getElementById('total-protein');
const totalFat = document.getElementById('total-fat');
const totalCarbs = document.getElementById('total-carbs');
const itemsList = document.getElementById('items-list');

let selectedFoods = [];

searchInput.addEventListener('input', async () => {
    const query = searchInput.value;
    if (query.length > 2) {
        try {
            const response = await fetch(SEARCH_API_URL + query);
            const data = await response.json();
            console.log('Search Results:', data);
            updateSelect(data.foods);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    }
});

foodSelect.addEventListener('change', async () => {
    const fdcId = foodSelect.value;
    if (fdcId) {
        try {
            const response = await fetch(`${DETAILS_API_URL}${fdcId}?api_key=${API_KEY}`);
            const foodDetails = await response.json();
            console.log('Food Details:', foodDetails);
            displayNutritionInfo(foodDetails);
        } catch (error) {
            console.error('Error fetching food details:', error);
        }
    }
});

addButton.addEventListener('click', () => {
    const fdcId = foodSelect.value;
    if (fdcId) {
        const selectedOption = foodSelect.options[foodSelect.selectedIndex];
        const foodDetails = {
            fdcId,
            description: selectedOption.text,
            nutrients: {
                calories: parseFloat(document.querySelector('#nutrition-info p:nth-child(2) strong').nextSibling.textContent),
                protein: parseFloat(document.querySelector('#nutrition-info p:nth-child(3) strong').nextSibling.textContent),
                fat: parseFloat(document.querySelector('#nutrition-info p:nth-child(4) strong').nextSibling.textContent),
                carbs: parseFloat(document.querySelector('#nutrition-info p:nth-child(5) strong').nextSibling.textContent)
            }
        };
        selectedFoods.push(foodDetails);
        addItemToList(foodDetails.description);
        updateTotalNutrition();
    }
});

function updateSelect(foods) {
    foodSelect.innerHTML = '';
    foods.forEach(food => {
        const option = document.createElement('option');
        option.value = food.fdcId;
        option.textContent = food.description;
        foodSelect.appendChild(option);
    });
    nutritionInfo.style.display = 'none'; // Hide nutrition info when updating the select
}

function displayNutritionInfo(foodDetails) {
    console.log('Nutrients:', foodDetails.foodNutrients); // Log the nutrients for debugging

    const calories = foodDetails.foodNutrients.find(n => n.nutrient.id === 1008);
    const protein = foodDetails.foodNutrients.find(n => n.nutrient.id === 1003);
    const fat = foodDetails.foodNutrients.find(n => n.nutrient.id === 1004);
    const carbs = foodDetails.foodNutrients.find(n => n.nutrient.id === 1005);
    console.log(fat)
    nutritionInfo.innerHTML = `
        <h3>${foodDetails.description}</h3>
        <p><strong>Calories:</strong> ${calories.amount} kcal</p>
        <p><strong>Protein:</strong> ${protein.amount} g </p>
        <p><strong>Fat:</strong> ${fat.amount} g</p>
        <p><strong>Carbohydrates:</strong> ${carbs.amount} g</p>
    `;
    nutritionInfo.style.display = 'block'; // Show nutrition info box
}

function addItemToList(description) {
    const listItem = document.createElement('li');
    listItem.textContent = description;
    itemsList.appendChild(listItem);
}

function updateTotalNutrition() {
    const totals = selectedFoods.reduce((acc, food) => {
        acc.calories += food.nutrients.calories;
        acc.protein += food.nutrients.protein;
        acc.fat += food.nutrients.fat;
        acc.carbs += food.nutrients.carbs;
        return acc;
    }, { calories: 0, protein: 0, fat: 0, carbs: 0 });

    totalCalories.textContent = totals.calories.toFixed(2);
    totalProtein.textContent = totals.protein.toFixed(2);
    totalFat.textContent = totals.fat.toFixed(2);
    totalCarbs.textContent = totals.carbs.toFixed(2);
}
