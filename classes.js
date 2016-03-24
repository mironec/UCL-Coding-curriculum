//GameObject Class
function GameObject(x,y){
	this.x = x;
	this.y = y;
	this.width = 0;
	this.height = 0;
	this.image = null;
	this.imageReady = false;
	this.passable = true;
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

function GameFunction(name,helpingNamespace,replaceBy){
	this.name = name;
	this.helpingNamespace = helpingNamespace;
	this.replaceBy = replaceBy;
}

GameFunction.prototype.getName = function(){ return this.name; }
GameFunction.prototype.getHelpingNamespace = function(){ return this.helpingNamespace; }
GameFunction.prototype.getReplaceBy = function(){ return this.replaceBy || this.name; }

function Tile(type, variation){
	this.type = type;
	this.variation = variation || 1;
}

Tile.types = [];
Tile.types.push({type: "grass", passable: true});

Tile.prototype.isPassable = function(){
	for(var i=0;i<Tile.types.length;i++){
		if(this.type == Tile.types[i].type) return Tile.types[i].passable;
	}
	return false;
}

function Map(imageRepository){
	this.beginX = 0;
	this.beginY = 0;
	this.numTilesX = 0;
	this.numTilesY = 0;
	this.tileWidth = 64;
	this.tileHeight = 64;
	this.imageRepository = imageRepository;
	this.tiles = [];
}

Map.prototype.draw = function(ctx, cameraX, cameraY, canvas){
	ctx.save();
	ctx.translate(this.beginX, this.beginY);
	
	var startX = Math.floor(Math.max(-this.beginX - cameraX - Math.round(canvas.width/2),0)/this.tileWidth);
	var startY = Math.floor(Math.max(-this.beginY - cameraY - Math.round(canvas.height/2),0)/this.tileHeight);

	for(var i=startX;i<this.tiles.length && i<startX+Math.ceil(canvas.width/this.tileWidth)+1;i++){
		for(var j=startY;j<this.tiles[i].length && j<startY + Math.ceil(canvas.height/this.tileHeight)+1;j++){
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
	for(var i=0;i<a.length;i++){
		for(j=0;j<a[i].length;j++){
			this.parseTile(a[i][j],i,j);
		}
	}
	this.ensureSize(a.length,a[0].length);
}

Map.prototype.getPixelWidth = function(){
	return this.numTilesX*this.tileWidth;
}

Map.prototype.getPixelHeight = function(){
	return this.numTilesY*this.tileHeight;
}

function ItemPile(x,y,parentLevel,items){
	GameObject.call(this,x,y);

	this.width = 64;
	this.height = 64;
	this.items = items;
	this.parentLevel = parentLevel;
	this.passable = true;
}

ItemPile.prototype = Object.create(GameObject.prototype);
ItemPile.prototype.constructor = ItemPile;

ItemPile.prototype.draw = function(ctx){
	ctx.save();
	ctx.translate(this.x,this.y);
	if(this.items.length == 1 && this.items[0].getImageReady()){
		ctx.drawImage(this.items[0].getImage(),0,0);
	}
	else if(ItemType._mixed.imageReady){
		ctx.drawImage(ItemType._mixed.image,0,0);
	}
	ctx.restore();
}

ItemPile.prototype.update = function(delta){
	var toDelete = [];
	for(var i=0;i<this.items.length;i++){
		var response = this.items[i].update(delta,this);
		if(response instanceof Object && response.remove !== undefined && response.remove){
			toDelete.push(i);
		}
	}

	for(var i = 0; i < toDelete.length; i++){
		this.items.splice(toDelete[i],1);
	}

	if(this.items.length == 0) return {remove:true};
}

ItemPile.prototype.addItems = function(obj){
	if(obj instanceof Array){
		for(var i = 0;i<obj.length;i++){
			this.addItems(obj[i]);
		}
		return;
	}
	if(obj instanceof Item){
		if(!obj.isStackable())
			this.items.push(obj);
		else{
			for(var i = 0;i < this.items.length;i++){
				if(this.items[i].itemType == obj.itemType){
					this.items[i].quantity += obj.quantity;
					return;
				}
			}
			this.items.push(obj);
		}
	}
}

//Tree Class, inherits GameObject
function Tree(x,y,aliveImage,deadImage){
	GameObject.call(this,x,y);
	
	this.width = Tree.width;
	this.height = Tree.height;
	this.aliveImage = aliveImage;
	this.deadImage = deadImage;
	this.image = this.aliveImage;
	this.imageReady = true;
	this.alive = true;
	this.health = 20;
	this.passable = false;
}

Tree.prototype = Object.create(GameObject.prototype);
Tree.prototype.constructor = Tree;

Tree.width = 40;
Tree.height = 100;

Tree.prototype.draw = function(ctx){
	ctx.save();
	ctx.translate(this.x-this.width/2,this.y-this.height/4);
	if(this.imageReady)
		ctx.drawImage(this.image,0,0);
	ctx.restore();
}

Tree.prototype.chop = function(delta){
	this.health -= delta/1000;
	if(this.health <= 0) {
		this.health = 0;
		this.fall();
		return {remove:true,items:[]};
	}

	if(Math.random()*1000/delta < 1)
		return {remove:false,items:[new Item(ItemType.Log)]};
	return{remove:false,items:[]}
}

Tree.prototype.fall = function(){
	this.alive = false;
	this.image = this.deadImage;
}

Tree.prototype.isAlive = function(){
	return this.alive;
}
//Building Class, inherits GameObject 
function BuildingSite(x, y, buildType){
    GameObject.call(this, x, y);
    
    this.buildStage = 0;
    this.timeInThisBuildStage = 0;
    this.buildType = buildType;
    this.width = 64;
    this.height = 64;
    this.image = buildType.buildStages[0].image;
    this.passable = false;
    if(this.image !== undefined) this.imageReady = true;
}

BuildingSite.prototype = Object.create(GameObject.prototype);
BuildingSite.prototype.constructor = BuildingSite;

BuildingSite.prototype.draw = function(ctx){
    ctx.save();
    ctx.translate(this.x, this.y);
    if(this.imageReady)
        ctx.drawImage(this.image, 0,0);
    ctx.restore();
}

BuildingSite.prototype.update = function(delta){
    this.timeInThisBuildStage += delta;
    if(this.advancesToNextBuildStage(delta)){
        this.setBuildStage(this.buildStage + 1);
        this.timeInThisBuildStage -= this.buildType.buildStages[this.buildStage-1].time;
    }
}

BuildingSite.prototype.setBuildStage = function(stage, resetProgress){
	this.buildStage = stage;
	if(this.buildType.buildStages[this.buildStage].image !== undefined) this.image = this.buildType.buildStages[this.buildStage].image;
	if(resetProgress !== undefined && resetProgress == true) this.timeInThisBuildStage = 0;
}


BuildingSite.prototype.advancesToNextBuildStage = function(delta){
	return this.buildType.advancesToNextBuildStage(delta, this);
}

function BuildType(name){
	this.name = name;
	this.buildStages = [];
}

BuildType.prototype.lookUpImages = function(imageRepository){
	for(var i = 0; i < this.buildStages.length ; i++){
		//bS for build stage
        var bS = this.buildStages[i];
		if(bS.imageID !== undefined){
			bS.image = imageRepository.getImage(bS.imageID);
			delete bS.imageID;
		}
	}
	return this;
}

BuildType.prototype.addBuildStage = function(newBuildStage){
	this.buildStages.push(newBuildStage);
	return this;
}

BuildType.prototype.advancesToNextBuildStage = function(delta, site){
	return (site.buildStage < this.buildStages.length - 1) && (site.timeInThisBuildStage >= this.buildStages[site.buildStage+1].time);
}


BuildType.lookUpAllImages = function(imageRepository){
	for(var i in BuildType){
		if(!BuildType.hasOwnProperty(i)) continue;
		if(BuildType[i] instanceof BuildType){
			BuildType[i].lookUpImages(imageRepository);
		}
	}
}
//House Bottom Left
BuildType.HouseBL = new BuildType("HouseBL")
.addBuildStage({time:5000,imageID:'HouseBL1'}).addBuildStage({time:5000,imageID:'HouseBL2'}).addBuildStage({time:5000,imageID:'HouseBL3'});
//House Bottom Right
BuildType.HouseBR = new BuildType("HouseBR")
.addBuildStage({time:5000,imageID:'HouseBR1'}).addBuildStage({time:5000,imageID:'HouseBR2'}).addBuildStage({time:5000,imageID:'HouseBR3'});
//House Top Left
BuildType.HouseTL = new BuildType("HouseTL")
.addBuildStage({time:5000,imageID:'HouseTL1'}).addBuildStage({time:5000,imageID:'HouseTL2'}).addBuildStage({time:5000,imageID:'HouseTL3'});
//House Top Right
BuildType.HouseTR = new BuildType("HouseTR")
.addBuildStage({time:5000,imageID:'HouseTR1'}).addBuildStage({time:5000,imageID:'HouseTR2'}).addBuildStage({time:5000,imageID:'HouseTR3'});

//End of building class and start of Farming Patch
function FarmingPatch(x,y,plantType){
	GameObject.call(this,x,y);

	this.growthStage = 0;
	this.timeInThisGrowthStage = 0;
	this.timeAlive = 0;
	this.plantType = plantType;
	this.width = plantType.width || 64;
	this.height = plantType.height || 64;
	this.image = plantType.growthStages[0].image;
	this.passable = true;
	if(this.image !== undefined) this.imageReady = true;
}

FarmingPatch.prototype = Object.create(GameObject.prototype);
FarmingPatch.prototype.constructor = FarmingPatch;

FarmingPatch.prototype.draw = function(ctx){
	ctx.save();
	ctx.translate(this.x, this.y);
	if(this.imageReady)
		ctx.drawImage(this.image,0,0);
	ctx.restore();
}

FarmingPatch.prototype.update = function(delta){
	this.timeInThisGrowthStage += delta;
	this.timeAlive += delta;
	if(this.advancesToNextGrowthStage(delta)){
		this.setGrowthStage(this.growthStage + 1);
		this.timeInThisGrowthStage -= this.plantType.growthStages[this.growthStage-1].time;
	}
	if(this.diesDueToAge(delta)){
		return {remove:true};
	}
}

FarmingPatch.prototype.setGrowthStage = function(stage, resetProgress){
	this.growthStage = stage;
	if(this.plantType.growthStages[this.growthStage].image !== undefined) this.image = this.plantType.growthStages[this.growthStage].image;
	if(resetProgress !== undefined && resetProgress == true) this.timeInThisGrowthStage = 0;
}

FarmingPatch.prototype.harvest = function(){
	return this.plantType.harvest(this);
}

FarmingPatch.prototype.advancesToNextGrowthStage = function(delta){
	return this.plantType.advancesToNextGrowthStage(delta, this);
}

FarmingPatch.prototype.diesDueToAge = function(delta){
	return this.plantType.diesDueToAge(delta, this);
}

function PlantType(name){
	this.name = name;
	this.growthStages = [];
	this.width = 64;
	this.height = 64;
}

PlantType.prototype.lookUpImages = function(imageRepository){
	for(var i = 0; i < this.growthStages.length ; i++){
		var gS = this.growthStages[i];
		if(gS.imageID !== undefined){
			gS.image = imageRepository.getImage(gS.imageID);
			delete gS.imageID;
		}
	}
	return this;
}

PlantType.prototype.addGrowthStage = function(newGrowthStage){
	this.growthStages.push(newGrowthStage);
	return this;
}

PlantType.prototype.setHarvestFunction = function(f){
	this.harvest = f;
	return this;
}

PlantType.prototype.advancesToNextGrowthStage = function(delta, patch){
	return (patch.growthStage < this.growthStages.length - 1) && (patch.timeInThisGrowthStage >= this.growthStages[patch.growthStage+1].time);
}

PlantType.prototype.diesDueToAge = function(delta, patch){
	return false;
}

PlantType.prototype.setAgeDieFunction = function(f){
	this.diesDueToAge = f;
	return this;
}

PlantType.prototype.harvest = function(farmingPatch){
	return [];
}

PlantType.lookUpAllImages = function(imageRepository){
	for(var i in PlantType){
		if(!PlantType.hasOwnProperty(i)) continue;
		if(PlantType[i] instanceof PlantType){
			PlantType[i].lookUpImages(imageRepository);
		}
	}
}

PlantType.Redberry = new PlantType("Redberry")
.addGrowthStage({time:5000,imageID:'redberry1'}).addGrowthStage({time:5000,imageID:'redberry2'}).addGrowthStage({time:5000,imageID:'redberry3'})
.addGrowthStage({time:5000,imageID:'redberry4'}).addGrowthStage({time:5000,imageID:'redberry5'}).setHarvestFunction(
		function(farmingPatch){
			if(farmingPatch.growthStage == 4){
				farmingPatch.setGrowthStage(farmingPatch.growthStage-1, true);
				return [new Item(ItemType.RedberrySeeds).setQuantity(Math.floor(Math.random()*3)+3)];
			}
			else return [];
		}
	);

//Character Class, inherits GameObject
function Character(name,x,y,parentLevel){
	GameObject.call(this,x,y);
	
	this.parentLevel = parentLevel;
	this.name = name;
	this.orders = [];
	this.width = 64;
	this.height = 64;
	this.moveSpeed = 100;
	this.sayText = "";
	this.sayTime = 0;
	this.inventory = [];
	this.passable = true;
}

Character.prototype = Object.create(GameObject.prototype);
Character.prototype.constructor = Character;

Character.prototype.moveTo = function(x,y){
	this.orders.push(new Order("move",{x: x, y: y}));
}

Character.prototype.move = function(rtx,rty, callback){
	if(callback !== undefined)
		this.movePixels(rtx*this.parentLevel.map.tileWidth, rty*this.parentLevel.map.tileHeight, callback);
	else
		this.movePixels(rtx*this.parentLevel.map.tileWidth, rty*this.parentLevel.map.tileHeight);
}

Character.prototype.movePixels = function(rx,ry, callback){
	this.orders.push(new Order("moveRelative",{x: rx, y: ry, callback: callback}));
}

Character.prototype.chopTree = function(tree){
	this.orders.push(new Order("move",{x: tree.x, y: tree.y, range:64}));
	this.orders.push(new Order("chop",{tree: tree}));
}

Character.prototype.getNearestTree = function(){
	var closestDist = 1000*1000*1000;
	var closestTree = null;
	var gO = this.parentLevel.gameObjects;
	
	for(var i=0;i<gO.length;i++){
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

Character.prototype.harvest = function(callback){
	this.orders.push(new Order("harvest",{callback: callback}));
}

Character.prototype.say = function(s,t){
	if(s instanceof Function){
		var data = s.apply(this);
		if (data == this.inventory){
			s = "My inventory contains: ";
			for(var i=0;i<this.inventory.length;i++){
				s += this.inventory[i].getName();
				if(this.inventory[i].quantity != 1) s += " x"+this.inventory[i].quantity;
				if(i != this.inventory.length-1) s += ", ";
			}
		}
	}
	this.sayText = ""+s;
	this.sayTime = t || 5;
	this.sayTime *= 1000;
}

Character.prototype.update = function(delta){
	if(this.sayTime > 0){
		this.sayTime -= delta;
	}
	
	if(this.orders.length == 0) return;
	else{
		var oldOrder = null;
		var curOrder = this.orders[0];
		
		while(curOrder!=oldOrder){
			oldOrder = curOrder;
			switch(curOrder.getName()){
				case "moveRelative":
					curOrder.getData().x += this.x;
					curOrder.getData().y += this.y;
					curOrder.setName("move");
				case "move":
					var moveX = curOrder.getData().x;
					var moveY = curOrder.getData().y;
					var range = curOrder.getData().range || 0;
					var desireX = moveX - this.x;
					var desireY = moveY - this.y;
					
					var desireDist = Math.sqrt(desireX*desireX + desireY*desireY);
					if(desireDist <= range) {this.completeCurrentOrder(); return;}
					var realDist = Math.min(delta * this.moveSpeed/1000, desireDist);
					
					var oldx = this.x; var oldy = this.y;

					this.x += realDist/desireDist * desireX;
					var a = this.parentLevel.getIntersectingObjectsStrict(this);
					for(var i=0;i<a.length;i++){
						if(!a[i].passable){
							if(desireX>0){ this.x = Math.min(this.x,a[i].x-this.width); }
							else{ this.x = Math.max(this.x,a[i].x+a[i].width); }
						}
					}

					this.x-oldx;

					this.y += realDist/desireDist * desireY;
					var a = this.parentLevel.getIntersectingObjectsStrict(this);
					for(var i=0;i<a.length;i++){
						if(!a[i].passable){
							if(desireY>0){ this.y = Math.min(this.y,a[i].y-this.height); }
							else{ this.y = Math.min(this.y,a[i].y+a[i].height); }
						}
					}

					delta = 0;

					if(Math.sqrt(Math.pow(this.x-oldx,2) + Math.pow(this.y-oldy)) < realDist/20) {this.completeCurrentOrder(); return;}

					var m = this.parentLevel.map; var b = false;
					if(this.x + this.width > m.getPixelWidth() + m.beginX)   {this.x = m.getPixelWidth() + m.beginX - this.width; b = true;}
					if(this.x < m.beginX)                                    {this.x = m.beginX; b = true;}
					if(this.y + this.height > m.getPixelHeight() + m.beginY) {this.y = m.getPixelHeight() + m.beginY - this.height; b = true;}
					if(this.y < m.beginY)                                    {this.y = m.beginY; b = true;}
					if(b) { this.completeCurrentOrder(); return; }
					break;
				case "chop":
					var tTree = curOrder.getData().tree;
					var response = tTree.chop(delta);
					delta=0;
					this.addToInventory(response.items);
					if(response.remove !== undefined && response.remove) this.completeCurrentOrder();
					break;
				case "harvest":
					var gO = this.parentLevel.gameObjects;

					for(var i = 0;i < gO.length;i++){
						if(gO[i] instanceof FarmingPatch && BoundingBoxClip(this, gO[i])){
							this.addToInventory( gO[i].harvest() );
						}
					}
					this.completeCurrentOrder();
					break;
				case "drop":
					this.drop(curOrder);
					this.completeCurrentOrder();
					break;
				case "pickUp":
					this.pickUp(curOrder);
					this.completeCurrentOrder();
				case "wait":
					curOrder.getData().time -= delta;
					if(curOrder.getData().time <= 0){ delta=-curOrder.getData().time; this.completeCurrentOrder(); }
			}
			curOrder=this.orders.length>0?this.orders[0]:curOrder;
		}
	}
}

Character.prototype.addToInventory = function(obj){
	if(obj instanceof Array){
		for(var i = 0;i<obj.length;i++){
			this.addToInventory(obj[i]);
		}
		return;
	}
	if(obj instanceof Item){
		if(!obj.isStackable())
			this.inventory.push(obj);
		else{
			for(var i = 0;i < this.inventory.length;i++){
				if(this.inventory[i].itemType == obj.itemType){
					this.inventory[i].quantity += obj.quantity;
					return;
				}
			}
			this.inventory.push(obj);
		}
	}
}

Character.prototype.drop = function(obj, numberToDrop){
	if(!(obj instanceof Order)){
		this.orders.push(new Order("drop",{obj: obj, numberToDrop: numberToDrop}));
		return;
	}
	else{numberToDrop = obj.getData().numberToDrop; obj = obj.getData().obj;}
	if(typeof obj == 'number') {
		if(this.inventory[obj] === undefined) return;
		if(this.inventory[obj].handleDrop(this, numberToDrop)) this.inventory.splice(obj,1);
		return;
	}
	if(obj instanceof Item) {
		for(var i = 0; i < this.inventory.length;i++){
			if(this.inventory[i] == obj) {
				if(this.inventory[i].handleDrop(this, numberToDrop)) this.inventory.splice(i,1);
			}
		}
		return;
	}
	if(typeof obj == 'string' || typeof obj == 'String'){
		for(var i = 0; i < this.inventory.length;i++){
			if(this.inventory[i].getName() == obj) {
				if(this.inventory[i].handleDrop(this, numberToDrop)) this.inventory.splice(i,1);
			}
		}
		return;
	}
}

Character.prototype.pickUp = function(obj, numberToPickup){
	if(!(obj instanceof Order)){
		this.orders.push(new Order("pickUp",{obj: obj, numberToPickup: numberToPickup}));
		return;
	}
	else{numberToPickup = obj.getData().numberToPickup; obj = obj.getData().obj;}
	if(obj === undefined){
		var a = this.parentLevel.getIntersectingObjects(this.x, this.y, this.width, this.height);
		for(var i=0;i<a.length;i++){
			if(a[i] instanceof ItemPile){
				this.addToInventory(a[i].items);
				a[i].items=[];
			}
		}
	}
	/*if(typeof obj == 'number') {
		if(this.inventory[obj] === undefined) return;
		if(this.inventory[obj].handleDrop(this, numberToDrop)) this.inventory.splice(obj,1);
		return;
	}
	if(obj instanceof Item) {
		for(var i = 0; i < this.inventory.length;i++){
			if(this.inventory[i] == obj) {
				if(this.inventory[i].handleDrop(this, numberToDrop)) this.inventory.splice(i,1);
			}
		}
		return;
	}
	if(typeof obj == 'string' || typeof obj == 'String'){
		for(var i = 0; i < this.inventory.length;i++){
			if(this.inventory[i].getName() == obj) {
				if(this.inventory[i].handleDrop(this, numberToDrop)) this.inventory.splice(i,1);
			}
		}
		return;
	}*/
}

Character.prototype.stop = function(){
	this.orders = [];
}

Character.prototype.wait = function(time){
	this.orders.push(new Order("wait",{time:time}));
}

Character.prototype.completeCurrentOrder = function(){
	if(this.orders[0].getData().callback !== undefined) this.orders[0].getData().callback.apply(); this.orders.shift();
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

function Item(itemType){
	this.itemType = itemType;
	this.quantity = 1;
}

Item.prototype.setQuantity = function(quantity){
	this.quantity = quantity;
	return this;
}

Item.prototype.getName = function(){
	return this.itemType.itemName;
}

Item.prototype.getImage = function(){
	return this.itemType.image;
}

Item.prototype.getImageReady = function(){
	return this.itemType.imageReady;
}

Item.prototype.isStackable = function(){
	return this.itemType.isStackable();
}

Item.prototype.handleDrop = function(character, numberToDrop){
	return this.itemType.handleDrop(this, character, numberToDrop);
}

Item.prototype.update = function(delta, owner){
	return this.itemType.update(delta, owner, this);
}

function ItemType(itemID){
	this.itemID = itemID;
	this.itemName = itemID;
	this.weight = 0;
	this.stacks = false;
	this.image = null;
	this.imageReady = false;
}

ItemType.prototype.setName = function(name){
	this.itemName = name;
	return this;
}

ItemType.prototype.setWeight = function(weight){
	this.weight = weight;
	return this;
}

ItemType.prototype.setStacks = function(stacks){
	this.stacks = stacks;
	return this;
}

ItemType.prototype.setImageID = function(imageID){
	this.imageID = imageID;
	return this;
}

ItemType.prototype.isStackable = function(){
	return this.stacks;
}

ItemType.prototype.lookUpImages = function(imageRepository){
	if(this.imageID !== undefined) {
		this.image = imageRepository.getImage(this.imageID);
		delete this.imageID;
		this.imageReady = true;
	}
	return this;
}

ItemType.prototype.handleDrop = function(item, character, numberToDrop){
	if(numberToDrop === undefined) numberToDrop = 1;
	if(numberToDrop <= 0) return false;
	if(numberToDrop > item.quantity) numberToDrop = item.quantity;

	var gO = character.parentLevel.gameObjects;

	for(var i = 0;i < gO.length;i++){
		if( (gO[i] instanceof ItemPile || !gO[i].passable) && BoundingBoxClip({x: character.x+1, y: character.y+1, width: 62, height: 62}, gO[i])){
			if(gO[i] instanceof ItemPile){
				gO[i].addItems(new Item(item.itemType).setQuantity(numberToDrop));
				item.quantity -= numberToDrop;
				if(item.quantity <= 0) return true;

				return false;
			}
			else{
				return false;
			}
		}
	}

	character.parentLevel.addGameObject(new ItemPile(character.x, character.y, character.parentLevel, [new Item(item.itemType).setQuantity(numberToDrop)] ));

	item.quantity -= numberToDrop;
	if(item.quantity <= 0) return true;

	return false;
}

ItemType.prototype.update = function(delta, owner, item){
	var response = this.beforeUpdate(delta, owner, item);
	if(item.quantity <= 0) response.remove = true;
	return response;
}

ItemType.prototype.beforeUpdate = function(delta, owner, item){}

ItemType.prototype.setDropFunction = function(f){
	this.handleDrop = f;
	return this;
}

ItemType.prototype.setBeforeUpdateFunction = function(f){
	this.beforeUpdate = f;
	return this;
}

ItemType.lookUpAllImages = function(imageRepository){
	for(var i in ItemType){
		if(!ItemType.hasOwnProperty(i)) continue;
		if(ItemType[i] instanceof ItemType){
			ItemType[i].lookUpImages(imageRepository);
		}
	}
}

ItemType.RedberrySeeds = new ItemType("RedberrySeeds").setName("Redberry seeds").setWeight(1/8/8/8).setStacks(true).setImageID('redberrySeedItem').setBeforeUpdateFunction(function(delta, owner, item){
	if(owner instanceof ItemPile && owner.items.length == 1){
		var gO = owner.parentLevel.gameObjects;

		for(var i = 0;i < gO.length;i++){
			if( (!gO[i].passable || gO[i] instanceof FarmingPatch) && gO[i] != owner && BoundingBoxClip({x: owner.x+1, y: owner.y+1, width: PlantType.Redberry.width-2, height: PlantType.Redberry.height-2}, gO[i])){
				return {};
			}
		}

		owner.parentLevel.addGameObject(new FarmingPatch(owner.x, owner.y, PlantType.Redberry));

		item.quantity--;
		return {};
	}
	return {};
});

ItemType.Log = new ItemType("Log").setName("Log").setWeight(1).setStacks(true);
ItemType._mixed = new ItemType("_mixed").setImageID("itemPile");

//Order Class
function Order(name, data){
	this.name = name;
	this.data = data;
}

Order.prototype.getName = function(){
	return this.name;
}

Order.prototype.setName = function(name){
	this.name = name;
}

Order.prototype.getData = function(){
	return this.data;
}

//CharacterList Class
function CharacterList(arr){
	this.arr = [];
}

CharacterList.prototype.forEach = function(f){
	for(var i=0;i<this.arr.length;i++){
		f.call(this.arr[i]);
	}
}

CharacterList.prototype.chopTree = function(tree){
	for(var i=0;i<this.arr.length;i++){
		this.arr[i].chopTree(tree);
	}
}

CharacterList.prototype.getNearestTree = function(){
	return this.arr[0].getNearestTree();
}

CharacterList.prototype.chopNearestTree = function(){
	for(var i=0;i<this.arr.length;i++){
		this.arr[i].chopNearestTree();
	}
}

CharacterList.prototype.moveTo = function(x,y, callback){
	for(var i=0;i<this.arr.length;i++){
		if(callback !== undefined) this.arr[i].moveTo(x,y,callback);
		else this.arr[i].moveTo(x,y);
	}
}

CharacterList.prototype.movePixels = function(x,y, callback){
	for(var i=0;i<this.arr.length;i++){
		if(callback !== undefined) this.arr[i].movePixels(x,y,callback);
		else this.arr[i].movePixels(x,y);
	}
}

CharacterList.prototype.move = function(x,y, callback){
	for(var i=0;i<this.arr.length;i++){
		if(callback !== undefined) this.arr[i].move(x,y,callback);
		else this.arr[i].move(x,y);
	}
}

CharacterList.prototype.harvest = function(callback){
	return this.forEach( function(){this.harvest(callback);} );
}

CharacterList.prototype.drop = function(obj,numberToDrop,callback){
	var f = ((numberToDrop !== undefined) ? function(){this.drop(obj,numberToDrop);} : function(){this.drop(obj);});
	return this.forEach(f);
}

CharacterList.prototype.pickUp = function(obj,numberToDrop,callback){
	return this.forEach(function(){this.pickUp(obj,numberToDrop,callback);});
}

CharacterList.prototype.say = function(s, t){
	this.forEach(function(){this.say(s,t);});
}

CharacterList.prototype.stop = function(args){
	this.forEach(function(){this.stop(args);});
}

CharacterList.prototype.wait = function(args){
	this.forEach(function(){this.wait(args);});
}

CharacterList.prototype.draw = function(ctx){
	for(var i=0;i<this.arr.length;i++){
		this.arr[i].draw(ctx);
	}
}

CharacterList.prototype.add = function(character){
	this.arr.push(character);
}

//ImageRepository Class
function ImageRepository(){
	this.repo = {};
	this.imgReady = {};
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
	for(var i=0;i<len;i++){
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

ImageRepository.prototype.findKeyForImage = function(img){
	for(var i in this.repo){
		if(img === this.repo[i]) return i;
	}
	return "null";
}

function Spellbook(allowedFunctions){
	this.tabs = [];
	this.tabs.push(new SpellbookTab("1"));
	this.pointerTab = 0;
	this.show = false;
	this.hideFunc;
	this.hideArg;
	this.allowedFunctions = allowedFunctions;
	this.functions = [];
}

Spellbook.doneButton = {
	getX: function(){return canvas.width-150;},
	getY: function(){return 140;},
	getWidth: function(){return 100;},
	getHeight: function(){return 30;},
	fontSize: 16,
	fontFamily: "Consolas",
	getStr: function(){return "Done";}
}

Spellbook.prototype.moveCursorRight = function(){
	this.tabs[this.pointerTab].moveCursorRight();
}

Spellbook.prototype.moveCursorLeft = function(){
	this.tabs[this.pointerTab].moveCursorLeft();
}

Spellbook.prototype.moveCursorUp = function(){
	this.tabs[this.pointerTab].moveCursorUp();
}

Spellbook.prototype.moveCursorDown = function(){
	this.tabs[this.pointerTab].moveCursorDown();
}

Spellbook.prototype.mouseClick = function(x,y){
	if(x >= Spellbook.doneButton.getX() && x <= Spellbook.doneButton.getX() + Spellbook.doneButton.getWidth() &&
	   y >= Spellbook.doneButton.getY() && y <= Spellbook.doneButton.getY() + Spellbook.doneButton.getHeight()){
		   this.show = false;
		   this.saveText();
		   if(this.hideFunc !== undefined){
			   this.hideFunc(this.hideArg);
		   }
	   }
	   
	console.log("Mouse click: " + x + "," + y);
	
	var curX = 1;
	for(var i=0;i<this.tabs.length;i++){
		if(x>=curX && x<=curX+(this.tabs[i].width===undefined?-1:this.tabs[i].width) &&
			y>=-20 && y<=0){
			this.saveText();
			this.pointerTab = i;
		}
		curX += (this.tabs[i].width===undefined?-1:this.tabs[i].width)+1;
	}
	if(x>=curX && x<=curX+15 &&
		y>=-20 && y<=0){
		console.log("New tab "+curX);
		this.saveText();
		this.tabs.push(new SpellbookTab(""+(this.tabs.length+1)));
		this.pointerTab = this.tabs.length-1;
	}
}

Spellbook.prototype.keyDown = function(kc){
	if(kc == 37){	//Left arrow key
		this.moveCursorLeft();
	}
	if(kc == 39){	//Right arrow key
		this.moveCursorRight();
	}
	if(kc == 38){	//Up arrow key
		this.moveCursorUp();
	}
	if(kc == 40){	//Down arrow key
		this.moveCursorDown();
	}
	if(kc == 110)
		this.keyPressed(46);
	if(kc == 190)
		this.keyPressed(46);
	if(kc == 46)
		this.tabs[this.pointerTab].deleteAfterCursor();
}

Spellbook.prototype.keyPressed = function(kc){
	this.tabs[this.pointerTab].keyPressed(kc);
}

Spellbook.prototype.saveText = function(){
	this.tabs[this.pointerTab].saveText();
	var str = this.tabs[this.pointerTab].toString()+" return "+this.tabs[this.pointerTab].name+"();";
	this.functions[this.pointerTab]=new Function();

	str = str.trim();
	for(var j=0;j<this.allowedFunctions.length;j++){
		str = str.trim().replace(new RegExp(this.allowedFunctions[j].getName(),"g"), this.allowedFunctions[j].getHelpingNamespace()+this.allowedFunctions[j].getName());
	}
	for(var z=0;z<this.tabs.length;z++){
		if(z==this.pointerTab) continue;
		
		str = str.replace(new RegExp(this.tabs[z].name+"\\(\\s*\\)","g"), "currentLevel.spellbook.functions["+z+"].apply(currentLevel)")
		.replace(new RegExp(this.tabs[z].name+"\\(","g"), "currentLevel.spellbook.functions["+z+"].apply(currentLevel,");
	}

	this.functions[this.pointerTab] = new Function(str.trim());
}

Spellbook.prototype.getFunctionByName = function(name){
	for(var i=0;i<this.tabs.length;i++){
		if(name == this.tabs[i].name){
			return this.functions[i];
		}
	}
}

Spellbook.prototype.draw = function(ctx){
	ctx.save();
	ctx.fillStyle = "rgba(0,0,0,0.3)";
	ctx.fillRect(0,0,canvas.width,180);
	
	this.tabs[this.pointerTab].draw(ctx);
	
	ctx.fillStyle = "rgba(32,32,64,0.5)";
	ctx.fillRect(Spellbook.doneButton.getX(),Spellbook.doneButton.getY(),Spellbook.doneButton.getWidth(),Spellbook.doneButton.getHeight());
	
	ctx.save();
	ctx.translate(0,-20);
	var curX = 1;
	for(var i=0;i<this.tabs.length;i++){
		this.tabs[i].drawTab(ctx);
		curX += this.tabs[i].width+1;
		ctx.translate(this.tabs[i].width+1,0);
	}
	ctx.restore();
	ctx.save();
		ctx.fillStyle = "rgba(0,0,0,0.5)";
		ctx.font = "14px Consolas";
		ctx.fillRect(curX,-16,ctx.measureText("+").width+6,16);
		ctx.fillStyle = "rgba(255,255,255,0.7)";
		ctx.fillText("+", curX+3, -2);
	ctx.restore();
	
	ctx.fillStyle = "rgba(255,255,255,1)";
	ctx.font = Spellbook.doneButton.fontSize + "px " + Spellbook.doneButton.fontFamily;
	ctx.fillText(Spellbook.doneButton.getStr(), Spellbook.doneButton.getX()+Spellbook.doneButton.getWidth()/2-ctx.measureText(Spellbook.doneButton.getStr()).width/2, Spellbook.doneButton.getY()+Spellbook.doneButton.getHeight()/2+Spellbook.doneButton.fontSize/2);
	ctx.restore();
}

Spellbook.prototype.isHidden = function(){
	return !this.show;
}

function SpellbookTab(name){
	this.name = name;
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

SpellbookTab.prototype.moveCursorUp = function(){
	this.pointerY--;
	if(this.pointerY<0){
		this.pointerY++;
	}
	if(this.pointerX > this.lines[this.pointerY].length){this.pointerX=this.lines[this.pointerY].length;}
}

SpellbookTab.prototype.moveCursorDown = function(){
	this.pointerY++;
	if(this.pointerY>this.lines.length-1){
		this.pointerY--;
	}
	if(this.pointerX > this.lines[this.pointerY].length){this.pointerX=this.lines[this.pointerY].length;}
}

SpellbookTab.prototype.deleteBeforeCursor = function(){
	if(this.pointerX > 0){
		this.lines[this.pointerY] = this.lines[this.pointerY].substring(0,this.pointerX-1) + this.lines[this.pointerY].substring(this.pointerX);
		this.pointerX--;
	}
	else if(this.pointerY > 0){
		this.pointerX = this.lines[this.pointerY-1].length;
		var restOfLine = this.lines[this.pointerY];
		this.lines.splice(this.pointerY, 1);
		this.lines[this.pointerY-1]=this.lines[this.pointerY-1] + restOfLine;
		this.pointerY--;
	}
}

SpellbookTab.prototype.deleteAfterCursor = function(){
	if(this.pointerX < this.lines[this.pointerY].length){
		this.lines[this.pointerY] = this.lines[this.pointerY].substring(0,this.pointerX) + this.lines[this.pointerY].substring(this.pointerX+1);
	}
	else{
		if(this.pointerY < this.lines.length-1){
			var restOfLine = this.lines[this.pointerY+1];
			this.lines.splice(this.pointerY+1, 1);
			this.lines[this.pointerY]=this.lines[this.pointerY] + restOfLine;
		}
	}
}

SpellbookTab.prototype.draw = function(ctx){
	ctx.save();
	ctx.fillStyle = "rgba(255,255,255,0.7)";
	ctx.font = "14px Consolas";
	ctx.save();
	for(var i=0;i<this.lines.length;i++){
		ctx.translate(0,15);
		ctx.fillText(this.lines[i],0,0);
	}
	ctx.restore();
	
	ctx.fillStyle = "rgba(255,255,255,0.7)";
	if(Math.floor(Date.now()/500)%2 == 0)ctx.fillRect(ctx.measureText(this.lines[this.pointerY].substring(0,this.pointerX)).width, this.pointerY*15+2, 1, 15);
	ctx.restore();
}

SpellbookTab.prototype.drawTab = function(ctx){
	ctx.save();
	ctx.fillStyle = "rgba(0,0,0,0.5)";
	ctx.font = "16px Consolas";
	ctx.fillRect(0,0,ctx.measureText(this.name).width+6,20);
	ctx.fillStyle = "rgba(255,255,255,0.7)";
	ctx.fillText(this.name, 3, 18);
	this.width = ctx.measureText(this.name).width+6;
	this.height = 20;
	ctx.restore();
}

SpellbookTab.prototype.toString = function(){
	var str = "";
	for(var i=0;i<this.lines.length;i++){
		str += this.lines[i];
		if(i!=this.lines.length-1) str += "\n";
	}
	return str;
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
		this.deleteBeforeCursor();
	}
	else{
		this.lines[this.pointerY] = this.lines[this.pointerY].substring(0,this.pointerX) + ((typeof kc === "string") ? kc : String.fromCharCode(kc)) + this.lines[this.pointerY].substring(this.pointerX);
		this.pointerX++;
	}
}

SpellbookTab.prototype.saveText = function(){
	var str = this.toString();
	var point = str.indexOf("function ");
	if(point > -1){
		str = str.substring(point+"function ".length);
		str = str.trim();
		var point2 = str.indexOf("("); if(point2 == -1) point2 = str.length+1;
		var point22 = str.indexOf(" "); if(point22 == -1) point22 = str.length+1;
		var point3 = Math.min(point2, point22);
		if(point3 <= str.length) this.name = str.substring(0,point2);
	}
}