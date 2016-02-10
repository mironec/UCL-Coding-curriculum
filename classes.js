//GameObject Class
var GameObject = function(x,y){
	this.x = x;
	this.y = y;
	this.width = 0;
	this.height = 0;
	this.image = null;
	this.imageReady = false;
}

GameObject.prototype.draw = function(ctx){
	ctx.save();
	ctx.translate(this.x,this.y);
	if(this.imageReady)
		ctx.drawImage(this.image,0,0);
	ctx.restore();
}

GameObject.prototype.loadImage = function(url){
	var img = new Image();
	var parentGameObject = this;
	img.onload = function(){
		parentGameObject.image = img;
		parentGameObject.imageReady = true;
	}
	this.imageReady = false;
	img.src = url;
}

GameObject.prototype.getImageFromRepo = function(name, repo){
	this.image = repo.getImage(name);
	this.imageReady = true;
}

GameObject.prototype.update = function(delta){}

GameObject.prototype.distanceTo = function(gO){
	var disX = this.x-gO.x;
	var disY = this.y-gO.y;
	return Math.sqrt(disX*disX + disY*disY);
}

var GameFunction = function(name,helpingNamespace){
	this.name = name;
	this.helpingNamespace = helpingNamespace;
}

GameFunction.prototype.getName = function(){ return this.name; }
GameFunction.prototype.getHelpingNamespace = function(){ return this.helpingNamespace; }

var Tile = function(type, variation){
	this.type = type;
	this.variation = variation || 1;
}

Tile.types = [];
Tile.types.push({type: "grass", passable: true});

Tile.prototype.isPassable = function(){
	for(i=0;i<Tile.types.length;i++){
		if(this.type == Tile.types[i].type) return Tile.types[i].passable;
	}
	return false;
}

var Map = function(imageRepository){
	this.beginX = 0;
	this.beginY = 0;
	this.numTilesX = 0;
	this.numTilesY = 0;
	this.tileWidth = 64;
	this.tileHeight = 64;
	this.imageRepository = imageRepository;
	this.tiles = [];
}

Map.prototype.draw = function(ctx){
	ctx.save();
	ctx.translate(this.beginX, this.beginY);
	
	for(i=0;i<this.tiles.length;i++){
		for(j=0;j<this.tiles[i].length;j++){
			ctx.drawImage(this.imageRepository.getImage(this.tiles[i][j].type + this.tiles[i][j].variation), i*this.tileWidth, j*this.tileHeight);
		}
	}
	
	ctx.restore();
}

Map.prototype.ensureSize = function(width, height){
	this.numTilesX = width || this.numTilesX;
	this.numTilesY = height || this.numTilesY;
}

Map.prototype.setPosition = function(x, y){
	this.beginX = x;
	this.beginY = y;
}

Map.prototype.parseTile = function(data,x,y){
	if(this.tiles[x] === undefined) this.tiles[x] = [];
	this.tiles[x][y]=new Tile(data.type, data.variation);
}

Map.prototype.parseMap = function(a){
	for(i=0;i<a.length;i++){
		for(j=0;j<a[i].length;j++){
			this.parseTile(a[i][j],i,j);
		}
	}
	this.ensureSize(a.length,a[0].length);
}

//Tree Class, inherits GameObject
var Tree = function(x,y,aliveImage,deadImage){
	GameObject.call(this,x,y);
	
	this.width = 40;
	this.height = 100;
	this.aliveImage = aliveImage;
	this.deadImage = deadImage;
	this.image = this.aliveImage;
	this.imageReady = true;
	this.alive = true;
}

Tree.prototype = Object.create(GameObject.prototype);
Tree.prototype.constructor = GameObject;

Tree.prototype.draw = function(ctx){
	ctx.save();
	ctx.translate(this.x-this.width/2,this.y-this.height/4);
	if(this.imageReady)
		ctx.drawImage(this.image,0,0);
	ctx.restore();
}

Tree.prototype.fall = function(){
	this.alive = false;
	this.image = this.deadImage;
}

Tree.prototype.isAlive = function(){
	return this.alive;
}

//Character Class, inherits GameObject
var Character = function(name,x,y,parentLevel){
	GameObject.call(this,x,y);
	
	this.parentLevel = parentLevel;
	this.name = name;
	this.orders = [];
	this.width = 64;
	this.height = 64;
	this.moveSpeed = 100;
	this.sayText = "";
	this.sayTime = 0;
	this.image = new Image();
}

Character.prototype = Object.create(GameObject.prototype);
Character.prototype.constructor = GameObject;

