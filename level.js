var Level = function(ctx, imageRepository){
	this.keysDown = {};
	this.mouseButtonsDown = {};
	this.ctx = ctx;
	this.thingsToDraw = [];
	this.grassPattern1 = null;
	this.grassPattern2 = null;
	this.FOCUS_GAME = 0;
	this.FOCUS_SCRIPT_BAR = 1;
	this.gameFocus = this.FOCUS_GAME;
	this.scriptBar = "";
	this.characters = new CharacterList();
	this.imageRepository = imageRepository;
	this.camera = {
		x: 0.0,
		y: 0.0
	}
	this.startClick = {
		x: 0.0,
		y: 0.0
	}
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
	
	this.grassPattern1 = this.ctx.createPattern(this.imageRepository.getImage('grass1'), "repeat");
	this.grassPattern2 = this.ctx.createPattern(this.imageRepository.getImage('grass2'), "repeat");
	
	var bob = new Character("Bob",0,0);
	bob.getImageFromRepo('bob',this.imageRepository);
	this.addCharacter(bob);
	
	var tree1 = new Tree(300,0,this.imageRepository.getImage('tree1'),this.imageRepository.getImage('stump1'));
	this.thingsToDraw.push(tree1);
}

Level.prototype.onKeyDown = function(e){
	this.keysDown[e.keyCode] = true;
	
	if(this.gameFocus == this.FOCUS_SCRIPT_BAR && (e.keyCode == 8 || e.keyCode == 46)) {
		e.preventDefault();
		
		this.onKeyPress(e);
	}
}

Level.prototype.onKeyUp = function(e){
	delete this.keysDown[e.keyCode];
}

Level.prototype.onKeyPress = function(e){
	//alert(e.keyCode);
	if(13 == e.keyCode || 10 == e.keyCode){
		if(this.gameFocus == this.FOCUS_GAME) {this.gameFocus=this.FOCUS_SCRIPT_BAR; this.scriptBar = "";}
		else if(this.gameFocus == this.FOCUS_SCRIPT_BAR) {
			this.gameFocus=this.FOCUS_GAME;
			eval(this.scriptBar);
		}
	}
	
	if(this.gameFocus == this.FOCUS_SCRIPT_BAR && e.keyCode != 10 && e.keyCode != 13){
		if(e.keyCode == 8) this.scriptBar=this.scriptBar.substring(0,this.scriptBar.length-1);	//Backspace
		//else if(keyCode == 46) scriptBar=scriptBar.substring(1,scriptBar.length);	//Delete
		else this.scriptBar += String.fromCharCode(e.keyCode);
	}
}

Level.prototype.onMouseDown = function(x, y, b){
	this.startClick.x = x;
	this.startClick.y = y;
	this.mouseButtonsDown[b] = true;
}

Level.prototype.onMouseUp = function(x, y, b){
	this.camera.x += x-this.startClick.x;
	this.camera.y += y-this.startClick.y;
	delete this.mouseButtonsDown[b];
}

Level.prototype.onMouseMove = function(x, y, b){
	if(!(b in this.mouseButtonsDown)) return;
	this.camera.x += x-this.startClick.x;
	this.camera.y += y-this.startClick.y;
	this.startClick.x=x;
	this.startClick.y=y;
}

Level.prototype.draw = function(delta){
	var seed = 3824723.4358;
	var pseudoRand = seed;
	var c = this.ctx;
	
	c.fillStyle = "#000000";
	c.fillRect(0,0,1000,1000);
	c.save();
	c.translate(this.camera.x, this.camera.y);
	
	for(x=-1280;x<1280*2;x+=64){
		for(y=-1280;y<1280*2;y+=64){
			pseudoRand = ('0.'+Math.sin(pseudoRand).toString().substr(6));
			if(pseudoRand<0.5 && this.grassPattern1) c.fillStyle = this.grassPattern1;
			else if(pseudoRand>=0.5 && this.grassPattern2) c.fillStyle = this.grassPattern2;
			else c.fillStyle = "#009900";
			c.fillRect(x,y,64,64);
		}
	}
	
	
	
	c.save();
	c.translate(canvas.width/2,canvas.height/2);
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
	}
}

Level.prototype.update = function(delta){
	this.characters.update(delta);
}

Level.prototype.getCharacter = function(name){
	var retCharacterList = new CharacterList();
	var func = function(){if(this.name == name) retCharacterList.add(this);}
	this.characters.forEach(func);
	return retCharacterList;
}

Level.prototype.addCharacter = function(character){
	this.characters.add(character);
	this.thingsToDraw.push(character);
}