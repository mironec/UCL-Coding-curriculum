//GameObject Class
var GameObject = function(x,y){
	this.x = x;
	this.y = y;
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

GameObject.prototype.update = function(delta){}

//Character Class, inherits GameObject
var Character = function(name,x,y){
	GameObject.call(this,x,y);
	
	this.name = name;
	this.moveX = x;
	this.moveY = y;
	this.moveSpeed = 100;
	this.image = new Image();
}

Character.prototype = Object.create(GameObject.prototype);
Character.prototype.constructor = GameObject;

Character.prototype.moveTo = function(x,y){
	this.moveX = x;
	this.moveY = y;
}

Character.prototype.update = function(delta){
	var desireX = this.moveX - this.x;
	var desireY = this.moveY - this.y;
	
	var desireDist = Math.sqrt(desireX*desireX + desireY*desireY);
	if(desireDist == 0) return;
	var realDist = Math.min(delta * this.moveSpeed/1000, desireDist);
	
	this.x += realDist/desireDist * desireX;
	this.y += realDist/desireDist * desireY;
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