Character.prototype.moveTo = function(x,y){
	this.orders.push(new Order("move",{x: x, y: y}));
}

Character.prototype.move = function(rx,ry){
	var tx = this.x; var ty = this.y;
	this.orders.push(new Order("move",{x: tx+rx, y: ty+ry}));
}

Character.prototype.chopTree = function(tree){
	this.orders.push(new Order("move",{x: tree.x, y: tree.y}));
	this.orders.push(new Order("chop",{tree: tree}));
}

Character.prototype.getNearestTree = function(){
	var closestDist = 1000*1000*1000;
	var closestTree = null;
	var gO = this.parentLevel.gameObjects;
	
	for(i=0;i<gO.length;i++){
		if(gO[i] instanceof Tree && gO[i].isAlive() ){
			var thisDist = gO[i].distanceTo(this);
			if(thisDist < closestDist){
				closestDist = thisDist;
				closestTree = gO[i];
			}
		}
	}
	
	return closestTree;
}

Character.prototype.chopNearestTree = function(){
	this.chopTree(this.getNearestTree());
}

Character.prototype.say = function(s){
	this.sayText = s;
	this.sayTime = 5000;
}

Character.prototype.update = function(delta){
	if(this.sayTime > 0){
		this.sayTime -= delta;
	}
	
	if(this.orders.length == 0) return;
	else{
		var curOrder = this.orders[0];
		
		switch(curOrder.getName()){
			case "move":
				var moveX = curOrder.getData().x;
				var moveY = curOrder.getData().y;
				var desireX = moveX - this.x;
				var desireY = moveY - this.y;
				
				var desireDist = Math.sqrt(desireX*desireX + desireY*desireY);
				if(desireDist == 0) {this.orders.shift(); return;}
				var realDist = Math.min(delta * this.moveSpeed/1000, desireDist);
				
				this.x += realDist/desireDist * desireX;
				this.y += realDist/desireDist * desireY;
				break;
			case "chop":
				var tTree = curOrder.getData().tree;
				tTree.fall();
				this.orders.shift();
				break;
		}
	}
}

Character.prototype.draw = function(ctx){
	ctx.save();
	ctx.translate(this.x,this.y);
	if(this.imageReady)
		ctx.drawImage(this.image,0,0);
	if(this.sayTime > 0){
		ctx.font = "14px Arial";
		ctx.fillStyle = "#DDDDDD";
		ctx.fillText(this.sayText, 0, 0);
	}
	ctx.restore();
}

//Order Class
var Order = function(name, data){
	this.name = name;
	this.data = data;
}

Order.prototype.getName = function(){
	return this.name;
}

Order.prototype.getData = function(){
	return this.data;
}

//CharacterList Class
var CharacterList = function(arr){
	this.arr = [];
}

CharacterList.prototype.forEach = function(f){
	for(i=0;i<this.arr.length;i++){
		f.call(this.arr[i]);
	}
}

CharacterList.prototype.chopTree = function(tree){
	for(i=0;i<this.arr.length;i++){
		this.arr[i].chopTree(tree);
	}
}

CharacterList.prototype.getNearestTree = function(){
	return this.arr[0].getNearestTree();
}

CharacterList.prototype.chopNearestTree = function(){
	for(i=0;i<this.arr.length;i++){
		this.arr[i].chopNearestTree();
	}
}

CharacterList.prototype.moveTo = function(x,y){
	for(i=0;i<this.arr.length;i++){
		this.arr[i].moveTo(x,y);
	}
}

CharacterList.prototype.move = function(x,y){
	for(i=0;i<this.arr.length;i++){
		this.arr[i].move(x,y);
	}
}

CharacterList.prototype.say = function(s){
	for(i=0;i<this.arr.length;i++){
		this.arr[i].say(s);
	}
}

CharacterList.prototype.draw = function(ctx){
	for(i=0;i<this.arr.length;i++){
		this.arr[i].draw(ctx);
	}
}

CharacterList.prototype.update = function(delta){
	for(i=0;i<this.arr.length;i++){
		this.arr[i].update(delta);
	}
}

CharacterList.prototype.add = function(character){
	this.arr.push(character);
}

//ImageRepository Class
var ImageRepository = function(){
	this.repo = new Array();
	this.imgReady = new Array();
}

ImageRepository.prototype.loadImage = function(name, url, callback){
	var img = new Image();
	var parentRepo = this;
	img.onload = function(){
		parentRepo.addImage(name,img,callback);
	}
	this.imgReady[name] = false;
	img.src = url;
}

