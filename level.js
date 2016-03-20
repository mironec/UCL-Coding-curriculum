function Level (ctx, imageRepository){
	this.keysDown = {};
	this.mouseButtonsDown = {};
	
	this.ctx = ctx;
	this.dummyCanvas=document.createElement('canvas');
	this.dummyCtx=this.dummyCanvas.getContext('2d');
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

	this.allowedFunctions = [];
	this.allowedFunctions.push(new GameFunction("getCharacterByName","currentLevel."));
	this.allowedFunctions.push(new GameFunction("getNearestTree",""));
	
	this.spellbook = new Spellbook(this.allowedFunctions);
	this.spellbook.hideFunc = this.hideSpellbook;
	this.spellbook.hideArg = this;
	
	this.spellbook.tabs[0].lines[0]="function bob(){return getCharacterByName('Bob');}";
	this.spellbook.saveText();
	this.spellbook.tabs.push(new SpellbookTab("2"));
	this.spellbook.tabs[1].lines[0]="function square(){bob().move(0,1); bob().move(1,0); bob().move(0,-1); bob().move(-1,0,square);}";
	this.spellbook.pointerTab = 1;
	this.spellbook.saveText();
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
	window.addEventListener("keydown", this.onKeyDownE = function (e) {
		parentLevel.onKeyDown(e);
	}, false);
	window.addEventListener("keypress", this.onKeyPressE = function (e) {
		parentLevel.onKeyPress(e);
	}, false);
	window.addEventListener("keyup", this.onKeyUpE = function (e) {
		parentLevel.onKeyUp(e);
	}, false);
	
	window.addEventListener("mousedown", this.onMouseDownE = function (e){
		parentLevel.onMouseDown(e.pageX-canvas.offsetLeft, e.pageY-canvas.offsetTop, e.button);
	}, false);
	window.addEventListener("mousemove", this.onMouseMoveE = function (e){
		parentLevel.onMouseMove(e.pageX-canvas.offsetLeft, e.pageY-canvas.offsetTop, e.button);
	}, false);
	window.addEventListener("mouseup", this.onMouseUpE = function (e){
		parentLevel.onMouseUp(e.pageX-canvas.offsetLeft, e.pageY-canvas.offsetTop, e.button);
	}, false);
	
	this.afterStart();
}

Level.prototype.destroy = function(){
	window.removeEventListener("keydown", this.onKeyDownE);
	window.removeEventListener("keypress", this.onKeyPressE);
	window.removeEventListener("keyup", this.onKeyUpE);

	window.removeEventListener("mousedown", this.onMouseDownE);
	window.removeEventListener("mousemove", this.onMouseMoveE);
	window.removeEventListener("mouseup", this.onMouseUpE);
}

Level.prototype.afterStart = function(){
	var seed = 3824723.4358;
	var pseudoRand = seed;
	var b = [];
	for(var i=0;i<40;i++){
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
		if(kc == 46 || kc == "Delete") this.scriptBarDeleteAfterCursor();
		e.preventDefault();
		
		if(kc != 46 && kc != "Delete")
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

Level.prototype.scriptBarDeleteAfterCursor = function(){
	if(this.scriptPointer < this.scriptBar.length)
		this.scriptBar = this.scriptBar.substring(0,this.scriptPointer) + this.scriptBar.substring(this.scriptPointer+1);
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
			if(this.scriptPointer<0) this.scriptPointer=0;
		}
		else{
			this.scriptBar = this.scriptBar.substring(0,this.scriptPointer) + ((typeof kc === "string") ? kc : String.fromCharCode(kc)) + this.scriptBar.substring(this.scriptPointer);
			this.scriptPointer++;
		}
	}
	
	else if(this.gameFocus == this.FOCUS_SPELLBOOK && kc != 46){
		this.spellbook.keyPressed(kc);
	}
}

Level.prototype.fixFunction = function(i){
	
}

Level.prototype.executeScipt = function(script){
	var ok = false;
	for(var i=0;i<this.allowedFunctions.length;i++){
		if(script.startsWith(this.allowedFunctions[i].getName())) ok=true;
		script = script.replace(new RegExp(this.allowedFunctions[i].getName(),"g"), this.allowedFunctions[i].getHelpingNamespace()+this.allowedFunctions[i].getName());
	}
	ok = true;
	if(ok){
		for(var i=0;i<this.spellbook.tabs.length;i++){
			script = script.replace(new RegExp(this.spellbook.tabs[i].name+"\\(\\)","g"), "currentLevel.spellbook.functions["+i+"].apply(currentLevel)");
			script = script.replace(new RegExp(this.spellbook.tabs[i].name+"\\(","g"), "currentLevel.spellbook.functions["+i+"].apply(currentLevel,");
		}

		var greatFunc = new Function(script);
		greatFunc.apply();
	}
}

