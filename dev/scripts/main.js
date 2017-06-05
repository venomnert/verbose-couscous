const foodApp = {}

foodApp.userFoodType = "";

foodApp.globalRequestCount = 0;
foodApp.baseUrl = "https://api.yummly.com/v1/api/recipes";
foodApp.baseUrlTwo = "https://api.yummly.com/v1/api/recipe/"
foodApp.id = '34cb1a7b';
foodApp.key = 'c6a456b06c87490207e4863b23095a4a';
foodApp.foodTypes = ['pasta', 'sushi', 'stir-fry', 'taco', 'pizza', 'curry'];
foodApp.likedRecipes = [];
foodApp.timerValue = 0;
foodApp.userTimeChoiceInSeconds = 0;
foodApp.init = function () {
 // foodApp.generateCard();
  foodApp.generateHomePage();
}

foodApp.generateHomePage = function() {
	// Reset globalRequestCount every single homePage is re-rendered;
	this.globalRequestCount = 0;
  // clearing previous timer value
  this.timerValue = 0;
	// Remove any previous content on the screen
	$('.container').empty();

  // Remove previous body style
  $('body').removeAttr( 'style' );


  // Clear user's previous saved recipes
  foodApp.likedRecipes = [];

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
  let $timePic = $('<img>').attr('src', 'assets/timerLayer1.png');
  let $timeHandle = $('<img>').attr({
                    'src': 'assets/timerLayer2.png',
                    'id': 'handle'});

  $timeContainer.append($timePic, $timeHandle);
  $maxTimeFieldset.append($timeContainer);
  // let $submitButton = $('<input type="submit" value="Submit" class="btn btn-2">');

  let $submitButton = $('<button id="submit"></button>');

  $homePageForm.append($foodTypeFieldset, $maxTimeFieldset, $submitButton);
  $homePage.append($homePageForm);

	// Populate container with homepage
  $('.container').append($homePage);
  foodApp.homePageEvents();
}

//ANIMATION FOR TIMER VALUE ON HOMEPAGE
foodApp.timerEvents = function() {
  let rotate = 0;
  $("#handle").on('click', function (){
    console.log('click');
    rotate++;
    foodApp.timerValue = rotate % 4;
    $("#handle").css('transform', `rotate(${rotate * 90}deg)`);
  });
}
// EVENTS ON HOMEPAGE EVENTS
foodApp.homePageEvents = function (){
  foodApp.timerEvents();

  $('#submit').on('click', (e) => {
    // prevent defaulting from refresh
    e.preventDefault();

		// Store the users food type choice, since its need for other parts of the code
		// Same applies for the time choice as well
    this.userFoodType = $("#foodType").val(); // user food type choice
    if (foodApp.timerValue === 0) {
      this.timerValue = 4;
    }

    this.userTimeChoiceInSeconds = this.timerValue * 15 * 60 ;
    console.log(this.userFoodType, this.userTimeChoiceInSeconds);

		// Remove home page and make room for overlay
		$('.container').empty();
		// Make request and populate container with overlay content
    let loadingGif = $('<img>')
                      .attr({
                        'class':'loading-gif',
                        'src': '../../assets/loading_bk.gif'
                      })
                      .css({
                        'position': 'relative',
                        'top': '350px',
                        'left': '45%'
                      });

    $('body').css({
      "background": 'linear-gradient(rgba(0,0,0,0.2),rgba(0,0,0,0.2)), url(../../assets/kitchen_background.jpg) no-repeat'
    });
    $('.container').append(loadingGif);
    foodApp.searchRecipe(this.userFoodType, this.userTimeChoiceInSeconds,this.globalRequestCount, 0);
  });
}


// "Search Recipes" call from the Yummly API
foodApp.searchRecipe = function(foodType, maxTime, startFrom) {
	var searchRecipe = $.ajax({
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
			maxResult: 100,
			start: startFrom
		}
	})
	.then(function (data, recipeId){
		let shuffledRecipes = foodApp.shuffle(data);
		foodApp.generateRecipeList(shuffledRecipes);
	});
}

// "Get Recipe" call from the Yummlyl API
foodApp.getRecipe = function (recipeId) {
	var getRecipe = $.ajax ({
		url: foodApp.baseUrlTwo.concat(recipeId),
		method: 'GET',
		dataType: 'jsonP',
		data: {
			'_app_id': foodApp.id,
			'_app_key': foodApp.key,
			format: 'jsonp',
		}
	})
	.then(function (data){
   		window.open(data.source.sourceRecipeUrl, '_blank');
		console.log('recipe data', data)
	})
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
			// console.log('make ajax request');
			// Increment globalRequestCount by index
			foodApp.globalRequestCount += index;

			// When we make a new ajax request, we are returning no data
			// As a result we will see a temporary error on our console regarding undefined data
			// What is a safe way to fail?
			foodApp.searchRecipe(foodApp.userFoodType, foodApp.userTimeChoiceInSeconds, foodApp.globalRequestCount);
		}
	}
}
foodApp.jTinderAdd = function add(name){
		$('.recipeCard').addClass(name);
}

