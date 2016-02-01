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
var Character = function(name,x,y){
	GameObject.call(this,x,y);
	
	this.name = name;
	this.orders = [];
	this.width = 64;
	this.height = 64;
	this.moveSpeed = 100;
	this.image = new Image();
}

Character.prototype = Object.create(GameObject.prototype);
Character.prototype.constructor = GameObject;

Character.prototype.moveTo = function(x,y){
	this.orders.push(new Order("move",{x: x, y: y}));
	/*if(arguments.length == 2){
		var dx, dy;
		if(arguments[0].toString().endsWith('r'))
			dx = this.x + parseFloat(arguments[0].substring(0,arguments[0].length-1));
		else
			dx = parseFloat(arguments[0]);
		
		if(arguments[1].toString().endsWith('r'))
			dy = this.y + parseFloat(arguments[1].substring(0,arguments[1].length-1));
		else
			dy = parseFloat(arguments[1]);
		
		this.moveToAbsolute(dx,dy);
	}*/
}

Character.prototype.move = function(rx,ry){
	var tx = this.x; var ty = this.y;
	this.orders.push(new Order("move",{x: tx+rx, y: ty+ry}));
}

Character.prototype.chopTree = function(tree){
	this.orders.push(new Order("move",{x: tree.x, y: tree.y}));
	this.orders.push(new Order("chop",{tree: tree}));
}

/*Character.prototype.moveToAbsolute = function(x,y){
	this.moveX = x;
	this.moveY = y;
}*/

Character.prototype.update = function(delta){
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
	return (this.imgReady[name]===undefined || this.imgReady[name] == false) ? null : this.repo[name];
}