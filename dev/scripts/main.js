const foodApp = {}

foodApp.init = function () {
  // foodApp.generateCard();
  foodApp.generateHomePage();
  foodApp.homePageEvents();
  
}

foodApp.baseUrl = "http://api.yummly.com/v1/api/recipes"
foodApp.id = '34cb1a7b'
foodApp.key = 'c6a456b06c87490207e4863b23095a4a'


foodApp.foodTypes = ['pasta', 'sushi', 'stir-fry']

foodApp.minutesToSeconds = (num) => {
  return num * 60;
}


foodApp.generateHomePage = function() {
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
  $('body').append($homePage);
}

foodApp.timerValue = 0;
//ANIMATION FOR TIMER VALUE ON HOMEPAGE
foodApp.timerEvents = function() {
  let rotate = 0;
  $("#handle").on('click', function (){
    rotate++;
    foodApp.timerValue = rotate % 4;
    $("#handle").css('transform', `rotate(${rotate * 90}deg)`);
  });
}
// EVENTS ON HOMEPAGE EVENTS
foodApp.homePageEvents = function (){
  foodApp.timerEvents();

  $('#submit').on('click', (e) => {
    e.preventDefault(); // prevent defaulting from refresh

    let foodTypeChoice = $("#foodType").val(); // get user food type choice
    if (foodApp.timerValue === 0) {
      foodApp.timerValue = 4;
    }
    let foodTime = foodApp.timerValue * 15 * 60; // food timer in seconds
    console.log(foodTypeChoice, foodTime);
    foodApp.getRecipe(foodTypeChoice, foodTime);
  });
}

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
			q: foodType,
      maxTotalTimeInSeconds: maxTime,
			maxResult: 100,
		}
	})
	.then(function (data){
		// console.log('data', data.matches)
		foodApp.generateCard(foodApp.shuffle(data)[0]);
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

// Create a recipe card dynamically
foodApp.generateCard = function(data) {
  // See https://stackoverflow.com/questions/22075730/css-background-image-url-path
  // for web link in background img url

  var fixedImage =  foodApp.imgSizeChange(data.smallImageUrls[0]);

  let $card = $('<div>')
              .attr({
                'class': 'recipeCard'
              })
              .css({'background': `url(${fixedImage})`, 'background-size': 'cover'})
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
  })
  let $backTitle = $('<p>')
                    .attr('class', 'backSection__title')
                    .text('Stir-fry');
                    // .text(); retrieve the value from the select
  $backSection.append($backButton, $backTitle);

  let $likeBtn = $('<div>')
                .attr('class', 'recipeCard__like-btn')
                .append(foodApp.likeButton('Like'));

  $likeBtn.on('click', 'a.like-button', function() {
    console.log('clicked');
    $(this).toggleClass('liked');
  });

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
                        	console.log(data)
                        })

  // Foreach loop over all the ingeridents from the api
  // Append it to the list

  $ingredientSection.append($ingredientTitle, $ingredientList);
  $card.append($backSection, $likeBtn, $foodTitle, $ingredientSection);
  $('body').append($card);
}

 foodApp.imgSizeChange = function(data) {
 	console.log(data);
  console.log('isndie trimmer', data.substr(0, data.length-4));
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



$(function(){
	foodApp.init();
});
