var foodApp = {}

foodApp.init = function () {
	foodApp.getRecipe()
}

foodApp.baseUrl = "http://api.yummly.com/v1/api/recipes"
foodApp.id = '34cb1a7b'
foodApp.key = 'c6a456b06c87490207e4863b23095a4a'
var randomStart = Math.floor(Math.random() * 1000) + 1;

// foodApp.foodSequence = function shuffle() {

// }

// foodApp.foodTypes = {
// 	// pastaTypes: ["lasagne", "spaghetti", "pasta"],
// 	// // , "macaroni", "ravioli", "tortellini", "fettucine", "rigatoni", "linguine", "penne", "rotini"],
// 	// sushiTypes: ["nigiri, sashimi, maki, uramaki, temak, sushi"]
// }



foodApp.getRecipe = function(foodType, maxTime) {
	var getRecipe = $.ajax({
		url: foodApp.baseUrl,
		method: 'GET',
		dataType: 'jsonp',
		data: {
			'_app_id': foodApp.id,
			'_app_key': foodApp.key,
			format: 'jsonp',
			requirePictures: true,
			q: 'pasta',
			maxResult: 100,
			// start : randomStart 
			// maxTotalTimeInSeconds: ${maxTime}
			// allowedAllergy:
			// allowedDiet:
		}
	})
	.then(function (data){
		// console.log('data', data.matches)
		foodApp.shuffle(data);
	});
}

foodApp.shuffle = function(data) {
	var indexArray = [];
	var shuffledRecipes = [];
	console.log("before shuffle", data.matches);
	for (let i = 0; i < data.matches.length; i++) {
		indexArray[i] = i;
	}
	indexArray = foodApp.shuffleArrayNum(indexArray);
	for (let i = 0; i < indexArray.length; i++) {
		shuffledRecipes.push(data.matches[indexArray[i]]);
	}
	console.log("shuffled", shuffledRecipes);
}
// Includes the min and excludes the max
foodApp.randomNum = function(min, max) {
	return Math.floor(Math.random() * (max-min)) + min;
}
foodApp.shuffleArrayNum = function(array) {
	var a = array;
	var length = array.length;
	var temp;
	var randomIndex;

	while(length > 0) {
		randomIndex = foodApp.randomNum(0, length);
	    length--;
	    temp = a[length];
	    a[length] = a[randomIndex];
	    a[randomIndex] = temp;
  	}
    return a;
}

$(function(){
	foodApp.init();													
});