var Level = function(ctx, imageRepository){
	this.keysDown = {};
	this.mouseButtonsDown = {};
	
	this.ctx = ctx;
	this.thingsToDraw = [];
	this.gameObjects = [];
	
	this.FOCUS_GAME = 0;
	this.FOCUS_SCRIPT_BAR = 1;
	this.FOCUS_TUTORIAL = 2;
	this.FOCUS_SPELLBOOK = 3;
	this.gameFocus = this.FOCUS_GAME;
	this.scriptBar = "";
	this.scriptPointer = 0;
	this.tutorialText = "";
	this.persistTutorial = false;
	
	this.characters = new CharacterList();
	this.imageRepository = imageRepository;
	this.map = new Map(imageRepository);
	
	this.camera = {
		x: 0.0,
		y: 0.0
	}
	this.startClick = {
		x: 0.0,
		y: 0.0
	}
	
	this.spellbook = new Spellbook();
	
	this.allowedFunctions = [];
	this.allowedFunctions.push(new GameFunction("getCharacterByName","currentLevel."));
	this.allowedFunctions.push(new GameFunction("getNearestTree",""));
}

Level.prototype.setCtx = function(ctx){
	this.ctx = ctx;
}

Level.prototype.setImageRepository = function(imageRepo){
	this.imageRepository = imageRepo;
	this.map.imageRepository = imageRepo;
}

Level.prototype.start = function(){
	var parentLevel = this;
	window.addEventListener("keydown", function (e) {
		parentLevel.onKeyDown(e);
	}, false);
	window.addEventListener("keypress", function (e) {
		parentLevel.onKeyPress(e);
	}, false);
	window.addEventListener("keyup", function (e) {
		parentLevel.onKeyUp(e);
	}, false);
	
	window.addEventListener("mousedown", function (e){
		parentLevel.onMouseDown(e.pageX-canvas.offsetLeft, e.pageY-canvas.offsetTop, e.button);
	}, false);
	window.addEventListener("mousemove", function (e){
		parentLevel.onMouseMove(e.pageX-canvas.offsetLeft, e.pageY-canvas.offsetTop, e.button);
	}, false);
	window.addEventListener("mouseup", function (e){
		parentLevel.onMouseUp(e.pageX-canvas.offsetLeft, e.pageY-canvas.offsetTop, e.button);
	}, false);
	
	this.afterStart();
}

Level.prototype.afterStart = function(){
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
}

Level.prototype.onKeyDown = function(e){
	var kc = e.key || e.keyCode;
	this.keysDown[kc] = true;
	
	if(this.gameFocus == this.FOCUS_SCRIPT_BAR && (kc == 8 || kc == 46 || kc == "Backspace" || kc == "Delete")) {
		e.preventDefault();
		
		this.onKeyPress(e);
	}
	
	if(this.gameFocus == this.FOCUS_SPELLBOOK) this.spellbook.keyDown(kc);
	if(this.gameFocus == this.FOCUS_SPELLBOOK && (kc == 8 || kc == 46 || kc == "Backspace" || kc == "Delete")){
		e.preventDefault();
		
		this.onKeyPress(e);
	}
}

Level.prototype.onKeyUp = function(e){
	var kc = e.key || e.keyCode;
	this.keysDown[kc] = false;
	
	if(kc == 37){ 		//Left arrow key
		this.scriptPointer--;
		if(this.scriptPointer < 0) this.scriptPointer = 0;
	}
	
	if(kc == 39){ 		//Right arrow key
		this.scriptPointer++;
		if(this.scriptPointer > this.scriptBar.length) this.scriptPointer = this.scriptBar.length;
	}
}

Level.prototype.onKeyPress = function(e){
	var kc = e.key || e.keyCode;
	if(13 == kc || 10 == kc || "Enter" == kc){
		if(this.gameFocus == this.FOCUS_GAME) {this.gameFocus=this.FOCUS_SCRIPT_BAR; this.scriptBar = ""; this.scriptPointer=0;}
		else if(this.gameFocus == this.FOCUS_SCRIPT_BAR) {
			this.gameFocus=this.FOCUS_GAME;
			this.executeScipt(this.scriptBar);
		}
		else if(this.gameFocus == this.FOCUS_TUTORIAL) {
			this.gameFocus = this.FOCUS_GAME;
		}
		else if(this.gameFocus == this.FOCUS_SPELLBOOK){
			this.spellbook.keyPressed(kc);
		}
	}
	
	else if(this.gameFocus == this.FOCUS_SCRIPT_BAR && kc != 10 && kc != 13 && kc != "Enter"){
		if(kc == 8 || kc == "Backspace") {
			this.scriptBar = this.scriptBar.substring(0,this.scriptPointer-1) + this.scriptBar.substring(this.scriptPointer);
			this.scriptPointer--;
		}
		else{
			this.scriptBar = this.scriptBar.substring(0,this.scriptPointer) + ((typeof kc === "string") ? kc : String.fromCharCode(kc)) + this.scriptBar.substring(this.scriptPointer);
			//this.scriptBar += ((typeof kc === "string") ? kc : String.fromCharCode(kc));
			this.scriptPointer++;
		}
	}
	
	else if(this.gameFocus == this.FOCUS_SPELLBOOK){
		this.spellbook.keyPressed(kc);
	}
}

