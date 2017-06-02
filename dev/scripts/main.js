const foodApp = {}

foodApp.userFoodType = "";
foodApp.userTimeChoiceInSec = 0;
foodApp.globalRequestCount = 0;
foodApp.baseUrl = "http://api.yummly.com/v1/api/recipes";
foodApp.id = '34cb1a7b';
foodApp.key = 'c6a456b06c87490207e4863b23095a4a';
foodApp.foodTypes = ['pasta', 'sushi', 'stir-fry'];
foodApp.likedRecipes = [];

foodApp.init = function () {
 // foodApp.generateCard();
  foodApp.generateHomePage();
  foodApp.homePageEvents();
}

foodApp.minutesToSeconds = (num) => {
  return num * 60;
}
foodApp.generateHomePage = function() {
	// Reset globalRequestCount every single homePage is re-rendered;
	this.globalRequestCount = 0;

	// Remove any previous content on the screen
	$('.container').empty();

  let $homePage = $('<div>').attr('id','homePage');
  let $homePageForm = $('<form>');


  //FOOD TYPE FIELDSET
  let $foodTypeFieldset = $('<fieldset>')
                          .attr('class','foodType');

  let $foodTypeSelect =$('<select>')
                        .attr({
                          'name': 'foodType',
                          'id': 'foodType'
                        });

  // USER OPTIONS
  for (let i =0; i < foodApp.foodTypes.length; i++){
    let $foodTypeOption = $('<option>')
                          .attr('value', `${foodApp.foodTypes[i]}`)
                          .text(`${foodApp.foodTypes[i]}`);
    $foodTypeSelect.append($foodTypeOption);
  }
  let $generatorTitle = $('<h2>')
                        .text('Generator');

  $foodTypeFieldset.append($foodTypeSelect, $generatorTitle);
  //end---foodtypefieldset

  // MAX TIME FIELDSET -- WILL INCLUDE TIMER PIC SOON
  let $maxTimeFieldset = $('<fieldset>')
                          .attr('class','maxTime');
  let $maxTimeDesc = $('<p>').text('How much time do you have?');
  //end --- maxTimeFieldset

  // radio buttons for maxTime
  let $timeContainer = $('<div>').attr('class', 'timeContainer')
  let $timePic = $('<img>').attr('src', 'assets/timerBG.png');
  let $timeHandle = $('<img>').attr({
                    'src': 'assets/timerHandle.png',
                    'id': 'handle'});

  $timeContainer.append($timePic, $timeHandle);
  for (let i = 1; i <=4; i++) {
      let $timeOption = $('<input>')
                        .attr({
                          'type': 'radio',
                          'name': 'maxTime',
                          'value': `${i*15}`
                        });
      let $timeLabel =$(`<label>${i*15} Mins</label>`);
      $maxTimeFieldset.append($timeOption, $timeLabel);
  }
  $maxTimeFieldset.append($timeContainer);
  // let $submitButton = $('<input type="submit" value="Submit" class="btn btn-2">');

  let $submitButton = $('<button id="submit"></button>');

  $homePageForm.append($foodTypeFieldset, $maxTimeFieldset, $submitButton);
  $homePage.append($homePageForm);

	// Populate container with homepage
  $('.container').append($homePage);
}

// EVENTS ON HOMEPAGE EVENTS
foodApp.homePageEvents = function (){
  $('#submit').on('click', (e) => {
    // prevent defaulting from refresh
    e.preventDefault();
    this.userFoodType = $("#foodType").val(); // user food type choice
    let maxTime = parseInt($("input[name=maxTime]:checked").val()); //int value of minutes

    //convert maxTime into seconds for query search
    this.userTimeChoiceInSec = this.minutesToSeconds(maxTime);
    console.log(this.userFoodType, this.userTimeChoiceInSec);

		// Remove home page and make room for overlay
		$('.container').empty();
		// Make request and populate container with overlay content

    foodApp.getRecipe(this.userFoodType, this.userTimeChoiceInSec, this.globalRequestCount);
  });
}

foodApp.getRecipe = function(foodType, maxTime, startFrom) {
	var getRecipe = $.ajax({
		url: foodApp.baseUrl,
		method: 'GET',
		dataType: 'jsonp',
		data: {
			'_app_id': foodApp.id,
			'_app_key': foodApp.key,
			format: 'jsonp',
			requirePictures: true,
			q: foodType,
      maxTotalTimeInSeconds: maxTime,
			maxResult: 3,
			start: startFrom,
		}
	})
	.then(function (data){
		let shuffledRecipes = foodApp.shuffle(data);
		foodApp.generateRecipeList(shuffledRecipes);
	});
}

