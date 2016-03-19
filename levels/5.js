var level5 = new Level(null, null);
level5.moduleName="level5";

level5.afterStart = function(){
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
	
	this.showTutorial(" Now lets learn how to use loops. Loops are very important in programming. It avoids rewriting code to carry out the same task.That's tiresome for Bob. So Bob prefers to use loops.\n\n<Press enter to continue>", false);
	this.done = 0;
}

level5.afterUpdate = function(delta){
	var bob = this.getCharacterByName("Bob").arr[0];
	if(this.done == 0 && this.gameFocus != this.FOCUS_TUTORIAL){
		bob.sayTime = 0;
		this.showTutorial("We will learn 4 types of loops which Bob can use to ease his tasks:\n\n1. The for Statement\n2. The do...while statement\n3. The while statement\n4. The Break Statement\n\n Lets start with the for loop.", false);
		this.done = 1;
	}


if(this.done == 1 && this.gameFocus != this.FOCUS_TUTORIAL){
		this.showTutorial("A for loop repeats until a specified condition evaluates to false. This is the structure of a for loop:\n\n for ([initialExpression]; [condition]; [incrementExpression])\n\n ", false);

		this.done = 2;
	}


	if(this.done == 2 && this.gameFocus != this.FOCUS_TUTORIAL)
	{
		this.showTutorial(" Lets try implement the for loop.\n\n var i;\n\n Lets initialize \"i\". That will be our initialExpression.\n\n i = 0;\n\n Now we need to set up a condition and once this condition evaluates to false the loop will break.\n\n i < 5;\n\n", false);
		this.done = 3;
	}

	if(this.done == 3 && this.gameFocus != this.FOCUS_TUTORIAL)
	{
		this.showTutorial("Now we need to set up the incrementExpression.\n\nThe incrementExpression will be ++i;\n\n Lets combine all of this into our for loop: This is how the for loop looks like:\n\n  for(i = 0;i < 5;++i)", false);
		this.done = 4;
	}


	if(this.done == 4 && this.gameFocus != this.FOCUS_TUTORIAL)
	{
		this.showTutorial("Now we can make Bob repeat a certain task.We'll make Bob say \"Hello World\" quite a few times, because why not!Try implementing the following code:\n\n for(i = 0;i < 5;++i)\n{ getCharacterByName(\"Bob\").say(\"Hello World!\");}\n\n ", false);
		this.done = 5;
	}
	

	if(this.done == 5 && this.gameFocus != this.FOCUS_TUTORIAL )
	{
		this.showTutorial("Now lets get going with the do...while statements. This is a structure of a do...while statement:\n\n do {statements} while (condition);\n\n Lets try help Bob move around his field using this loop. Try enter the following code:\n\n var i = 0;\n\n", false);
		this.done = 6;
	}

	if(this.done == 6 && this.gameFocus != this.FOCUS_TUTORIAL)
	{
		this.showTutorial("Why don't you try making Bob move to different coordinates using this loop. Go ahead!\n\n do{++i;getCharacterByName(\"Bob\").move(0, 3)}\n while (i < 5);", false);
		this.done = 7;
	}


	if(this.done == 7 && this.gameFocus != this.FOCUS_TUTORIAL)
	{
		this.showTutorial("Lets learn how to use the while statement now.\nA while statement executes its statements as long as a specified condition evaluates to true.\n\n This is how a while loop looks like:\n\n while (condition){statements};\n\n If the condition becomes false, the statement within the loop stops executing.\n\n ", false);
		this.done = 8;
	}
//------------------------------------------------------------------
	if(this.done == 8 && this.gameFocus != this.FOCUS_TUTORIAL)
	{
		this.showTutorial("Lets try to use this loop. Go ahead and type this code: \n\nvar i = 0;\n while(i<5) {++i;getCharacterByName(\"Bob\").move(0, 3);}\n\n We just made Bob move again but this time we did it without the \"do\" statement.\n\n ", false);
		this.done = 9;
	}

	if(this.done == 9 && this.gameFocus != this.FOCUS_TUTORIAL)
	{
		this.showTutorial("Bob likes breaking loops sometimes. He can terminate the loop using the break statement.\n\n To break a loop you simply type the following:\n\n break;\n\n ", false);
		this.done = 10;
	}

	if(this.done == 10 && this.gameFocus != this.FOCUS_TUTORIAL)
	{
		this.showTutorial("Try the break: Type in the following code and see what happens:\n\n var i;\n for(i = 0;i < 10; ++i)\n {getCharacterByName(\"Bob\").move(0, 3);\n if(i == 8) break;}", false);
		this.done = 11;
	}

	if(this.done == 11 && this.gameFocus != this.FOCUS_TUTORIAL)
	{
		this.showTutorial("Great!! We learnt how to use the basic loops in DarkScript. \n\nNow Bob will find it easier to repeat certain tasks continuously. \n\n Happy Looping!", false);
		this.done = 12;
	}


}