Level.prototype.executeScipt = function(script){
	var ok = false;
	for(i=0;i<this.allowedFunctions.length;i++){
		if(script.startsWith(this.allowedFunctions[i].getName())) ok=true;
		script = script.replace(new RegExp(this.allowedFunctions[i].getName(),"g"), this.allowedFunctions[i].getHelpingNamespace()+this.allowedFunctions[i].getName());
	}
	ok = true;
	if(ok)
		eval(script);
}

Level.prototype.onMouseDown = function(x, y, b){
	this.startClick.x = x;
	this.startClick.y = y;
	this.mouseButtonsDown[b] = true;
}

Level.prototype.onMouseUp = function(x, y, b){
	this.camera.x += this.startClick.x-x;
	this.camera.y += this.startClick.y-y;
	delete this.mouseButtonsDown[b];
}

Level.prototype.onMouseMove = function(x, y, b){
	if(!(b in this.mouseButtonsDown)) return;
	this.camera.x += this.startClick.x-x;
	this.camera.y += this.startClick.y-y;
	this.startClick.x=x;
	this.startClick.y=y;
}

Level.prototype.draw = function(delta){
	var c = this.ctx;
	
	c.fillStyle = "#000000";
	c.fillRect(0,0,canvas.width,canvas.height);
	c.save();
	c.translate(Math.round(canvas.width/2), Math.round(canvas.height/2));
	c.translate(-this.camera.x, -this.camera.y);
	
	this.map.draw(ctx);
	
	c.save();
	c.translate(0,0);
	for(i=0;i<this.thingsToDraw.length;i++){
		this.thingsToDraw[i].draw(c);
	}
	c.restore();
	
	c.restore();
	
	if(this.gameFocus == this.FOCUS_SCRIPT_BAR){
		c.fillStyle = "rgba(0,0,0,0.3)";
		c.fillRect(0,canvas.height-18,canvas.width, 18);
		c.fillStyle = "rgba(255,255,255,0.7)";
		c.font="14px Arial";
		c.fillText(this.scriptBar,5,canvas.height-4);
		if(Math.floor(Date.now()/250) % 2 == 0)
			c.fillRect(c.measureText(this.scriptBar.substring(0,this.scriptPointer)).width+5,canvas.height-15,1,14);
	}
	if((this.gameFocus == this.FOCUS_TUTORIAL || this.persistTutorial) && this.spellbook.isHidden()){
		c.fillStyle = "rgba(0,0,0,0.3)";
		c.fillRect(canvas.width/2 - 200, 10, 400, 200);
		
		c.fillStyle = "rgba(255,255,255,0.7)";
		c.font="14px Arial";
		c.fillText(this.tutorialText,canvas.width/2-180,30);
	}
	if(this.gameFocus == this.FOCUS_SPELLBOOK || !this.spellbook.isHidden()){
		c.save();
		c.translate(0,canvas.height-200);
		this.spellbook.draw(c);
		c.restore();
	}
}

Level.prototype.update = function(delta){
	this.characters.update(delta);
	this.afterUpdate(delta);
}

Level.prototype.afterUpdate = function(delta){}

Level.prototype.getCharacterByName = function(name){
	var retCharacterList = new CharacterList();
	var func = function(){if(this.name == name) retCharacterList.add(this);}
	this.characters.forEach(func);
	return retCharacterList;
}

Level.prototype.addCharacter = function(character){
	this.characters.add(character);
	this.thingsToDraw.push(character);
	this.gameObjects.push(character);
}

Level.prototype.showTutorial = function(s, persist){
	if(!persist) this.gameFocus = this.FOCUS_TUTORIAL;
	this.tutorialText = s;
	this.persistTutorial = persist;
}

Level.prototype.showSpellbook = function(){
	this.spellbook.show = true;
	this.gameFocus = this.FOCUS_SPELLBOOK;
}

Level.prototype.getNearestTreeTo = function(character){
	if(character instanceof CharacterList) character=character.arr[0];
	var closestDist = 1000*1000*1000;
	var closestTree = null;
	
	for(i=0;i<this.gameObjects.length;i++){
		if(this.gameObjects[i] instanceof Tree && this.gameObjects[i].isAlive() ){
			var thisDist = this.gameObjects[i].distanceTo(character);
			if(thisDist < closestDist){
				closestDist = thisDist;
				closestTree = this.gameObjects[i];
			}
		}
	}
	
	return closestTree;
}