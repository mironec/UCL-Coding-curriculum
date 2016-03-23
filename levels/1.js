var level1 = new Level(null, null);

level1.moduleName = "level1";

level1.afterStart = function(){
	var seed = 3824723.4358;
	var pseudoRand = seed;
	var b = [];
	for(i=0;i<40;i++){
		var a = [];
		for(j=0;j<40;j++){
			pseudoRand = ('0.'+Math.sin(pseudoRand).toString().substr(6));
            //in order to modify the ratio of each grass, i will first store the random variable and assign a if statement to push the type of grass variation
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
    
    //Forest generation: Takes one random number for position of Trees.

    var totalTrees = 100;
    
    for (var counter = 0; counter< totalTrees;){
    	pseudoRand = ('0.'+Math.sin(pseudoRand).toString().substr(6));
    	var numTrees = Math.floor(pseudoRand*4)+2;

		pseudoRand = ('0.'+Math.sin(pseudoRand).toString().substr(6));
        //Generate random x position 
        var xPos = Math.floor(pseudoRand*31)*64 - 1024;
        pseudoRand = ('0.'+Math.sin(pseudoRand).toString().substr(6));
        var yPos = Math.floor(pseudoRand*31)*64 - 1024;

    	for(var i=0;i<numTrees;i++,counter++){
    		pseudoRand = ('0.'+Math.sin(pseudoRand).toString().substr(6));
	        //Generate random x position 
	        var xPosDelta = Math.floor(pseudoRand*7)*64 - 160;
	        pseudoRand = ('0.'+Math.sin(pseudoRand).toString().substr(6));
	        var yPosDelta = Math.floor(pseudoRand*7)*64 - 160;

	        var x = xPos + xPosDelta;
	        var y = yPos + yPosDelta;

	        if(BoundingBoxClip(x,y,Tree.width,Tree.height,-320,-320,640,640)){
	        	i--; counter--; continue;
	    	}

	    	var a = this.getIntersectingObjects(x,y,Tree.width,Tree.height);
	    	if(a.length > 0){
	    		i--; counter--; continue;
	    	}

	        //create a new tree
	        var tree = new Tree(x, y, this.imageRepository.getImage('tree1'), this.imageRepository.getImage('stump1'));
	        this.addGameObject(tree);
    	}
    }
	
	var bob = new Character("Bob",0,0,this);
	bob.getImageFromRepo('bob',this.imageRepository);
	this.addCharacter(bob);
	
	/*var tree1 = new Tree(300,0,this.imageRepository.getImage('tree1'),this.imageRepository.getImage('stump1'));
	this.addGameObject(tree1);

    var tree2 = new Tree(-1216,-1216,this.imageRepository.getImage('tree1'),this.imageRepository.getImage('stump1'));
    
    var tree3 = new Tree(1216,1216,this.imageRepository.getImage('tree1'),this.imageRepository.getImage('stump1'));
    this.addGameObject(tree2);
    this.addGameObject(tree3);*/
    
	var redberry = new FarmingPatch(-128,-64,PlantType.Redberry);
	this.addGameObject(redberry);
    
    //building a house example
	var houseBL = new BuildingSite(-256, -64, BuildType.HouseBL);
    var houseBR = new BuildingSite(houseBL.x+64, houseBL.y, BuildType.HouseBR);
    var houseTL = new BuildingSite(houseBL.x, houseBL.y-64, BuildType.HouseTL);
    var houseTR = new BuildingSite(houseBL.x+64, houseBL.y-64, BuildType.HouseTR)
    this.addGameObject(houseBL);
    this.addGameObject(houseBR);
    this.addGameObject(houseTL);
    this.addGameObject(houseTR);
    
	this.showTutorial("In the beginning of time, Bob was there.\n\n<Press enter to continue>", false);
	this.done = 0;
}

level1.afterUpdate = function(delta){
	var bob = this.getCharacterByName("Bob").arr[0];
	if(this.done == 0 && this.gameFocus != this.FOCUS_TUTORIAL){
		bob.sayTime = 0;
		this.showTutorial("Bob was given the power of speech. When Bob speaks, he must first identify his own presence. Using:\n\n<c>getCharacterByName(\"Bob\")\n\nTo speak, he must further specify his glorious words:\n\n<c>getCharacterByName(\"Bob\").say(\"Hello World!\")\n\nTry it yourself now, press the 'Enter' key to bring forth \"BOB the console\", your text-to-magic conversion device and type in the above code.", true);
		this.done = 1;
	}
	
	if(this.done == 1 && bob.sayTime > 0){
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
	}
	
	if(this.done == 2 && this.gameFocus != this.FOCUS_TUTORIAL){
		this.showTutorial("When the Bob-niverse was born, the world was created where every Bob would move by x and y co-ordinates.\nTry moving Bob 3 tiles south using:\n\n<c>getCharacterByName(\"Bob\").move(0, 3)", true);
		this.done = 3;
	}
	
	if(this.done == 3 && bob.orders.length == 0 && !(bob.x == 0 && bob.y == 0) ){
		if(bob.x == 0 && bob.y == 3*this.map.tileHeight){
			this.showTutorial("Good job. Now try moving Bob again using move(3, 0).", true);
			this.done = 4;
		}
		else{
			this.showTutorial("That's the wrong way!", false);
			bob.moveTo(0,0);
			this.done = 2;
		}
	}
	
	if(this.done == 4 && bob.orders.length == 0 && !(bob.x == 0 && bob.y == 3*this.map.tileHeight) ){
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
		setLevel(level2);
		currentLevel.save();
	}
}