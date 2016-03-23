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
	
	this.showTutorial("The Great Bob. You have done extremely well to get this far.\n\n Now we are at the final edges of DarkScript that will enable you to lay waste to The Evil Bob and protect all Bobs of Bobniverse.\n\n However, if you do corner The Evil Bob, the dwellers of the Bobniverse, the Bobs should make the final decision about what to do with The Evil Bob...", false);
	this.done = 0;
}

level6.afterUpdate = function(delta){
	var bob = this.getCharacterByName("Bob").arr[0];
	if(this.done == 0 && this.gameFocus != this.FOCUS_TUTORIAL){
		bob.sayTime = 0;
		this.showTutorial("And that's exactly what we will look at in this Chapter!\n\n Allowing Bobs to make choices in the situations that they face. Bobcisions. However, in order to allow Bobs to make logical Decsions you'll need logical Bobperators.", false);
		this.done = 1;
	}


if(this.done == 1 && this.gameFocus != this.FOCUS_TUTORIAL){
		this.showTutorial("To enable Bobcisions, one must apply the If structure like so: \n\n  If (Conditional Statement)\n<c>{Command;}\n\n The Conditional Statement can be treated like the exact same statements as the ones you saw in Bloops. \n\nBut there are more to conditional statements than what you have already seen...", false);

		this.done = 2;
	}

if(this.done == 2 && this.gameFocus != this.FOCUS_TUTORIAL){
		this.showTutorial("Introducing...Blogical Bobperators which include: \n\n <, >, ==, !=, ||, &&\n\n I shall explain slowly each and every Blogical Bobperator. ", false);

		this.done = 3;
	}	

if(this.done == 3 && this.gameFocus != this.FOCUS_TUTORIAL){
		this.showTutorial("First, the < (less than) and > (greater than) Blogical Bobperators, ones you have observed and seen already.\n\n They compare two values and will return whether the conditional statement such as: \n\n 5 < 10 \n\n is true or false. ", false);

		this.done = 4;
	}

if(this.done == 4 && this.gameFocus != this.FOCUS_TUTORIAL){
		this.showTutorial("Next we have == (equal to) and != (not equal to).\n\n They check if the values are what they represent.\n For example: \n\n if(5 == 4){commands;} \n\n would return false and instead: \n\n if(5 != 4){commands;}\n\n would return true allowing the execution of the commands.", false);

		this.done = 5;
	}

if(this.done == 5 && this.gameFocus != this.FOCUS_TUTORIAL){
		this.showTutorial("Then there is the || (or) which does not do a comparison, but instead checks two conditional statements.\n\n Used in an If structure it will look like this: \n\nif((5 < 10) || (5 > 10)){Commands;} \n\n The || looks to see if the left and right of itself returns a true.\n\n If at least one of the two statements is true (Though it can be used with multiple statements). Then the overall statement is also true. ", false);

		this.done = 6;
	}

if(this.done == 6 && this.gameFocus != this.FOCUS_TUTORIAL){
		this.showTutorial("Lastly the && (and) which acts like the || but instead looks to see if both sides are true.\n\n  Both sides must be true otherwise it will overall return a false. ", false);

		this.done = 7;
	}

if(this.done == 7 && this.gameFocus != this.FOCUS_TUTORIAL){
		this.showTutorial("Therefore, using Blogical Bobperators along with the If Structure, you can make commands trigger after allowing Bob to make a Bobcision.\n\n", false);

		this.done = 8;
	}

if(this.done == 8 && this.gameFocus != this.FOCUS_TUTORIAL){
		this.showTutorial("But that's not all! Sometimes you might need a second set of commands to adapt to a certain situation.\n\n In that case, you need the If Else Structure.\n\n ", false);

		this.done = 9;
	}

if(this.done == 9 && this.gameFocus != this.FOCUS_TUTORIAL){
		this.showTutorial("The If Else Structure allows two sets of commands like this: \n\n<c>if(conditional Statement){commands;} \nelse {command}\n\n this means that if the conditional statement fails, then it will automatically trigger the second set of commands!\n ", false);

		this.done = 10;
	}	

if(this.done == 10 && this.gameFocus != this.FOCUS_TUTORIAL){
		this.showTutorial("What if you have more than two situation to account for?\n\n Bob's environment is vast and therefore we need to fully equip all the possibilities for Bob to act safely.\n\n Such situations require the If Else If Structure.\n", false);

		this.done = 11;
	}

if(this.done == 11 && this.gameFocus != this.FOCUS_TUTORIAL){
		this.showTutorial("The If-Else If Structure enables you to set a second set of conditional statements or more! The structure flows like this: \n\n if(Conditional Statement){commands;}\nelse if(Second Conditional Statement){Commands;}\n\n you can also add in an 'else' at the end.", false);

		this.done = 12;
	}

if(this.done == 12 && this.gameFocus != this.FOCUS_TUTORIAL){
		this.showTutorial("Now that you understand how to make Bobcisions and the use of Blogical Bobperators.\n\n  Keep your head held High with your eyes gazing upon the bright future of all Bob counting on you.\n\n", false);

		this.done = 13;
	}

if(this.done == 13 && this.gameFocus != this.FOCUS_TUTORIAL){
		this.showTutorial("Lets try out what we have learnt.\n\n Create a new function in the spellbook:\n\n function bobsOpinions(){var word = \"BOB\";\nif(word  == \"BOB\")\n{bob().say(\"Good Word!\")}\nelse{bob().say(\"Bad Word!\")}}\n\n Click done and try the function!!", true);
		this.gameFocus = this.FOCUS_SPELLBOOK;

		this.done = 14;
	}
	
if(this.done == 14 && this.gameFocus != this.FOCUS_SPELLBOOK && bob.sayTime>0){
		this.showTutorial("Well done The Great Bob, you've done splendidly and words will not contain enough gratitude towards the great deeds you will do in the future.\n\n  I bid you Godspeed as Bob the Narrator and Good luck against The Evil Bob...The battle has only just begun\n", false);

		this.done = 15;
	}

	
}