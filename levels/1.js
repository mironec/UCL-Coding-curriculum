var level1 = new Level(null, null);

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
	
	//this.showTutorial("Welcome to the game! Go 300 pixels south.", true);
	this.done = 3;
}

level1.afterUpdate = function(delta){
	var bob = this.getCharacterByName("Bob").arr[0];
	if(this.done == 0 && bob.x == 0 && bob.y == 300){
		this.showTutorial("Good job!", false);
		this.done = 1;
	}
	
	if(this.done == 1 && this.gameFocus != this.FOCUS_TUTORIAL){
		this.showTutorial("You can also do calculations! Try writing say(3+5).", true);
		this.done = 2;
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
	}
}