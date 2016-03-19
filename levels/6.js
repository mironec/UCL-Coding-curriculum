var level6 = new Level(null, null);
level6.moduleName="level6";

level6.afterStart = function(){
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
	
	this.showTutorial("Now it is time to learn conditions in JavaScript.\n Conditions are an important part of programming languages.\n While programming, there may be a situation when you need to adopt one out of a given set of paths.\n\n ", false);
	this.done = 0;
}

level6.afterUpdate = function(delta){
	var bob = this.getCharacterByName("Bob").arr[0];
	if(this.done == 0 && this.gameFocus != this.FOCUS_TUTORIAL){
		bob.sayTime = 0;
		this.showTutorial("JavaScript supports the following forms of if...else statements:\n\n1) if statement. \n2) if...else statement.\n 3) if...else if...statement.", false);
		this.done = 1;
	}


if(this.done == 1 && this.gameFocus != this.FOCUS_TUTORIAL){
		this.showTutorial("1) if Statement \n\nWe use the if statement to specify a block of JavaScript code to be executed if a condition is true.\n\n SYNTAX\n\nif (condition)\n { block of code to be executed if the condition is true }\n\n EXAMPLE\nif ( cropGrowth>80 )\n { harvestCrop(); } ", false);

		this.done = 2;
	}


	if(this.done == 2 && this.gameFocus != this.FOCUS_TUTORIAL)
	{
		this.showTutorial("2) if...else Statement\n\n This statement allows JavaScript to execute statements in a more controlled way.", false);
		this.done = 3;
	}

	if(this.done == 3 && this.gameFocus != this.FOCUS_TUTORIAL)
	{
		this.showTutorial("SYNTAX\n\n if (expression)\n{ Statement(s) to be executed if expression is true }\n else{ Statement(s) to be executed if expression is false }\n\n EXAMPLE \n\n if ( cropGrowth>80) \n{ harvestCrop();} \nelse { waterCrop():}", false);
		this.done = 4;
	}


	if(this.done == 4 && this.gameFocus != this.FOCUS_TUTORIAL)
	{
		this.showTutorial("3) if...else if... Statement \n\nThe if...else if... statement is an advanced form of if...else \nthat allows JavaScript to make a correct decision out of several conditions.\n\n", false);
		this.done = 5;
	}
	

	if(this.done == 5 && this.gameFocus != this.FOCUS_TUTORIAL )
	{
		this.showTutorial("SYNTAX\n\n if (expression 1)\n{ Statement(s) to be executed if expression 1 is true }\n else if (expression 2)\n{ Statement(s) to be executed if expression 2 is true }\nelse if (expression 3)\n{ Statement(s) to be executed if expression 3 is true }\nelse{ Statement(s) to be executed if no expression is true }", false);
		this.done = 6;
	}

	if(this.done == 6 && this.gameFocus != this.FOCUS_TUTORIAL )
	{
		this.showTutorial("EXAMPLE\n\n if ( cropGrowth>= 80 )\n { harvestCrop();} \nelse if ( cropGrowth< 80 )\n { waterCrop();} \nelse if ( cropGrowth == 0 )\n { removeCrop();} ", false);
		this.done = 7;
	}


	
}