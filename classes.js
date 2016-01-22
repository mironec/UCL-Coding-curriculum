var Character = function(name,x,y){
	this.init(name,x,y);
}

Character.prototype.init = function(name,x,y){
	this.name = name;
	this.x=x;
	this.y=y;
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