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
	
	this.showTutorial("You will come to learn that Bob will forget things he says or does the instant he is finished.\n\n Such as when he finishes saying something, Bob doesn't have a way of remembering what he said previously.\n\n Of course, all this will change with...\n BOBABLES! ", false);
	this.done = 0;
}

level4.afterUpdate = function(delta){
	var bob = this.getCharacterByName("Bob").arr[0];
	if(this.done == 0 && this.gameFocus != this.FOCUS_TUTORIAL){
		bob.sayTime = 0;
		this.showTutorial("Bobables are created in DarkScript and are mighty useful when it comes to storing information about things that Bob do, or things that Bob needs to remember.\n\n  Bobables are like a creature that help Bob hold and remember things\n, without Bobables, Bob would even forget Bob's own name.\n\n", false);
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
		this.showTutorial("We create Bobables in a Bobunction inside The Spellbook.\n\n So hurry up and open that cheap.\n I mean powerful book and start by writing a new Bobunction \n\n<c> function BobsWallet(){}\n\n", true);
		this.gameFocus = this.FOCUS_SPELLBOOK;

		this.done = 2;
	}


	if(this.done == 2 && this.gameFocus != this.FOCUS_SPELLBOOK)
	{
		this.showTutorial("Then inside the function's brackets write: \n\n<c>var numberOfBobCoins = 500;\n\n This will summon a Bobable named numberOfBobCoins, you could give the Bobable a fancy name, but you might not know what that Bobable is holding later on.\n\n Bobables don't mind lengthy names like that either.", true);
		this.gameFocus = this.FOCUS_SPELLBOOK;
		this.done = 3;
	}

	if(this.done == 3 && this.gameFocus != this.FOCUS_SPELLBOOK)
	{
		this.showTutorial("Now we want to make the Bobunction \"BobsWallet\" to make Bob tell us how much Bobcoins Bob has by writing: \n\n<c>bob().say(\"I have \" + numberOfBobCoins +  \"Bobcoins\");\n\n Remember, everything that you want to tell Bob to do and the Bobables must go inbetween the curley brackets '{}'", true);
		this.gameFocus = this.FOCUS_SPELLBOOK;

		this.done = 4;
	}

	if(this.done == 4 && this.gameFocus != this.FOCUS_SPELLBOOK)
	{
		this.showTutorial("Now use the newly created Bobunction!\n\n Use BobsWallet to make Bob spill out exactly how much Bobcoin Bob has, so that Bob will never forget whether or not Bob has enough Bobcoins to buy an Ice-Bobcream.\n\n", true);
		this.gameFocus = this.FOCUS_TUTORIAL;

		this.done = 5;
	}

	if(this.done == 5 && bob.sayTime > 0 && this.gameFocus != this.FOCUS_TUTORIAL)
	{
		this.showTutorial("Well done The Great Bob! However, you need to know a little more about exactly how to use Bobables or great disasters will occur.", false);
		
		this.done = 6;
	}
	

	if(this.done == 6 && this.gameFocus != this.FOCUS_TUTORIAL)
	{
		this.showTutorial("A Bobable needs to be first initiated with the magic text 'var' this tells The Spellbook that you are creating a Bobable. Next you need is a name for the Bobable, something to identify the Bobable later. Therefore as a whole, a completed Bobable is written: \n\n<c>var BobableName; \n\n Make sure you include the semi-colon.", false);
		
		this.done = 7;
	}

	if(this.done == 7 && this.gameFocus != this.FOCUS_TUTORIAL)
	{
		this.showTutorial("However, a Bobable's true purpose only comes to light when you give the Bobable something to hold onto, something to keep.\n\n  For example, numbers like we have previously done with the Bobunction BobsWallet. ", false);
		
		this.done = 8;
	}

	if(this.done == 8 && this.gameFocus != this.FOCUS_TUTORIAL)
	{
		this.showTutorial("Else you could also give the Bobable a piece of text like this: \n\n<c>var BobsBestFriend = \"Bob\";\n\n The key is to put your piece of text inside quotation marks and also always remember the semi-colon at the end.\n ", false);
		
		this.done = 9;
	}

	if(this.done == 9 && this.gameFocus != this.FOCUS_TUTORIAL)
	{
		this.showTutorial("Therefore, all in all, you can make Bobables that hold pieces of text and numbers to aid Bob in remembering things that Bob truly cares about.\n\n But, there are a few rules to Bobables.\n For starters, Bobables don't like their names to begin with numbers.\n They much prefer to begin with a letter or an underscore '_' (Please avoid questioning Bobable's name preferences).\n\n", false);
		
		this.done = 10;
	}

	if(this.done == 10 && this.gameFocus != this.FOCUS_TUTORIAL)
	{
		this.showTutorial("Another rule is that Bobables are very specific when it comes to calling their name to retrieve what they hold.\n\n You can't just say a Bobable named \"Apple\" (Uppercase A) is the same as a Bobable named \"apple\"(Lowercase a).\n\n To Bobables, the two are completely different, so be wary of that.\n\n ", false);
		
		this.done = 11;
	}

	if(this.done == 11 && this.gameFocus != this.FOCUS_TUTORIAL)
	{
		this.showTutorial("Now that you know a bit about Bobables, I should also tell you that Bobables can change what they are holding, they're not like selfish Bobs who don't share their Bobcoins in times of crisis...\n\n", false);
		
		this.done = 12;
	}

	if(this.done == 12 && this.gameFocus != this.FOCUS_TUTORIAL)
	{
		this.showTutorial("Moving on, after telling the Bobable NumberOfBobCoins = 500;, you can later write NumberOfBobCoins = 100; like this: \n\n<c>function(){ var NumberOfBobCoins = 500; NumberOfBobCoins = 100; bob().say(\"I have \" + NumberOfBobCoins + \" Bobcoins\")}\n\n Try use the Bobunction BobsWallet now with the changes, you will see that Bob has now got 100 Bobcoins instead. Poor Bob. \n", true);
		this.gameFocus = this.FOCUS_SPELLBOOK;
		this.done = 13;
	}

	if(this.done == 13 && this.gameFocus != this.FOCUS_SPELLBOOK)
	{
		this.showTutorial("Try the function now. Bob will lose 400 Bobcoins!!", true);
		this.gameFocus = this.FOCUS_TUTORIAL;
		this.done = 14;
	}

	if(this.done == 14 && this.gameFocus != this.FOCUS_TUTORIAL && bob.sayTime > 0)
	{
		this.showTutorial("There is more too! You can make Bobables do maths like this: \n\n<c>NumberOfBobCoins = 100 + 400;\n\n and the final value that the Bobable NumberOfBobCoins hold will be 500. Try it out!", true);
		this.gameFocus = this.FOCUS_SPELLBOOK;
		this.done = 15;
	}

	if(this.done == 15 && this.gameFocus != this.FOCUS_SPELLBOOK)
	{
		this.showTutorial("Try the function now. Bob has 500 Bobcoins again. You impressed Bob!!", true);
		this.gameFocus = this.FOCUS_TUTORIAL;
		this.done = 16;
	}

	if(this.done == 16 && this.gameFocus != this.FOCUS_TUTORIAL && bob.sayTime > 0)
	{
		this.showTutorial("You can also make the Bobable call itself: \n\n<c>NumberOfBobCoins = NumberOfBobCoins*2;\n\n This means if the Bobable NumberOfBobCoins was previously holding 500, NumberOfBobCoins will now hold 1000 because it referenced its own value times by 2 to be its new value.\n\n", false);
		
		this.done = 17;
	}

	if(this.done == 17 && this.gameFocus != this.FOCUS_TUTORIAL)
	{
		this.showTutorial("There is a lot of fun to be had with Bobables.  \n\n", false);
		
		this.done = 18;
	}
   


















	
	

	
}

