/*
 * Assignments consist of objectives; this is the constructor for an individual
 * objective. each objective has a description which tells more about the
 * objective than the title, each objective has a boolean to indicate
 * completion, each objective has a title, and each objective has prerequisites
 * - meaning that before this objective can be shown other objectives have to be
 * completed first
 */

var useGoals = true;

function AssignmentObjective(title, description, prerequisites) {
	this.description = description;
	this.isCompleted = false;
	this.title = title;
	if (!prerequisites) {
			prerequisites = [];
	}
	this.prerequisites = prerequisites.map(function(obj) {
		return obj.title || obj;
	});
}

function addObjectives(assignmentID, objectives) {
	if (!window.assignments) return;
	var assignment = window.assignments[assignmentID];
	if (!assignment) return;
	assignment.goals = objectives;
}

(function() {
	var beginning = new AssignmentObjective("Beginning", "Create the beginning of your story.", []);
    var middle = new AssignmentObjective("Middle", "Create the middle of your story.", [beginning]);
    var end = new AssignmentObjective("End", "Create the end of your story.", [middle]);
	var newBlock = new AssignmentObjective("New Block", "Make sure to use at least one new block you didn't use in the lab.", [beginning]);
    var twoSprites = new AssignmentObjective("Two Sprites", "Make sure to have at least two unique and different sprites that interact with each other.", [beginning]);
    var broadcasts = new AssignmentObjective("Ten Broadcasts", "Make sure to have at least 10 broadcasts of messages between the sprites.", [twoSprites]);

	var objectives = [beginning, middle, end, newBlock, twoSprites, broadcasts];

	addObjectives("lightsCameraActionHW", objectives);
})();

(function() {
	var createBlock = new AssignmentObjective("Define Block", "Define a custom polygon drawing block with three parameters: side length, number of sides and pen thickness.", []);
	var implementBlock = new AssignmentObjective("Implement Block", "Add code to your block to make it draw the polygon.", [createBlock]);
	var squareTest = new AssignmentObjective("Square Test", "Test your block by drawing a polygon with 4 sides, 100 length and 5 thickness.", [implementBlock]);
	var decagonTest = new AssignmentObjective("Decagon Test", "Test your block by drawing a polygon with 10 sides, 50 length and 6 thickness.", [implementBlock]);
	var mysteryTest = new AssignmentObjective("Mystery Test", "Test your block by drawing a polygon with 50 sides, 7 length and 2 thickness. What do you think it will draw?", [implementBlock]);

	var objectives = [createBlock, implementBlock, squareTest, decagonTest, mysteryTest];

	addObjectives("polygonMakerLab", objectives);
})();



(function() {
	var createBlock = new AssignmentObjective("Define Block", "Define a custom \"squiral\" block with a parameter for the number of rotations.", []);
	var square = new AssignmentObjective("Draw a Square", "Have your squiral block draw a square.", [createBlock]);
	var length = new AssignmentObjective("Longer Sides", "Make each side of your squiral longer than the previous.", [square]);
	var repeat = new AssignmentObjective("Repeat", "Have the squiral repeat until you have drawn the requested number of rotations.", [square]);


	var objectives = [createBlock, square, length, repeat];

	addObjectives("squiralHW", objectives);
})();

(function() {
	var welcome = new AssignmentObjective("Welcome the Player", "Welcome the player to the game.", []);
	var greetByName = new AssignmentObjective("Greet the Player", "Greet the player by name.", [welcome]);
	var storeNumber = new AssignmentObjective("Store Secret Number", "Store a random secret number from 1-10.", []);
	var getAGuess = new AssignmentObjective("Get a Guess", "Have the player guess the secret number.", [greetByName]);
	var sayIfCorrect = new AssignmentObjective("Say if Correct", "Tell the player if they guessed correctly.", [getAGuess, storeNumber]);
	var sayIfTooHighOrLow = new AssignmentObjective("Say if Too High/Low", "Tell the player if they guessed too high or too low.", [getAGuess, storeNumber]);
	var repeat = new AssignmentObjective("Repeat", "Make the player guess until they guess the secret number.", [getAGuess, storeNumber]);

	var objectives = [welcome, greetByName, storeNumber, getAGuess, sayIfCorrect, sayIfTooHighOrLow, repeat];

	addObjectives("guess1Lab", objectives);
})();

(function() {
	var part1 = new AssignmentObjective("Part 1", "Load or recreate your code from the Guessing Game Part 1.", []);
	var minMax = new AssignmentObjective("Get Min/Max", "Let the player choose the minimum and maximum for the random number.", [part1]);
	var guesses = new AssignmentObjective("Number of Guesses", "Keep track of how many guesses the player has made.", [part1]);
	var reportGuesses = new AssignmentObjective("Report Guesses", "When the player wins, tell them how many guesses they took.", [guesses]);

	var objectives = [part1, minMax, guesses, reportGuesses];

	addObjectives("guess2HW", objectives);
})();


(function() {
	var minMax = new AssignmentObjective("Get Min/Max", "Ask the player for the minimum and maximum of their secret number.", []);
	var pickNumber = new AssignmentObjective("Player Picks a Number", "Ask the player to pick and remember a secret number.", []);
	var guess = new AssignmentObjective("Guess the Number", "The sprite should guess numbers until they player says it's correct.", [pickNumber,  minMax]);
	var keepTrack = new AssignmentObjective("Keep Track of Guesses", "Store all guesses made by the sprite in a list. It should reset after the game.", [guess]);
	var dontRepeat = new AssignmentObjective("Don't Repeat Guesses", "Make sure the sprite never guesses a number it's already guessed.", [keepTrack]);

	var objectives = [minMax, pickNumber, guess, keepTrack, dontRepeat];

	addObjectives("guess3Lab", objectives);
})();