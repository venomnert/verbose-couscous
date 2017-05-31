var foodApp = {}

foodApp.init = function () {
	foodApp.getRecipe()
}

foodApp.baseUrl = "http://api.yummly.com/v1/api/recipes"
foodApp.id = '34cb1a7b'
foodApp.key = 'c6a456b06c87490207e4863b23095a4a'

foodApp.foodTypes = {
	sushiTypes: ["lasagne, spaghetti, macaroni, ravioli, tortellini, fettucine, rigatoni, linguine, penne, rotini"],
	pastaTypes: [],
	stirfryTypes: []
}

foodApp.getRecipe = function() {
	var getRecipe = $.ajax({
		url: `http://api.yummly.com/v1/api/recipes`,
		method: 'GET',
		dataType: 'jsonp',
		data: {
			'_app_id': foodApp.id,
			'_app_key': foodApp.key,
			format: 'jsonp',
			requirePictures: true,
			q: "pasta"
			// maxTotalTimeInSeconds:
			// allowedAllergy:
			// allowedDiet:
		}
	})
	.then(function(data){
		console.log(data)
	}) 
}

$(function(){
	foodApp.init();													
});