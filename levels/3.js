var level3 = new Level(null, null);
level3.moduleName="level3";

level3.afterStart = function(){
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
	
	this.showTutorial("You have come so far with BOB the console, but BOB the console makes it increasingly difficult to do more magical things such as Bobunctions (functions), Bobables (Variables) and Bloops (Loops).\n\n However, that is all to change by using the legendary item \"The SpellBook\"! It is on a super sale right now within the Bobniverse, you currently can buy 1 and get another 10 free! Of course, we only need one. ", false);
	this.done = 0;
}

level3.afterUpdate = function(delta){
	var bob = this.getCharacterByName("Bob").arr[0];
	if(this.done == 0 && this.gameFocus != this.FOCUS_TUTORIAL ){
		bob.sayTime = 0;
		this.showTutorial("To unleash this mythical, legendary and magical The SpellBook, summon BOB the console and type in:\n\n currentLevel.showSpellbook()\n\n Do you see the magnificence of the Spellbook before your very eyes? I can even smell it.\n", true);
		
		this.done = 1;
	}




if(this.done == 1 && this.gameFocus == this.FOCUS_SPELLBOOK ){
		this.showTutorial("Moving on, now you have the SpellBook, you will be able to write Bobunctions that are crucial to your journey of mastering DarkScript.\n\n You can write in the Spellbook, but if you scribble bobbirish into the pages then it will refuse to do as you say!\n\n ", false);

		this.done = 2;
	}


	if(this.done == 2 && this.gameFocus != this.FOCUS_TUTORIAL)
	{
		this.showTutorial("First a little explanation about Bobunctions. When you previously wrote: \n\n getCharacterByName(\"Bob\").say(\"Hello World!\");\n\n both getCharacterByName() and .say() are Bobunctions that are pre-written for you.\n\n Bobunctions are like the people that give orders, such as Mama Bob telling Bob to go wash the dishes.\n\n ", false);
		this.done = 3;
	}

	if(this.done == 3 && this.gameFocus != this.FOCUS_TUTORIAL)
	{
		this.showTutorial("In that kind of scenario, if you had a Bobunction: \n\ntellBobtoWashDishes()\n\n then you invoke this Bobunction by \"calling it\" as if you were calling Mama Bob to go tell Bob to wash the dishes. ", false);
		this.done = 4;
	}


	if(this.done == 4 && this.gameFocus != this.FOCUS_TUTORIAL)
	{
		this.showTutorial("You can only write your Bobunctions inside The Spellbook because the console simply doesn't have enough magical power to give Mama Bob or other Bob's alike orders.\n\n Can you imagine you telling your Mother to do something?\n Scary right?\n ", false);
		this.done = 5;
	}
	
	if(this.done == 5 && this.gameFocus != this.FOCUS_TUTORIAL){
		this.gameFocus = this.FOCUS_SPELLBOOK;
		this.done = 6;
	}		


	if(this.done == 6 && this.gameFocus == this.FOCUS_SPELLBOOK  )
	{
		
		this.showTutorial("Let's start writing your very own Bobunction!\n Start by writing in the Spellbook after clicking on the '+': \n\n<c>function shoutHelloWorld(){}\n\n", true);
		this.showSpellbook();
		this.done = 7;
	}


	/*if(this.done == 6 && this.gameFocus == this.FOCUS_SPELLBOOK )
	{
		this.showTutorial("Next write: \n\n function shoutHelloWorld(){}\n\n ", false);
		this.done = 7;
	}*/

	if(this.done == 7 && this.gameFocus != this.FOCUS_SPELLBOOK )
	{
		this.showTutorial("Wow, I'm beginning to feel The Spellbook's power ripple through the Bobniverse, but we're not done yet.\n\n  Inside the curly brackets '{}' write in:\n\n<c>getCharacterByName(\"Bob\").say(\"Hello World!\");\n\n Once you're done strike the 'Done' and keep your eye open to see The Spellbook vanish...\n", true);
		this.showSpellbook();

		this.done = 8;
	}

	if(this.done == 8 && this.gameFocus != this.FOCUS_SPELLBOOK )
	{
		this.showTutorial("The Spellbook has now stored your Bobunction.\n\n To use it, you must call it.\n Now, with all your might summon BOB the console and write:\n\n<c>shoutHelloWorld();\n\n ", true);
		this.done = 9;
	}

	if(this.done == 9 && bob.sayText.toLowerCase() == "hello world!" && bob.sayTime > 0 )
	{
		this.showTutorial("Embrace The Spellbook and BOB the console because they will forever be vital to you.\n\n ", false);
		this.done = 10;
	}


	
}