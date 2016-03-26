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
            var rndgen = Math.floor(pseudoRand*60 + 1);
            if(rndgen < 52){
                a.push({type: "grass", variation: 6});
            }else if((rndgen > 51) && (rndgen < 55)){
                a.push({type: "grass", variation: 3});
            }else if((rndgen > 54) && (rndgen < 58)){
                a.push({type: "grass", variation: 2});
            }else if((rndgen > 57) && (rndgen < 59)){
                a.push({type: "grass", variation: 1});
            }else if((rndgen > 58) && (rndgen < 60)){
                a.push({type: "grass", variation: 5});
            }else if((rndgen > 59) && (rndgen < 61)){
                a.push({type: "grass", variation: 4});
            }
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
	
	this.showTutorial("Bobunctions, Bobables, Bloops! You’ve finally arrived to the realm of iteration, the life of Bob that repeats was once a ravishing and divine cycle of peace and happiness, until one day The Evil Bob arrived. \n\n But more on that later since I still have to guide you through mastering DarkScript.", false);
	this.done = 0;
}

level5.afterUpdate = function(delta){
	var bob = this.getCharacterByName("Bob").arr[0];
	if(this.done == 0 && this.gameFocus != this.FOCUS_TUTORIAL){
		bob.sayTime = 0;
		this.showTutorial("So Bloops, repetition, iteration and cycles (as if I haven’t repeated myself enough). This is where you will learn how to control time itself where you give commands that seem bound to certain period.", false);
		this.done = 1;
	}


if(this.done == 1 && this.gameFocus != this.FOCUS_TUTORIAL){
		this.showTutorial("I’m sorry, time control is off limits to even The Great Bob. We’re going to be doing something almost just as cool, but less unorthodox.", false);
		this.done = 2;
	}


	if(this.done == 2 && this.gameFocus != this.FOCUS_TUTORIAL)
	{
		this.showTutorial("Getting straight to it now, Bloops are a method of issuing commands inside Bobunctions repeatedly. For example if you would like to make Bob do some exercise because Bob seems to be putting on some weight from all those Red berries, you could make Bob run left and right. But for Bob to burn those Calories, you need at least 5 reps.", false);
		this.done = 3;
	}

	if(this.done == 3 && this.gameFocus != this.FOCUS_TUTORIAL)
	{
		this.showTutorial("So, open up The Spellbook and first scribble in:\n\n<c> function burnBobCalories(){}\n\n Next, go for inside the curly brackets: \n\n<c>for(var counter = 1; counter < 6; counter++){}\n\n Hit Done after each step!", true);
		this.done = 3.5;
	}
    
    if(this.done == 3.5 && this.gameFocus == this.FOCUS_SPELLBOOK){
        this.gameFocus = this.FOCUS_SPELLBOOK;
        this.done = 4;
	}
  
	if(this.done == 4 && this.gameFocus != this.FOCUS_SPELLBOOK)
	{
        
		this.showTutorial("Now, inside the second set of curly brackets write in: \n\n<c>bob().move(3, 0);\n<c> bob().move(-3, 0);\n<c> bob().say(“Running”); \n\n", true);
        this.showSpellbook();
		this.done = 5;
	}
	

	if(this.done == 5 && this.gameFocus != this.FOCUS_SPELLBOOK )
	{
        
		this.showTutorial("With it all assembled together you should have something that looks like this! \n\n<c> function burnBobCalories(){\nfor(var counter = 1; counter < 6; counter++){\n<c>bob().move(3,0);\n<c>bob().move(-3,0);\n<c>bob().say(“Running”)}}\n\n Once you've checked just strike the done!", true);
        this.showSpellbook();
		this.done = 6;
	}
    
	if(this.done == 6 && this.gameFocus != this.FOCUS_SPELLBOOK)
	{
		this.showTutorial("Nows lets make Bob tone down with burnBobCalories()! ", true);
		this.done = 7;
	}


	if(this.done == 7 && bob.sayTime > 0)
	{
        if(bob.sayText.toLowerCase() == "running"){
            this.showTutorial("Doesn’t seem like Bob is losing much but what is important isn’t Bob’s health (i'm sorry Bob), but that you now have a taste of the For Bloop!", false);
            this.done = 8;
        }else{
            this.showTutorial("Make sure you make Bob message us that Bob is running!", false);
            this.done = 6;
        }

	}

	if(this.done == 8 && this.gameFocus != this.FOCUS_TUTORIAL)
	{
		this.showTutorial("There are For Bloops, While Bloops and Do While Bloops, but in the end, why would you even want to use Bloops?", false);
		this.done = 9;
	}

	if(this.done == 9 && this.gameFocus != this.FOCUS_TUTORIAL)
	{
		this.showTutorial("The SpellBook has limited writing room, although it’s possible to just buy more, Bob would rather save Bobcoins to buy more Ice-Bobcream. Using Bloops you can reduce the amount of repeated commands you put inside a single Bobunction. Meaning you do more and write less. What is there not to like? ", false);
		this.done = 10;
	}

	if(this.done == 10 && this.gameFocus != this.FOCUS_TUTORIAL)
	{
		this.showTutorial("Anyhow, it is crucial that you learn how to use Bloops, and we’ll begin with the basic structure of a For Bloop.", false);
		this.done = 11;
	}

	if(this.done == 11 && this.gameFocus != this.FOCUS_TUTORIAL)
	{
		this.showTutorial("A For Bloop begins with a Bobable, in the sense that you cannot use a For Bloop without a Bobable. The Bobable holds a counter for your For Bloop and then once its reached a certain value, the For Bloop will exit.", false);
		this.done = 12;
	}
    
    if(this.done == 12 && this.gameFocus != this.FOCUS_TUTORIAL)
	{
		this.showTutorial("The Structure is like so:\n\n<c> for (initialExpression; Condition; incrementExpression){\n Commands; }; The initial expression contain the Bobable that holds the initial starting point for the Bloop. Such as: \n\n<c> for(var BobableName = 0;…\n\n or \n\n<c> for(BobableName = 1;… \n\n if you have already created the Bobable outside of the For Bloop. ", false);
		this.done = 13;
	}
    
    if(this.done == 13 && this.gameFocus != this.FOCUS_TUTORIAL)
	{
		this.showTutorial("Next is the Condition. When this condition is broken, so will the For Bloop. A condition can be set using Blogical Bobperators, such as the ‘ < ‘ and ‘ > ‘. You can write a condition like this: \n\n<c>BobableName < 10; \n\n Its important to remember, the condition Bobable and the Initial statement Bobable must be the same. So if the statement is: \n\n <c> for(BobableOne = 0; Bobable < 5;...)\n\n You will have a Bloop that will iterate 5 times if your Bloop increments by 1 every time.", false);
		this.done = 14;
	}
    if(this.done == 14 && this.gameFocus != this.FOCUS_TUTORIAL)
	{
		this.showTutorial("Lastly it’s the increment statement. This determines if the value your Bobable holds goes up or down and by how much. Most commonly in Bobniverse we usually use: \n\n<c>n++;\n\n This will make the value increment +1 every repetition. You can also use: \n\n<c> n--;\n\n to go down. If you want to go up or down more than one at a time, you can use: \n\n<c> n+= value; \n\n This will make the Bobable value go up by the value every repetition instead!", false);
		this.done = 15;
	}
    if(this.done == 15 && this.gameFocus != this.FOCUS_TUTORIAL)
	{
		this.showTutorial("To finish off the For Bloop, you assemble everything together, then inside the curly brackets, you put in the commands you want to execute.", false);
		this.done = 16;
	}
    if(this.done == 16 && this.gameFocus != this.FOCUS_TUTORIAL)
	{
		this.showTutorial("With all this you will have immense DarkScript writing powers. Even more so when you learn about the next two Bloops! ", false);
		this.done = 17;
	}
    
     if(this.done == 17 && this.gameFocus != this.FOCUS_TUTORIAL)
	{
		this.showTutorial("While Bloops and Do…While Bloops operate in very similar ways, however they both operate with a condition. Only when the condition is broken will you be able to exit out of the While and Do..While Bloops. ", false);
		this.done = 18;
	}
     if(this.done == 18 && this.gameFocus != this.FOCUS_TUTORIAL)
	{
		this.showTutorial("The structure of a While Bloop is like this: \n\n<c> while([conditional statement]){commands;}\n\n For example while(BobableOne < 10){\n<c> BobableOne++; \n<c>bob().move(1, 0); \n<c>bob().drop(“Redberry seeds”);} \n\n Therefore as long as BobableOne is below 10,  the While Bloop will continue. ", false);
		this.done = 19;
	}
     if(this.done == 19 && this.gameFocus != this.FOCUS_TUTORIAL)
	{
		this.showTutorial("The structure of a Do..While Bloop instead has the commands before the condition is checked. Like this: \n\n<c> do{commands;}while(conditional statement); If you fill in the spaces just like a While Bloop, then you will have no problems!", false);
		this.done = 20;
	}
     if(this.done == 20 && this.gameFocus != this.FOCUS_TUTORIAL)
	{
		this.showTutorial("But Wait! What happens if your Bloops never ends?", false);
		this.done = 21;
	}
     if(this.done == 21 && this.gameFocus != this.FOCUS_TUTORIAL)
	{
		this.showTutorial(":   If you create something called and “Infinite Bloop” then The Spellbook will generate and infinite amount of energy. When you have an infinite amount of energy, The Spellbook will being to rip through space and time completely destroying the Bobniverse…", false);
		this.done = 22;
	}
     if(this.done == 22 && this.gameFocus != this.FOCUS_TUTORIAL)
	{
		this.showTutorial("Good thing there is a refresh button. That will allow me to send you back 15 seconds before you ruined everything. You best avoid doing something like this. ", false);
		this.done = 23;
	}
     if(this.done == 23 && this.gameFocus != this.FOCUS_TUTORIAL)
	{
		setLevel(level6);
		currentLevel.save();
	}
    

}