foodApp.shuffle = function(data) {
	var indexArray = [];
	var shuffledRecipes = [];
	// console.log("before shuffle", data.matches);
	for (let i = 0; i < data.matches.length; i++) {
		indexArray[i] = i;
	}
	indexArray = foodApp.shuffleArrayNum(indexArray);
	for (let i = 0; i < indexArray.length; i++) {
		shuffledRecipes.push(data.matches[indexArray[i]]);
	}
	// console.log("shuffled", shuffledRecipes);
	return shuffledRecipes;
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
foodApp.generateRecipeList = function(recipeList) {
	// Remove any previous decks
	$('.container').empty();

	let $view = $('<div>')
							.attr('class', 'deck');
	let populator = foodApp.recipeCardPopulator(recipeList);

	// console.log(foodApp.generateCard(populator()));
	$view.append(foodApp.generateCard(populator()));

	$view.on('click', '.recipeCard__newRecipe-btn, .recipeCard__like-btn', function(e){
		if ($(this).attr('class') === 'recipeCard__like-btn') {
	    console.log('like clicked', e);
			foodApp.jTinderAdd('swipe-right');
			$('.recipeCard').on('animationend oAnimationEnd mozAnimationEnd webkitAnimationEnd', function(){
				console.log('animation done');
					// Save the liked recipe
					for (let i = 0; i < recipeList.length; i++) {
						if (recipeList[i].id === $('.recipeCard').attr('data-id')) {
							foodApp.likedRecipes.push(recipeList[i]);
							break;
						}
					}
					// Remove the recipe after animation is done
			    $('.deck').empty();

					// Get a new recpie  and add to the cart
					$('.deck').append(foodApp.generateCard(populator()));
			});
		}
		else {
			console.log('new recipe clicked');
			foodApp.jTinderAdd('swipe-left');
			$('.recipeCard').on('animationend oAnimationEnd mozAnimationEnd webkitAnimationEnd', function(){
				console.log('animation done');
					$('.deck').empty();
					$('.deck').append(foodApp.generateCard(populator()));
			});
		}
	});
	$('.container').empty();
	$('.container').append($view);
}
foodApp.recipeCardPopulator = function(data) {
	let index = -1;
	return function() {
		index++;
		if (index < data.length) {
			return data[index];
		}
		else {
			// Make ajax request
			console.log('make ajax request');
			// Increment globalRequestCount by index
			foodApp.globalRequestCount += index;

			// When we make a new ajax request, we are returning no data
			// As a result we will see a temporary error on our console regarding undefined data
			// What is a safe way to fail?
			foodApp.getRecipe(foodApp.userFoodType, foodApp.userTimeChoiceInSec, foodApp.globalRequestCount);
		}
	}
}
foodApp.jTinderAdd = function add(name){
		$('.recipeCard').addClass(name);
}

// Create a recipe card dynamically
foodApp.generateCard = function(data) {
  // See https://stackoverflow.com/questions/22075730/css-background-image-url-path
  // for web link in background img url

  var fixedImage =  foodApp.imgSizeChange(data.smallImageUrls[0]);

  let $card = $('<div>')
              .attr({
								'class':'recipeCard',
								'data-id': data.id
							})
              .css({'background': `url(${fixedImage})`, 'background-size': 'cover'});
              console.log(data)
  let $backSection = $('<div>')
                    .attr('class', 'backSection');
  let $backButton = $('<button>')
                    .attr('class', 'backSection__back-btn');
  let $backButtonImg = $('<img>')
                      .attr({
                        'class': 'back-btn__arrow-img',
                        'src': '../../../img/arrow.svg'
                      });
  $backButton.append($backButtonImg);
  $backButton.on('click', function() {
    console.log('go back to home page');
		foodApp.generateHomePage();
  })
  let $backTitle = $('<p>')
                    .attr('class', 'backSection__title')
                    .text(foodApp.userFoodType);
                    // .text(); retrieve the value from the select
  $backSection.append($backButton, $backTitle);

  let $likeBtn = $('<div>')
                .attr('class', 'recipeCard__like-btn')
                .append(foodApp.likeButton('Like'));

  let $foodTitle = $('<h2>')
                  .attr('class', 'recipeCard__food-title')
                  	.text(data.recipeName)

  let $ingredientSection = $('<div>')
                            .attr('class', 'ingredientSection');
  let $ingredientTitle = $('<h3>')
                         .attr('class', 'ingredientSection__ingredientTitle')
                          .text('Ingredients');
  let $ingredientList = $('<ul>')
                        .attr('class', 'ingredientList');

  let $ingredientItem = $('<li>')
                        .attr('class', 'ingredientList__ingredientItem');
		                    data.ingredients.forEach(function(data) {
                        	$ingredientItem.append('<li>' + data + '</li>')
                        	$ingredientList.append($ingredientItem)
                        	// console.log(data)
                        })

	let $newRecipeBtn = $('<button>')
											.attr('class', 'recipeCard__newRecipe-btn')
											.text('New Recipe');

  $ingredientSection.append($ingredientTitle, $ingredientList);
  $card.append($backSection, $likeBtn, $foodTitle, $ingredientSection, $newRecipeBtn);
  return $card;
}
foodApp.imgSizeChange = function(data) {
 // 	console.log(data);
  // console.log('isndie trimmer', data.substr(0, data.length-4));
  return data.substr(0, data.length-4);
	// $(generateCard.smallImageUrls[0]).toString('=s90', '')
	// console.log(generateCard.smallImageUrls[0])
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

foodApp.generateGrid = function() {
	
}

$(function(){
	foodApp.init();
});