// Create a recipe card dynamically
foodApp.generateCard = function(data) {
  var fixedImage =  foodApp.imgSizeChange(data.smallImageUrls[0]);

  let $card = $('<div>')
              .attr({
								'class':'recipeCard',
								'data-id': data.id
							})
              .css({'background': `url(${fixedImage})`, 'background-size': 'cover', 'background-position': 'center center'});
              console.log(data)
  let $backSection = $('<div>')
                    .attr('class', 'backSection clearfix');
  let $backButton = $('<button>')
                    .attr('class', 'backSection__back-btn like-button')
                    .on('click', function() {
                      // console.log('go back to home page');
                  		foodApp.generateHomePage();
                    });
  let $backButtonImg = $('<div>')
                      .attr({
                        'class': 'back-btn__arrow-img'
                      })
                      .append('<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" style="fill: #ffffff"><path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z"/></svg>');
  $backButton.append($backButtonImg);

  let $likeList = $('<button>')
                  .attr('class', 'backSection__list_btn like-button')
                  .text('See Your Likes')
                  .on('click', function() {
                    foodApp.generateGrid();
                  });

  $backSection.append($backButton, $likeList);

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

  let $ingredientItem = $('<div>')
                        .attr('class', 'ingredientList__ingredientItem');
		                    data.ingredients.forEach(function(data) {
                        	$ingredientItem.append('<li>' + data + '</li>')
                        	$ingredientList.append($ingredientItem)
                        	// console.log(data)
                        })

	let $newRecipeBtn = $('<div>')
											.attr('class', 'recipeCard__newRecipe-btn')
											.append(foodApp.newRecipeButton('Not feeling it!'));

  $ingredientSection.append($ingredientTitle, $ingredientList);
  $card.append($backSection, $foodTitle, $ingredientSection, $newRecipeBtn, $likeBtn);

	// This section is for dealing with swipe event
	var mc = new Hammer($card[0]);
	mc.on("swipeleft", function(ev) {
		// console.log('left swipe');

		// The code below debounces the swipe event.
		// The swipe event gets called multiple times but we only want it to be called once
		clearInterval(window.leftThrottle);
		window.leftThrottle = setTimeout(function() {
			$('.recipeCard__newRecipe-btn').trigger('click');
		}, 200);
	});
  // Add swipe event listern to card using hammer.js
	mc.on("swiperight", function(ev) {
		// console.log('right swipe');
		clearInterval(window.rightThrottle);
		window.rightThrottle = setTimeout(function() {
			$('.recipeCard__like-btn').trigger('click');
		}, 200);
	});

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

foodApp.newRecipeButton = function(text) {
  return `<a class='like-button'>
        <div class='heart-animation-1'></div>
        <div class='heart-animation-2'></div>
      ${text}
    </a>`;
}

foodApp.generateGrid = function() {

  // Remove any previous generated content
  $('.container').empty();
  let $backHomeBtn = $('<button>')
                      .attr('class', 'backHome-btn')
                      .text('Back Home')
                      .on('click', function() {
                          foodApp.generateHomePage();
                      });

  let $savedCollection = $('<h1>').text('Saved Collection');
  // Remove previous body style
  $('body').removeAttr( 'style' );
  $('body').css({
      "background": 'linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)), url(../../assets/gridBG.jpg) center/cover',
      "height": "100vh"});
  if (foodApp.likedRecipes.length === 0) {
    let $emptyList = $('<h1>')
                  .text('No saved recipes');
    $('.container').append($emptyList);
  }
  else {
    // Create a grid container and append it to the dom
    let $gridContainer = $('<div>')
    .attr('class', 'grid clearfix');
    foodApp.likedRecipes.forEach((recipe) => {
      $gridContainer.append(foodApp.generateGridItem(recipe));
    });
    $('.container').append($savedCollection, $backHomeBtn, $gridContainer);
  }
}

foodApp.generateGridItem = function(recipeObj) {
  var fixedImage =  foodApp.imgSizeChange(recipeObj.smallImageUrls[0]);
  let $savedCardSml = $('<div>')
                      .attr('class', 'savedCardSml grid-item')
                      .css({'background': `linear-gradient(
      rgba(0, 0, 0, 0.2),
      rgba(0, 0, 0, 0.2)), url(${fixedImage}) center/cover`});


  let $name = $('<h3>')
  .attr('class','savedCardSml__name')
  .text(recipeObj.recipeName);

  let $authorsName = $('<h4>')
                    .attr('class','savedCardSml__author')
                    .text(`from: ${recipeObj.sourceDisplayName}`);
  let $time = $('<p>')
              .attr('class', 'savedCardSml__time')
              .text(`${recipeObj.totalTimeInSeconds/60} Minutes`);
  $time.prepend('<i class="fa fa-clock-o" aria-hidden="true"></i>');
  // Add stars based on the rating returned
  let $rating = $('<div>')
  .attr('class', 'savedCardSml__rating');
  for (let i = 0; i < recipeObj.rating; i++) {
    $rating.append('<i class="fa fa-star" aria-hidden="true"></i>');
  }

  let $linkBtn = $('<a>')
  .attr('class', 'savedCardSml__linkBtn');

  let $sourceUrl = $('<button>')
  				  .attr('class', 'savedCardSml__sourceUrl')
  				  .text('Find More')

  $savedCardSml.append($name,$authorsName, $time, $rating, $linkBtn, $sourceUrl);

//
  $sourceUrl.on('click', function(e) {
  	e.preventDefault();
  	foodApp.getRecipe(recipeObj.id);
  })
  return $savedCardSml;
}

$(function(){
	foodApp.init();
});
