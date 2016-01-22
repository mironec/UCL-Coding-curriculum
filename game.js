var canvas;
var ctx;

var lastMainLoopTime;
var keysDown = {};
var mouseButtonsDown = {};

var drawCycle = 0;
var thingsToDraw = [];
var grassPattern1, grassPattern2;

var camera = {
	x: 0.0,
	y: 0.0
};
var startClick = {
	x: 0.0,
	y: 0.0
};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

addEventListener("mousedown", function (e){
	onMouseDown(e.pageX-canvas.offsetLeft, e.pageY-canvas.offsetTop, e.button);
}, false);

addEventListener("mousemove", function (e){
	onMouseMove(e.pageX-canvas.offsetLeft, e.pageY-canvas.offsetTop, e.button);
}, false);

addEventListener("mouseup", function (e){
	onMouseUp(e.pageX-canvas.offsetLeft, e.pageY-canvas.offsetTop, e.button);
}, false);

function onMouseDown(x, y, b){
	startClick.x = x;
	startClick.y = y;
	mouseButtonsDown[b] = true;
}

function onMouseUp(x, y, b){
	camera.x += x-startClick.x;
	camera.y += y-startClick.y;
	delete mouseButtonsDown[b];
}

function onMouseMove(x, y, b){
	if(!(b in mouseButtonsDown)) return;
	camera.x += x-startClick.x;
	camera.y += y-startClick.y;
	startClick.x=x;
	startClick.y=y;
}

function init(){
	canvas = document.getElementById("gameCanvas");
	if(canvas==null){
		setTimeout(function(){init();},0);
	}
	else{
		ctx = canvas.getContext("2d");
		if(ctx==null) document.write("Your browser does not support HTML5 Canvas.");
		else {
			var scrollbarWidth = getScrollbarWidth();
			canvas.width = document.body.clientWidth-scrollbarWidth;
			canvas.height = document.body.clientHeight-scrollbarWidth;
			
			var image = new Image();
			image.onload = function(){
				grassPattern1 = ctx.createPattern(image, "repeat");
			}
			image.src = "images/Grass1.png";
			
			var image2 = new Image();
			image2.onload = function(){
				grassPattern2 = ctx.createPattern(image2, "repeat");
			}
			image2.src = "images/Grass2.png";
			
			mainLoop();
		}
	}
}

function draw(delta){
	var seed = 3824723.4358;
	var pseudoRand = seed;
	
	ctx.fillStyle = "#000000";
	ctx.fillRect(0,0,canvas.width,canvas.height);
	ctx.save();
	ctx.translate(camera.x, camera.y);
	
	for(x=-canvas.width;x<canvas.width;x+=64){
		for(y=-canvas.height;y<canvas.height;y+=64){
			pseudoRand = ('0.'+Math.sin(pseudoRand).toString().substr(6));
			if(pseudoRand<0.5 && grassPattern1) ctx.fillStyle = grassPattern1;
			else if(pseudoRand>=0.5 && grassPattern2) ctx.fillStyle = grassPattern2;
			else ctx.fillStyle = "#009900";
			ctx.fillRect(x,y,64,64);
		}
	}
	
	
	
	ctx.save();
	ctx.translate(canvas.width/2,canvas.height/2);
	for(i=0;i<thingsToDraw.length;i++){
		thingsToDraw[i].draw(ctx);
	}
	ctx.restore();
	
	ctx.restore();
	ctx.fillStyle = "#000000";
	ctx.fillText(drawCycle,10,10);
	drawCycle++;
}

function update(delta){
	if(38 in keysDown){
		otherColor = true;
	}
	else otherColor = false;
}

var mainLoop = function(){
	var now = Date.now();
	var delta = now - lastMainLoopTime;

	update(delta);
	draw(delta);

	lastMainLoopTime = now;
	
	requestAnimationFrame(mainLoop);
}

var bob = new Character("Bob",0,0);
bob.loadImage('images/bob.png');
thingsToDraw.push(bob);

lastMainLoopTime = Date.now();
init();
