document.addEventListener("DOMContentLoaded", function(){
    const data = {bannana:{calories:50},apple:{calories:90},orange:{calories:80},cucumber:{calories:50},mango:{calories:100}}
    const additem = document.querySelector("#add");
    const show = document.querySelector("#show")
    const sele = document.querySelector("#selec")
    const calo = document.querySelector("#calo")
    let calories = 0;
    additem.onclick = function(){

        show.innerHTML= show.innerHTML+"<br>"+sele.value;
        calories=calories+data[sele.value].calories;
        calo.innerHTML = `Calories: ${calories}`
    }
});