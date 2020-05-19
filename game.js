var buttonColours = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];

var level = 0;
var flag = false;

/*
------------------------------------THE GAME BEGINS---------------------------------------------------------------------------------
--> At this point we are beginning the game. We want to allow the user to enter any key on the keyboard to start.
--> However, we want this to occur only once, when starting the game. The flag variable monitors this behaviour, it becomes true once a key is clicked
--> we then make a call to the function nextSequence() which is responsible for generating the next pattern
*/


$(document).keypress(function() {
  if (!flag) {
    $("#level-title").text("Level " + level);
    nextSequence();
    flag = true;
  }
});


/*
------------------------------------------ON BUTTON CLICK-------------------------------------------------------------------------------------------------------------------
When capturing the user click we want to achieve the following:
  1. When a button is clicked, we want to retrieve it's id (because it tells us which colour is clicked).
  2. Following this, we want to append this colour to the array userClickedPattern which stores the sequence of the user chosen colours.
  3. We also want to play the sound unique to the button (sound files are named according to their button colours. So, if we have access to the id (i.e the colour) we can achieve this).
  4. We want to animate this clicked button (achieved by making a call to animatePress).
  5. At the end of the day we want to able to judge if the users pattern was correct or not:
      so some important things:
        --> Only do this Judgement only if the user has clicked the same amount of times as there are items within the gamePattern (we'll dicuss shortly about gamePattern).
        --> To do this judgement, we call the function checkAnswer (more details to come about what this function does).
*/


$(".btn").click(function() {

  var userChosenColour = $(this).attr("id");
  userClickedPattern.push(userChosenColour);
  playSound(userChosenColour);
  animatePress(userChosenColour);

  if (userClickedPattern.length === gamePattern.length) {
    checkAnswer(userClickedPattern.length);
  }


});
/*
--------------------------------------------CHECKING THE ANSWER-----------------------------------------------------------
--> The function accepts an input that depicts the number of elements that are contained in userClickedPattern.
   --> Within the function:
      --> We want to loop through both the gameover and the userClickedPattern to check if ALL the elemtns of the userClickedPattern matches with those gamePattern:
          --> ounter at the end of this looping should be equal to currentLevel (at this stage we know the user is correct and thus we call nextSequence() after delay of 1000 millisec to generate another pattern, we empty userClickedPattern and reassign counter to 0).
          --> What if the userClickedPattern does not match the gamePattern ? :
              --> We exit the game by assigning the flag to false, level to 0, counter to 0, userClickedPattern and gamePattern to empty array.
              --> we play the sound to indicate the wrong pattern and also animate the body by adding the class game-over defined in css and remove this class after 200 millisec
*/


function checkAnswer(currentLevel) {

  var counter = 0;
  for (var i = 0; i < gamePattern.length; i++) {
    if (userClickedPattern[i] === gamePattern[i]) {
      counter++;
    }
  }
  if (counter === currentLevel) {
    setTimeout(function() {
      nextSequence();
    }, 1000);
    userClickedPattern = [];
    counter = 0
  } else {
    var audio = new Audio("sounds/wrong.mp3");
    audio.play();
    $("#level-title").text("Gameover. Press Any Key to Restart");
    $("body").addClass("game-over");
    setTimeout( function (){
      $("body").removeClass("game-over");
    }, 200);
    level = 0;
    flag = false;
    userClickedPattern = [];
    counter = 0;
    gamePattern = [];
  }
}


/*
-------------------------------GENERATINNG THE NEW PATTERN-------------------------------------------------------------
--> This function gets called whenever we start the game or progress to the next level.
   --> On the function call we increase the level and we display it on the title.
      -->(to indicate the progression from the previous level if called by checkAnswer()).
      -->(to indicate the start of the game when called upon event keypress).
   --> We generate the a randon number on the range of 0 - 4.
   --> Find the random colour by using the random number to retrieve the random colour from buttonColours (which contains the 4 button colours) and append this number on gamePattern.
      --> So gamePattern containes the pattern of all the generated colours.
   --> We animate the by manually toggling between the fadeIn and fadeOut on every pattern generation.
   --> and also play the sound of the randomly generated button.
*/


function nextSequence() {

  level++;
  $("#level-title").text("Level " + level);

  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColour = buttonColours[randomNumber]; //selecting the random selected colour
  gamePattern.push(randomChosenColour);


  $("#" + randomChosenColour).fadeIn(100).fadeOut(100).fadeIn(100);
  playSound(randomChosenColour);

}


//here we want to play a sound for both (1. when the new pattern is created) and (2.when the user clicks on the button)


function playSound(name) {
  var nameOfSound = new Audio("sounds/" + name + ".mp3");
  nameOfSound.play();
}


/*
-->Everytime the button is clicked we want to anmate it different to how its animated when the pattern is created
-->This animation is achieved by adding css rules defined in the pressed classs which is applied to the clicked button and removed after 100 millisec
*/


function animatePress(currentColour) {
  $("#" + currentColour).addClass("pressed");
  setTimeout(function() {
    $("#" + currentColour).removeClass("pressed");
  }, 100);
}
