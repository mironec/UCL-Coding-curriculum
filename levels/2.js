var level2 = new Level(null, null);

level2.moduleName = "level2";

level2.afterStart = function(){
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
	this.addGameObject(tree1);
	
	this.showTutorial("Now that you've grasped the idea of becoming a master of DarkScript, you will now be exposed to part of Bob's intellectual powers\n\n<Press enter to continue>", false);
	this.done = 0;
}

level2.afterUpdate = function(delta){
	var bob = this.getCharacterByName("Bob").arr[0];
	if(this.done == 0 && this.gameFocus != this.FOCUS_TUTORIAL){
		bob.sayTime = 0;
		this.showTutorial("Looking at Bob, Bob at first may not appear to be mighty capable of much. However, Bob does in fact have superior mathematical ability. Try testing Bob out by summoning BOB the console and write: \n\n<c>getCharacterByName(“Bob”).say(20 + 3)\n\n", true);
		this.done = 1;
	}
	
	if(this.done == 1 && bob.sayTime > 0){
		if(bob.sayText.toLowerCase() == "23"){
			this.showTutorial("See? Bob is perfectly able to spontaneously answer this simple level of arithmetic. At the moment, Bob is feeling a bit chuffed. Look at Bob grin.", false);
			this.done = 2;
		}
		else if(bob.sayText.toLowerCase() != "23"){
			this.showTutorial("Make sure at this moment you're telling bob to answer 20 + 3!", false);
			this.done = 0;
		}
		else{
			this.showTutorial("Bob said something incomprehensible.", false);
			this.done = 0;
		}
	}
	if(this.done == 2 && this.gameFocus != this.FOCUS_TUTORIAL){
        this.showTutorial("How about we try to wipe that cheesy smirk off Bob's face?", false);
        this.done = 3;
    } 
    
	if(this.done == 3 && this.gameFocus != this.FOCUS_TUTORIAL){
		this.showTutorial("Looks like Bob heard our plans, Bob has the serious face on…", false);
		this.done = 4;
	}
    
    if(this.done == 4 && this.gameFocus != this.FOCUS_TUTORIAL){
        bob.sayTime = 0;
		this.showTutorial("We’ll take it up a notch, try throwing this at Bob, and make sure you figure out the answer yourself first to check if Bob is right!: \n\n<c>getCharacterByName(“Bob”).say((1000/20)*5 + (120 – 100))\n\n", true);
		this.done = 5;
	}
	//This is the if statement that will tell whether the user typed into the console correctly. Otherwise we make the user retype the statement
    if(this.done == 5 && bob.sayTime > 0){
		if(bob.sayText.toLowerCase() == "270"){
			this.showTutorial("Looks like that didn’t throw Bob off either, Bob is just showing off now, just look at Bob.", false);
			this.done = 6;
		}
		else if(bob.sayText.toLowerCase() != "270"){
			this.showTutorial("Are you sure you've written the intense mathematical expression correctly?", false);
			this.done = 4;
		}
		else{
			this.showTutorial("Bob said something incomprehensible. Again.", false);
			this.done = 4;
		}
	}
    
    if(this.done == 6 && this.gameFocus != this.FOCUS_TUTORIAL){
		this.showTutorial("Looks like I’ll have to pull out our trump card. I will expose to you, Bob’s mathematical limit!", false);
		this.done = 7;
	}
    //insert unhappy bob here
    
    if(this.done == 7 && this.gameFocus != this.FOCUS_TUTORIAL){
		this.showTutorial("Bob, don’t be so unhappy, if we want The Great Bob (you) to save the Bobniverse, we need to show what you can and cannot do. Just bear with the embarrassment for a bit.", false);
		this.done = 8;
	}
	
    if(this.done == 8 && this.gameFocus != this.FOCUS_TUTORIAL){
		this.showTutorial("Ok, just ignore Bob. Since I, Bob the Narrator shall share with you, Bob’s one and only mathematical limit! Drum roll please…", false);
		this.done = 9;
	}
    
    if(this.done == 9 && this.gameFocus != this.FOCUS_TUTORIAL){
		this.showTutorial("Precedence!", false);
		this.done = 10;
	}
    
   
    if(this.done == 10 && this.gameFocus != this.FOCUS_TUTORIAL){
		this.showTutorial(" If you recall when you learnt about Bidmas or Bodmas, certain mathematical operators were applied first before others. The same is true for Bob when Bob calculates but in a slightly different way...", false);
		this.done = 11;    
	}
    
    if(this.done == 11 && this.gameFocus != this.FOCUS_TUTORIAL){
		this.showTutorial("if you were to do: \n\n<c>getCharacterByName(“Bob”).say(5 - 2 + 3)\n\n By Bid/Bodmas you would assume the answer to be 0. But for Bob on the other hand, since Bob received Bob-niverse education, Bob would evaluate 6 instead.", false);
		this.done = 12;
	}
    
    if(this.done == 12 && this.gameFocus != this.FOCUS_TUTORIAL){
		this.showTutorial("Let me explain.", false);
		this.done = 13;
	}
    
    if(this.done == 13 && this.gameFocus != this.FOCUS_TUTORIAL){
		this.showTutorial("In Bobniverse education, maths operators such as (*)Multiplication, ( / )division, ( + )Addition and ( – ) Subtraction are separated by their Precedence, in other words, their priority of importance. ( * ) Multiplication and ( / ) division have the same precedence, and ( + ) addition with ( - ) subtraction have the same but lower precedence.", false);
		this.done = 14;
	}
    
    if(this.done == 14 && this.gameFocus != this.FOCUS_TUTORIAL){
        this.sayTime = 0;
		this.showTutorial("The truth is, Bobs are in love with using Multiplication and Divisions more because Bobs are biased. Don’t be like Bob. So try this to prove Bobs affection for Bob’s unrequited love: \n\n<c>getCharacterByName(“Bob”).say(3 + 4 * 5)\n\n ", true);
		this.done = 15;
	}
    
     if(this.done == 15 && bob.sayTime > 0){
		if(bob.sayText.toLowerCase() == "23"){
			this.showTutorial("Congratulations! Bob has shown you his mathematical prowess and we can move on to the next part...", false);
			this.done = 16;
		}
		else if(bob.sayText.toLowerCase() != "23"){
			this.showTutorial("Are you sure you've written the intense mathematical expression correctly?", false);
			this.done = 16;
		}
		else{
			this.showTutorial("Bob said something incomprehensible. Again.", false);
			this.done = 16;
		}
	}

	
      if(this.done == 16 && this.gameFocus != this.FOCUS_TUTORIAL){
		this.showTutorial("Bob the Narrator: You now know that Bob’s love is real.", false);
		this.done = 17;
	}
     if(this.done == 17 && this.gameFocus != this.FOCUS_TUTORIAL){
		this.showTutorial("But what happens when you have the two operators with the same amount of love that Bob gives? Despite being torn by the decision, despite the pain inside Bob’s heart, All Bobs has a love theory that states love should follow a first come first serve basis.", false);
		this.done = 18;
	}
    if(this.done == 18 && this.gameFocus != this.FOCUS_TUTORIAL){
        this.sayTime = 0;
		this.showTutorial("Bob scans from left to right, try using this to make Bob unveil Bob’s love theory: \n\n<c>getCharacterByName(“Bob”).say( 8 - 3 + 6)\n\n", true);
		this.done = 19;
	}
     if(this.done == 19 && bob.sayTime > 0){
		if(bob.sayText.toLowerCase() == "11"){
			this.showTutorial("Since Bob answered 11 instead of – 1 we can confirm that Bob goes for the subtraction operator because it was first in line from a left to right point of view. \n\nUnfortunately, even when Bob follows Bobs love theory, Bobs still goes in a state of sadness when forced to make a decision.", false);
			this.done = 20;
		}
		else if(bob.sayText.toLowerCase() != "23"){
			this.showTutorial("Are you sure you've written the intense mathematical expression correctly?", false);
			this.done = 18;
		}
		else{
			this.showTutorial("Bob said something incomprehensible. Again.", false);
			this.done = 18;
		}
	}
    if(this.done == 20 && this.gameFocus != this.FOCUS_TUTORIAL){
		this.showTutorial("So just remember, that when it comes to the order of operations, Bob needs special care to make sure you get the correct answer. ", false);
		this.done = 21;
	}
    if(this.done == 21 && this.gameFocus != this.FOCUS_TUTORIAL){
		this.showTutorial("Instead you could just make sure you use brackets like this: \n\n<c>getCharacterByName(“Bob”).say( 8 – (3 + 6))\n\n", false);
		this.done = 22;
	}
    if(this.done == 22 && this.gameFocus != this.FOCUS_TUTORIAL){
		this.showTutorial("With brackets you can be certain about the validity of your mathematical expressions and with brackets you can help Bob make love decisions with less pain.", false);
		this.done = 23;
	}
    if(this.done == 23 && this.gameFocus != this.FOCUS_TUTORIAL){
		setLevel(level3);
		currentLevel.save();
	}
}