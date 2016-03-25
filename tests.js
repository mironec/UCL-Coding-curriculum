
QUnit.test( "saveAndLoad test", function( assert ) {
  
	localStorage.setItem('uncleBob.savedLevel', '');
	init();

	var done = assert.async();

	var func = function() {
		if(animationFrameHandle === undefined) {setTimeout(func, 50); return;}

		assert.ok( currentLevel.moduleName == "level1", "First level is 'level1'.");
		assert.ok( currentLevel.done == 0, "First level starts at 0 tasks done.");

		var oldCharacterName = currentLevel.characters.arr[0].name;
		var oldDone = currentLevel.done;
		var oldTutorialText = currentLevel.tutorialText;
		var oldFocus = currentLevel.gameFocus;
		saveLevel();

		while(localStorage.getItem('uncleBob.savedLevel') == '' || localStorage.getItem('uncleBob.savedGameObjects') == '' || localStorage.getItem('uncleBob.savedLevelName') == '' || localStorage.getItem('uncleBob.savedSpellbookTabs') == ''){
		 var i = 0; i++; i--;
		}

		loadLevel();
		assert.ok( currentLevel.characters.arr[0].name == oldCharacterName, "Passed!" );
		assert.ok( currentLevel.characters.arr[0] === currentLevel.thingsToDraw[0] && currentLevel.characters.arr[0] === currentLevel.gameObjects[0], "Passed!" );
		assert.ok( currentLevel.thingsToDraw[1] === currentLevel.gameObjects[1], "Passed!" );
		assert.ok( currentLevel.tutorialText == oldTutorialText, "Passed!" );
		assert.ok( currentLevel.gameFocus == oldFocus, "Passed!" );
		assert.ok( currentLevel.done == oldDone, "Passed!" );

		destroy();
		localStorage.setItem('uncleBob.savedLevel', '');

		done();
	}

	setTimeout(func, 50);
});

QUnit.test( "First level test", function( assert ) {
  
	localStorage.setItem('uncleBob.savedLevel', '');
	init();

	var done = assert.async();

	var func = function() {
		if(animationFrameHandle === undefined) {setTimeout(func, 50); return;}

		assert.ok( currentLevel.moduleName == "level1", "First level is 'level1'.");
		assert.ok( currentLevel.done == 0, "First level starts at 0 tasks done.");
		assert.ok( currentLevel.characters.arr.length == 1, "First level has 1 character.");

		destroy();

		done();
	};

	setTimeout(func, 50);
});