var foodApp = {}

foodApp.init = function () {
	foodApp.getRecipe();
  foodApp.generateCard();
}

foodApp.baseUrl = "http://api.yummly.com/v1/api/recipes"
foodApp.id = '34cb1a7b'
foodApp.key = 'c6a456b06c87490207e4863b23095a4a'

foodApp.foodTypes = {
	sushiTypes: ["lasagne, spaghetti, macaroni, ravioli, tortellini, fettucine, rigatoni, linguine, penne, rotini, "],
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

// Create a card dynamically
foodApp.generateCard = function() {
  let $card = $('<div>')
              .attr('class', 'recipeCard');

  let $backSection = $('<div>')
                    .attr('class', 'recipeCard__backSection');
  let $backButton = $('<button>')
                    .attr('class', 'backSection__back-btn');
  let $backTitle = $('<p>')
                    .attr('class', 'backSection__title');
                    // .text(); retrieve the value from the select
  $backSection.append($backButton, $backTitle);

  let $likeBtn = $('<div>')
                .attr('class', 'recipeCard__like-btn')
                .append(foodApp.likeButton('Like'));

  $likeBtn.on('click', 'a.like-button', function() {
    console.log('clicked');
    $(this).toggleClass('liked');
  });

  $card.append($backSection, $likeBtn);
  $('body').append($card);
}
foodApp.likeButton = function(text) {
  return `<a class='like-button'>
      <span class='like-icon'>
        <div class='heart-animation-1'></div>
        <div class='heart-animation-2'></div>
      </span>
      ${text}
    </a>`;

}

$(function(){
	foodApp.init();
});