ImageRepository.prototype.loadImages = function(names, urls, callback){
	if(names.length != urls.length) return;
	var calledBack = 0;
	var len = names.length;
	var parentRepo = this;
	for(i=0;i<len;i++){
		parentRepo.loadImage(names[i],urls[i],function(){
			calledBack++;
			if(calledBack == len && callback !== undefined){
				callback();
			}
		});
	}
}

ImageRepository.prototype.addImage = function(name, img, callback){
	this.repo[name] = img;
	this.imgReady[name] = true;
	if(callback !== undefined) callback();
}

ImageRepository.prototype.getImage = function(name){
	return (this.imgReady[name]===undefined || this.imgReady[name] === false) ? null : this.repo[name];
}

var Spellbook = function(){
	this.tabs = [];
	this.tabs.push(new SpellbookTab());
	this.pointerTab = 0;
	this.show = false;
}

Spellbook.prototype.moveCursorRight = function(){
	this.tabs[this.pointerTab].moveCursorRight();
}

Spellbook.prototype.moveCursorLeft = function(){
	this.tabs[this.pointerTab].moveCursorLeft();
}

Spellbook.prototype.keyDown = function(kc){
	if(kc == 37){	//Left arrow key
		this.moveCursorLeft();
	}
	if(kc == 39){	//Right arrow key
		this.moveCursorRight();
	}
}

Spellbook.prototype.keyPressed = function(kc){
	this.tabs[this.pointerTab].keyPressed(kc);
}

Spellbook.prototype.draw = function(ctx){
	ctx.fillStyle = "rgba(0,0,0,0.3)";
	ctx.fillRect(0,0,canvas.width,180);
	
	this.tabs[this.pointerTab].draw(ctx);
}

Spellbook.prototype.isHidden = function(){
	return !this.show;
}

var SpellbookTab = function(){
	this.lines = [];
	this.lines.push("");
	this.pointerX = 0;
	this.pointerY = 0;
}

SpellbookTab.prototype.moveCursorRight = function(){
	this.pointerX++;
	if(this.pointerX>this.lines[this.pointerY].length){
		this.pointerY++;
		if(this.pointerY > this.lines.length-1){this.pointerY--; this.pointerX--;}
		else{this.pointerX = 0;}
	}
}

SpellbookTab.prototype.moveCursorLeft = function(){
	this.pointerX--;
	if(this.pointerX<0){
		this.pointerY--;
		if(this.pointerY < 0){this.pointerY++; this.pointerX++;}
		else{this.pointerX = this.lines[this.pointerY].length;}
	}
}

SpellbookTab.prototype.draw = function(ctx){
	ctx.save();
	ctx.fillStyle = "rgba(255,255,255,0.7)";
	ctx.font = "Arial 14px";
	for(i=0;i<this.lines.length;i++){
		ctx.translate(0,15);
		ctx.fillText(this.lines[i],0,0);
	}
	ctx.restore();
	
	ctx.fillStyle = "rgba(255,255,255,0.7)";
	ctx.fillRect(ctx.measureText(this.lines[this.pointerY].substring(0,this.pointerX)).width, this.pointerY*15+1, 1, 14);
}

SpellbookTab.prototype.keyPressed = function(kc){
	if(kc == 10 || kc == 13 || kc == "Enter"){
		var restOfLine;
		restOfLine = this.lines[this.pointerY].substring(this.pointerX);
		this.lines[this.pointerY] = this.lines[this.pointerY].substring(0,this.pointerX);
		if(this.pointerY == this.lines.length - 1) this.lines.push(restOfLine);
		else this.lines.splice(this.pointerY+1,0,restOfLine);
		this.pointerY++;
		this.pointerX = 0;
	}
	else if(kc == 8 || kc == "Backspace"){
		if(this.pointerX > 0){
			this.lines[this.pointerY] = this.lines[this.pointerY].substring(0,this.pointerX-1) + this.lines[this.pointerY].substring(this.pointerX);
			this.pointerX--;
		}
		else{
			if(this.pointerY > 0){
				this.pointerX = this.lines[this.pointerY-1].length;
				var restOfLine = this.lines[this.pointerY];
				this.lines.splice(this.pointerY, 1);
				this.lines[this.pointerY-1]=this.lines[this.pointerY-1] + restOfLine;
				this.pointerY--;
			}
		}
	}
	else{
		this.lines[this.pointerY] = this.lines[this.pointerY].substring(0,this.pointerX) + ((typeof kc === "string") ? kc : String.fromCharCode(kc)) + this.lines[this.pointerY].substring(this.pointerX);
		this.pointerX++;
	}
}