Level.prototype.onMouseDown = function(x, y, b){
	this.startClick.x = x;
	this.startClick.y = y;
	this.mouseButtonsDown[b] = true;
	
	if(this.gameFocus == this.FOCUS_SPELLBOOK){this.spellbook.mouseClick(x,y-canvas.height+200);}
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
	
	this.map.draw(c, -this.camera.x, -this.camera.y, canvas);
	
	c.save();
	c.translate(0,0);
	for(var i=0;i<this.thingsToDraw.length;i++){
		this.thingsToDraw[i].draw(c);
	}
	c.restore();
	
	c.restore();
	
	if(this.gameFocus == this.FOCUS_SCRIPT_BAR){
		var fontSize = 18;
		c.fillStyle = "rgba(0,0,0,0.3)";
		c.fillRect(0,canvas.height-18,canvas.width, fontSize+4);
		c.fillStyle = "rgba(255,255,255,0.7)";
		c.font= fontSize + "px Consolas";
		c.fillText(this.scriptBar,5,canvas.height-3);
		if(Math.floor(Date.now()/250) % 2 == 0)
			c.fillRect(c.measureText(this.scriptBar.substring(0,this.scriptPointer)).width+5,canvas.height-fontSize-1,1,fontSize);
	}
	if(this.gameFocus == this.FOCUS_TUTORIAL || this.persistTutorial){
		c.fillStyle = "rgba(0,0,0,0.3)";
		c.fillRect(canvas.width/2 - 200, 10, 400, 200);
		
		c.fillStyle = "rgba(255,255,255,0.7)";
		var a = this.tutorialText.split("\n");
		for(var i=0;i<a.length;i++){
			c.font="14px Arial";
			if(a[i].startsWith('<c>')){
				c.font="14px Consolas";
				c.fillText(a[i].substring(3),canvas.width/2-c.measureText(a[i].substring(3)).width/2,30+i*15);
			}
			else 
				c.fillText(a[i],canvas.width/2-c.measureText(a[i]).width/2,30+i*15);
		}
	}
	if(this.gameFocus == this.FOCUS_SPELLBOOK || !this.spellbook.isHidden()){
		c.save();
		c.translate(0,canvas.height-200);
		this.spellbook.draw(c);
		c.restore();
	}
}

Level.prototype.update = function(delta){
	for(var i = 0; i <  this.gameObjects.length; i++){
		this.gameObjects[i].update(delta);
	}

	this.afterUpdate(delta);
}

Level.prototype.afterUpdate = function(delta){return delta;}

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
	
	var index = 0, newIndex, strAcc = "", strRes = "";
	while(index < this.tutorialText.length){
		newIndex = this.tutorialText.indexOf(" ", index);
		var newLine = this.tutorialText.indexOf("\n", index);
		if(newIndex == -1) newIndex = this.tutorialText.length;
		if(newLine != -1 && newLine < newIndex){newIndex = newLine;}
		var newStr = this.tutorialText.substring(index, newIndex);
		
		this.dummyCtx.font = "14px Arial";
		
		if(newLine == newIndex){
			strAcc += newStr;
			strRes += strAcc + "\n";
			strAcc = "";
		}
		else if(this.dummyCtx.measureText(strAcc).width + this.dummyCtx.measureText(newStr).width > 400){
			strRes += strAcc.substring(0,strAcc.length-1) + "\n";
			strAcc = newStr + " ";
		}
		else{
			strAcc += newStr + " ";
		}
		index = newIndex+1;
	}
	strRes += strAcc;
	
	this.tutorialText = strRes;
	this.persistTutorial = persist;
}

Level.prototype.showSpellbook = function(){
	this.spellbook.show = true;
	this.gameFocus = this.FOCUS_SPELLBOOK;
}

Level.prototype.hideSpellbook = function(level){
	level.spellbook.show = false;
	level.gameFocus = level.FOCUS_GAME;
}

Level.prototype.getNearestTreeTo = function(character){
	if(character instanceof CharacterList) character=character.arr[0];
	var closestDist = 1000*1000*1000;
	var closestTree = null;
	
	for(var i=0;i<this.gameObjects.length;i++){
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