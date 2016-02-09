var level1 = new Level(null, null);

level1.afterStart = function(){
	var seed = 3824723.4358;
	var pseudoRand = seed;
	var b = [];
	for(i=0;i<40;i++){
		var a = [];
		for(j=0;j<40;j++){
			pseudoRand = ('0.'+Math.sin(pseudoRand).toString().substr(6));
			a.push({type: "grass", variation: (pseudoRand>0.5 ? 2 : 1)});
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
	
	this.gameFocus = this.FOCUS_TUTORIAL;
	this.tutorialText = "Welcome to the game! Go 300 pixels south.";
	this.done = 0;
}

level1.afterUpdate = function(delta){
	var bob = this.getCharacterByName("Bob").arr[0];
	if(bob.x == 0 && bob.y == 300 && this.done == 0){
		this.gameFocus = this.FOCUS_TUTORIAL;
		this.tutorialText = "Good job!";
		this.done = 1;
	}
}