var level1 = new Level(null, null);

level1.moduleName = "level1";

level1.afterStart = function(){
	var seed = 3824723.4358;
	var pseudoRand = seed;
	var b = [];
	for(i=0;i<40;i++){
		var a = [];
		for(j=0;j<40;j++){
			pseudoRand = ('0.'+Math.sin(pseudoRand).toString().substr(6));
			a.push({type: "grass", variation: Math.floor(pseudoRand*2 + 1) });
		}
		b.push(a);
	}
	
	this.map.setPosition(-1280, -1280);
	this.map.parseMap(b);
	
	var bob = new Character("Bob",0,0,this);
	bob.getImageFromRepo('bob',this.imageRepository);
	this.addCharacter(bob);
	
	var tree1 = new Tree(300,0,this.imageRepository.getImage('tree1'),this.imageRepository.getImage('stump1'));
	this.thingsToDraw.push(tree1);
	this.gameObjects.push(tree1);

	PlantType.Redberry.lookUpImages(this.imageRepository);
	var redberry = new FarmingPatch(-128,-64,PlantType.Redberry);
	this.thingsToDraw.push(redberry);
	this.gameObjects.push(redberry);
	
	this.showTutorial("In the beginning of time, Bob was there.\n\n<Press enter to continue>", false);
	this.done = 0;
}

level1.afterUpdate = function(delta){
	var bob = this.getCharacterByName("Bob").arr[0];
	if(this.done == 0 && this.gameFocus != this.FOCUS_TUTORIAL){
		bob.sayTime = 0;
		this.showTutorial("Bob was given the power of speech. When Bob speaks, he must first identify his own presence. Using:\n\n<c>getCharacterByName(\"Bob\")\n\nTo speak, he must further specify his glorious words:\n\n<c>getCharacterByName(\"Bob\").say(\"Hello World!\")\n\nTry it yourself now, press the 'Enter' key to bring forth \"BOB the console\", your text-to-magic conversion device and type in the above code.", true);
		this.done = 1;
	}
	
	if(this.done == 1 && bob.sayTime > 0){
		if(bob.sayText.toLowerCase() == "hello world!"){
			this.showTutorial("Do you feel the power of speech surging through your finger tips?", false);
			this.done = 2;
		}
		else if(bob.sayText.toLowerCase() == "hello world"){
			this.showTutorial("NOT ENOUGH PASSION, put that ! in there.", false);
			this.done = 0;
		}
		else{
			this.showTutorial("Bob said something incomprehensible.", false);
			this.done = 0;
		}
	}
	
	if(this.done == 2 && this.gameFocus != this.FOCUS_TUTORIAL){
		this.showTutorial("When the Bob-niverse was born, the world was created where every Bob would move by x and y co-ordinates.\nTry moving Bob 3 tiles south using:\n\n<c>getCharacterByName(\"Bob\").move(0, 3)", true);
		this.done = 3;
	}
	
	if(this.done == 3 && bob.orders.length == 0 && !(bob.x == 0 && bob.y == 0) ){
		if(bob.x == 0 && bob.y == 3*this.map.tileHeight){
			this.showTutorial("Good job. Now try moving Bob again using move(3, 0).", true);
			this.done = 4;
		}
		else{
			this.showTutorial("That's the wrong way!", false);
			bob.moveTo(0,0);
			this.done = 2;
		}
	}
	
	if(this.done == 4 && bob.orders.length == 0 && !(bob.x == 0 && bob.y == 3*this.map.tileHeight) ){
		if(bob.x == 3*this.map.tileWidth && bob.y == 3*this.map.tileHeight){
			this.showTutorial("How about move(-3, -3)?", true);
			this.done = 5;
		}
		else{
			this.showTutorial("That's the wrong way!", false);
			bob.moveTo(0,3*this.map.tileHeight);
			this.done = 3;
		}
	}
	
	if(this.done == 5 && bob.orders.length == 0 && !(bob.x == 3*this.map.tileWidth && bob.y == 3*this.map.tileHeight) ){
		if(bob.x == 0 && bob.y == 0){
			this.showTutorial("I'm starting to like the way you move Bob.", false);
			this.done = 6;
		}
		else{
			this.showTutorial("That's the wrong way!", false);
			bob.moveTo(3*this.map.tileWidth,3*this.map.tileHeight);
			this.done = 4;
		}
	}
	
	if(this.done == 6 && this.gameFocus != this.FOCUS_TUTORIAL){
		//Do second level
	}
}