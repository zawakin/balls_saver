var Point = function(a, b){
	if(typeof(a)=="number" && typeof(b)=="number"){
		this.x = a;
		this.y = b;
	}
	else{
		this.x = 0;
		this.y = 0;
	}
};

Point.prototype.add = function(p){
	if(typeof(p.x)=="number"){
		var q = new Point();
		q.x = this.x+ p.x;
		q.y = this.y+ p.y;
		return q;
	}
}

Point.prototype.sub = function(p){
	if(typeof(p.x)=="number"){
		var q = new Point();
		q.x = this.x- p.x;
		q.y = this.y- p.y;
		return q;
	}
};

Point.prototype.dot = function(p){
	if(typeof(p.x)=="number") return this.x* p.x+ this.y* p.y;
	else if(typeof(p)=="number") return this.x* cos(p)+ this.y* sin(p);
	else console.log("!ERROR Point.dot")
}

Point.prototype.cross = function(p){
	if(typeof(p.x)=="number") return this.x* p.y- this.y* p.x;
	else if(typeof(p)=="number") return this.x* sin(p)- this.y* cos(p);
	else console.log("!ERROR Point.cross")
}

Point.prototype.mul = function(a){
	if(typeof(a)=="number"){
		var q = new Point();
		q.x = this.x* a;
		q.y = this.y* a;
		return q;
	}
	else if(typeof(a.x)=="number"){
		var q = new Point();
		q.x = this.x* a.x;
		q.y = this.y* a.y;
		return q;
	}
	else console.log("!ERROR Point.mul")
}

Point.prototype.div = function(a){
	if(typeof(a)=="number"){
		var q = new Point();
		q.x = this.x/ a;
		q.y = this.y/ a;
		return q;
	}
	else if(typeof(a.x)=="number"){
		var q = new Point();
		q.x = this.x/ a.x;
		q.y = this.y/ a.y;
		return q;
	}
	else console.log("!ERROR Point.div")
}

Point.prototype.norm = function(){
	return sqrt(this.x * this.x +this.y * this.y);
};

Point.prototype.normalize = function(){
	var i = this.norm();
	var q = new Point();
	if(i > 0){
		q.x = this.x/ i;
		q.y = this.y/ i;
		return q;
	}
	else console.log("!ERROR Point.normalize")
	run = false;
};

Point.prototype.rot = function(center, rad){
	if(typeof(center.x)=="number" && typeof(rad)=="number"){
		var x = (this.x- center.x)*cos(rad)- (this.y- center.y)*sin(rad);
		var y = (this.x- center.x)*sin(rad)+ (this.y- center.y)*cos(rad);
		return new Point(center.x+ x, center.y+ y)
	}
	else console.log("!ERROR Point.rot");
}

var mod = function(a, b){
	if(!b) return a-dotLen*(Math.floor(a/dotLen));
	else if(typeof(a)=="number" && typeof(b)=="number") return a-b*(Math.floor(a/b));
}

var angle = function(rad){
	if(typeof(rad)=="number"){
		var q = new Point();
		q.x = cos(rad);
		q.y = sin(rad);
		return q;
	}
}

var atan2 = function(a, b){
	if(typeof(b)=="number") return Math.atan2(a, b);
	else if(typeof(a.x)=="number") return Math.atan2(a.y, a.x);
	else console.log("!ERROR function atan2");
	
}

var moveTo = function(a){
	if(typeof(a.x)=="number"){
		ctx.moveTo(a.x, a.y);
	}
	else console.log("!ERROR function moveTo");
}

var lineTo = function(a){
	if(typeof(a.x)=="number"){
		ctx.lineTo(a.x, a.y);
	}
	else console.log("!ERROR function lineTo");
}


















