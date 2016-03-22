var level4 = new Level(null, null);
level4.moduleName="level4";
level4.afterStart = function(){
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
	
	this.showTutorial("Like many other programming languages, JavaScript also has variables. Variables can be thought of as named containers.\n\n<Press enter to continue>", false);
	this.done = 0;
}

level4.afterUpdate = function(delta){
	var bob = this.getCharacterByName("Bob").arr[0];
	if(this.done == 0 && this.gameFocus != this.FOCUS_TUTORIAL){
		bob.sayTime = 0;
		this.showTutorial("Example: var money = 2000;\n\nThis assigns the variable \"money\" the value 2000. Bob can now refer to 2000 using the variable name \"money\".\n\nWhen Bob stores a value in a variable it is called variable initialization.\n\n\n Press Enter and initialize the variable money to 5000.", true);
		this.done = 1;
	}
	
	/*if(this.done == 1 && bob.sayTime > 0){
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
	}   */
	
	if(this.done == 1 && this.gameFocus != this.FOCUS_TUTORIAL){
		this.showTutorial("JavaScript is a dynamically typed language. This means Bob's variables can hold any value - from numbers to text. \n\nEverything is declared as \"var\" and JavaScript then takes care of whether it is a number, character or piece of text.", false);

		this.done = 2;
	}


	if(this.done == 2 && this.gameFocus != this.FOCUS_TUTORIAL)
	{
		this.showTutorial("There are some very important things to remember when making variables:\n\n 1. JavaScript variable names should not start with a numeral. They must begin with a letter or an underscore character.\n\n2. JavaScript variable names are case-sensitive. E.g. Name and name are two different variables. \n", false);
		this.done = 3;
	}

	if(this.done == 3 && this.gameFocus != this.FOCUS_TUTORIAL)
	{
		this.showTutorial("It is important to end your individual commands using the semi-colon (;)\n\nFor example:\n\nvar money = 1000;\n money = money + 100;", false);
		this.done = 4;
	}


	//TO BE MADE TRUE AS USER INPUT REQUIRE HERE
	if(this.done == 4 && this.gameFocus != this.FOCUS_TUTORIAL)
	{
		this.showTutorial("Why don't we actually try writing out some code to help ease Bob's life.\n\nCreate a function called whatIsBobsName{} and within this function insert the following code:\n\nvar Name = \"Bob\";\n\nThis initializes the variable name with \"Bob\"", true);
		this.done = 5;
	}
	

	if(this.done == 5 && bob.sayTime > 0 )
	{
		this.showTutorial("Let's carry out some mathematical operations using variables\nLets use the variable money which we already initialized to 5000.\nLets add 3000 to our money, because \"WHY NOT!!!\"\n\nvar newMoney = money+5000;\n\nType in that code and press enter.", false);
		this.done = 6;
	}

	if(this.done == 6 && bob.sayTime > 0)
	{
		this.showTutorial("Remember how we called \"Bob\" in the previous chapters and asked him to move. We already declared a variable Name and assigned \"Bob\" to it in this chapter.\n\n Lets use that variable now to call and ask Bob to say something:\n\ngetCharacterByName(Name).say(\"Hello World!\")", false);
		this.done = 7;
	}


	if(this.done == 7 && this.gameFocus != this.FOCUS_TUTORIAL)
	{
		this.showTutorial("Well Done!", false);
		this.done = 8;
	}

	/*if(this.done == 3 && bob.orders.length == 0 && !(bob.x == 0 && bob.y == 0) ){
		if(bob.x == 0 && bob.y == 3*this.map.tileHeight){
			this.showTutorial("Good job. Now try moving Bob again using move(3, 0).", true);
			this.done = 4;
		}
		else{
			this.showTutorial("That's the wrong way!", false);
			bob.moveTo(0,0);
			this.done = 2;
		}
	}*/
	
	/*if(this.done == 4 && bob.orders.length == 0 && !(bob.x == 0 && bob.y == 3*this.map.tileHeight) ){
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
		
	}

	
	if(this.done == 2 && bob.sayText == 8){
		this.showTutorial("Great!", false);
		this.done = 3;
	}
	
	if(this.done == 3 && this.gameFocus != this.FOCUS_TUTORIAL){
		var i = Math.floor(Math.random()*100000);
		var o = i*Math.floor(Math.random()*100000);
		this.resultThing = o/i;
		this.showTutorial("You could do that in your head, but what about "+o+"/"+i+"?", true);
		this.done = 4;
	}
	
	if(this.done == 4 && bob.sayText == this.resultThing){
		this.showTutorial("Good job...", false);
		this.done = 5;
	}*/
}

