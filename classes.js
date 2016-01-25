var Character = function(name,x,y){
	this.init(name,x,y);
}

Character.prototype.init = function(name,x,y){
	this.name = name;
	this.x=x;
	this.y=y;
	this.moveX = x;
	this.moveY = y;
	this.moveSpeed = 100;
	this.image = new Image();
	this.imageReady = false;
}

Character.prototype.loadImage = function(url){
	var img = new Image();
	var yolo = this;
	img.onload = function(){
		yolo.image = img;
		yolo.imageReady = true;
	}
	this.imageReady = false;
	img.src = url;
}

Character.prototype.draw = function(ctx){
	ctx.save();
	ctx.translate(this.x,this.y);
	if(this.imageReady)
		ctx.drawImage(this.image,0,0);
	else{
		ctx.fillStyle = "#000000";
		ctx.fillRect(0,0,10,10);
	}
	ctx.restore();
}

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

var CharacterList = function(arr){
	this.init(arr);
}

CharacterList.prototype.init = function(){
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