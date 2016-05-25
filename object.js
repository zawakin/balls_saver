//壁を定義する関数---------------------------------------------------------------------------------------------------------------
var Wall = function(){
	//諸々の設定
	this.isAlive  = false;
	this.color  = 0;
	this.rad1   = 0;
	this.rad2   = 0;
	this.num    = 0;
	this.type   = 0;
	this.weight = 0;
	this.uMax   = 0;
	this.lMax   = 0;
	this.pair   = 0;
	this.centerLen    = 0;
	this.centerRad   = 0;
	this.vel    = new Point();
	this.radv   = 0;
	this.center = new Point();

	this.vechx = 0;
	this.vechy = 0;
	this.vecvx = 0;
	this.vecvy = 0;
	this.contact = new Array(12);
	this.contactCnt01 = 0;
	for(i=0; i < this.contact.length; i++){
		this.contact[i] = {};
		this.contact[i].pos = new Point();
		this.contact[i].excess = 0;
		this.contact[i].num = "0";
		this.contact[i].weight = 0;
		this.contact[i].color = 0;
		this.contact[i].side = 0;
		this.contact[i].rad = 0;
		this.contact[i].pairPos = new Point();
		this.contact[i].pairVel = new Point();
	}
};

//壁を生成する関数
Wall.prototype.set = function(tlx, tly, wid, hei, rad1, rad2, c, t, w, p, um, lm){
	//水平方向の幅ベクトル(vech)の値と、垂直方向の幅ベクトル(vecv)の値の計算
	if(!rad2) rad2 = rad1 - PI_2;
	this.vechx = wid * cos(rad1);
	this.vechy = wid * sin(rad1);
	this.vecvx = hei * cos(rad2);
	this.vecvy = hei * sin(rad2);

	//四隅の座標の取得
	this.tl = new Point(tlx, tly);
	this.tr = new Point(tlx+ this.vechx, tly+ this.vechy);
	this.bl = new Point(tlx- this.vecvx, tly- this.vecvy);
	this.br = new Point(tlx+ this.vechx- this.vecvx, tly+ this.vechy- this.vecvy);
	this.center = this.tl.add(this.br).div(2);
	
	this.wid = wid;
	this.hei = hei;
	this.rad1 = rad1;
	this.rad2 = rad2;
	this.color = c;
	this.type = t;
	this.isAlive = true;
	if(t == 1){
		this.pair = p;
	}
	if(t == 2 || t== 3){
		this.weight = w;
		this.pair = p;
		this.uMax = um;
		this.lMax = lm;
		this.tlTemp = this.tl.add(P0);
		this.trTemp = this.tr.add(P0);
		this.brTemp = this.br.add(P0);
		this.blTemp = this.bl.add(P0);
	}
	if(t == 4){
		this.weight = w;
		this.uMax = um;
		this.lMax = lm;
		this.centerLen = this.tl.sub(this.center).norm();
		this.centerRad = atan2(this.tl.sub(this.center));
	}
};

//壁を初期化する関数
Wall.prototype.initialize = function(){
	//諸々の設定
	this.isAlive  = false;
	this.color  = 0;
	this.rad1   = 0;
	this.rad2   = 0;
	this.type   = 0;
	this.weight = 0;
	this.uMax   = 0;
	this.lMax   = 0;
	this.pair   = 0;
	this.centerLen    = 0;
	this.centerRad   = 0;
	this.vel.x  = 0;
	this.vel.y  = 0;
	this.radv   = 0;
	this.center.x = 0;
	this.center.y = 0;
	this.vechx = 0;
	this.vechy = 0;
	this.vecvx = 0;
	this.vecvy = 0;
	this.contactCnt = 0;
	for(i=0; i<this.contact.length; i++){
		this.contactInitialize(i);
	}
}

//壁の接点の情報を初期化する関数
Wall.prototype.contactInitialize = function(i){
	this.contact[i].pos.x = 0;
	this.contact[i].pos.y = 0;
	this.contact[i].excess = 0;
	this.contact[i].num = "0";
	this.contact[i].weight = 0;
	this.contact[i].color = 0;
	this.contact[i].side = 0;
	this.contact[i].rad = 0;
	this.contact[i].pairPos.x = 0;
	this.contact[i].pairPos.y = 0;
	this.contact[i].pairVel.x = 0;
	this.contact[i].pairVel.y = 0;
}

//壁の接点の情報をコピーする関数
Wall.prototype.contactCopy = function(i, j){
	this.contact[i].x = this.contact[j].x;
	this.contact[i].y = this.contact[j].y;
	this.contact[i].excess = this.contact[j].excess;
	this.contact[i].num = this.contact[j].num;
	this.contact[i].weight = this.contact[j].weight;
	this.contact[i].color = this.contact[j].color;
	this.contact[i].side = this.contact[j].side;
	this.contact[i].rad = this.contact[j].rad;
	this.contact[i].pairPos.x = this.contact[j].pairPos.x;
	this.contact[i].pairPos.y = this.contact[j].pairPos.y;
	this.contact[i].pairVel.x = this.contact[j].pairVel.x;
	this.contact[i].pairVel.y = this.contact[j].pairVel.y;
}

//壁の描写その1
Wall.prototype.draw1 = function(wall){
	switch(this.type){
		case 1:
			var obje = wall[this.pair];
			ctx.beginPath();
			ctx.moveTo(this.center.x, this.center.y);
			ctx.lineTo(obje.center.x, this.center.y);
			ctx.lineTo(obje.center.x, obje.center.y);
			ctx.lineCap = "butt";
			ctx.lineWidth = "16";
			ctx.strokeStyle = color[13];
			ctx.stroke();
			ctx.beginPath();
			var num = (obje.center.x- this.center.x)/20;
			for(i=0; i<Math.abs(num)-1/2; i++){
				ctx.arc(obje.center.x- i*20*Math.sign(num), this.center.y, 6, 0, PI2, true);
			}
			ctx.fillStyle = color[10+this.color];
			ctx.fill();
			ctx.beginPath();
			num = (obje.center.y- this.center.y)/20;
			for(i=1; i<Math.abs(num)-1/2; i++){
				ctx.arc(obje.center.x, this.center.y+ i*20*Math.sign(num), 6, 0, PI2, true);
			}
			ctx.fill();
			break;
	}
	ctx.beginPath();
	moveTo(this.tl);
	lineTo(this.tr);
	lineTo(this.br);
	lineTo(this.bl);
	ctx.closePath();
	ctx.fillStyle = color[4];
	ctx.fill();
	if(this.type == 3){
		ctx.beginPath();
		ctx.moveTo(this.center.x+ 3/10* this.wid, this.center.y+ this.uMax+4);
		ctx.lineTo(this.center.x+ 3/10* this.wid, this.center.y+ this.lMax-4);
		ctx.moveTo(this.center.x- 3/10* this.wid, this.center.y+ this.uMax+4);
		ctx.lineTo(this.center.x- 3/10* this.wid, this.center.y+ this.lMax-4);
		ctx.lineCap = "round";
		ctx.lineWidth = 20;
		ctx.strokeStyle = color[10+this.color];
		ctx.stroke();
		ctx.stroke();
		ctx.moveTo(this.center.x+ 3/10* this.wid, this.center.y+ this.uMax);
		ctx.lineTo(this.center.x+ 3/10* this.wid, this.center.y+ this.lMax);
		ctx.moveTo(this.center.x- 3/10* this.wid, this.center.y+ this.uMax);
		ctx.lineTo(this.center.x- 3/10* this.wid, this.center.y+ this.lMax);
		ctx.lineWidth = 6;
		ctx.strokeStyle = color[14];
		ctx.stroke();
	}
}

//壁の描写その2
Wall.prototype.draw2 = function(wall){
	ctx.beginPath();
	moveTo(this.tl);
	lineTo(this.tr);
	lineTo(this.br);
	lineTo(this.bl);
	ctx.closePath();
	ctx.fillStyle = color[this.color];
	ctx.fill();
	switch(this.type){
		case 1:
			if(this.wid > this.hei) var len = this.hei;
			else var len = this.wid;
			if(len > 35) len = 35;
			len = len*1.2;
			ctx.font = "bold 50px 'Times New Roman'"
			ctx.font = "bold " + len+"px " + "Times New Roman";
			ctx.fillStyle = color[4];
			var str = "!";
			ctx.fillText(str, this.center.x-len/6, this.center.y+len/3);
			break;
		
		case 2:
			var wid = this.wid;
			ctx.beginPath();
			ctx.moveTo(this.center.x- 3/8*wid, this.tl.y);
			ctx.lineTo(this.center.x- 3/8*wid, this.tl.y+ 1/6* this.uMax);
			ctx.lineTo(this.center.x- 1/6*wid, this.tl.y+ 1/6* this.uMax);
			ctx.lineTo(this.center.x- 1/6*wid, this.tlTemp.y+ this.uMax-Math.min(wid/24, 1.5));
			ctx.moveTo(this.center.x+ 3/8*wid, this.tl.y);
			ctx.lineTo(this.center.x+ 3/8*wid, this.tl.y+ 1/6* this.uMax);
			ctx.lineTo(this.center.x+ 1/6*wid, this.tl.y+ 1/6* this.uMax);
			ctx.lineTo(this.center.x+ 1/6*wid, this.tlTemp.y+ this.uMax-Math.min(wid/24, 1.5));
			ctx.moveTo(this.center.x, this.tl.y+ this.hei/8);
			ctx.lineTo(this.center.x, this.bl.y- this.hei/5);
			ctx.lineWidth = Math.min(3, wid/ 12);
			ctx.lineCap = "square";
			ctx.strokeStyle = color[4];
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(this.center.x- 1/6*wid, this.tlTemp.y+ this.uMax-Math.min(wid/24, 1.5));
			ctx.lineTo(this.center.x- 2/8*wid, this.tlTemp.y+ this.uMax-Math.min(wid/24, 1.5));
			ctx.moveTo(this.center.x+ 1/6*wid, this.tlTemp.y+ this.uMax-Math.min(wid/24, 1.5));
			ctx.lineTo(this.center.x+ 2/8*wid, this.tlTemp.y+ this.uMax-Math.min(wid/24, 1.5));
			ctx.stroke();
			ctx.clearRect(this.center.x- 1/5*wid, this.bl.y- this.hei/5, 2/5*wid, this.hei/5);
			ctx.beginPath();
			ctx.moveTo(this.center.x, this.bl.y- this.hei/6);
			ctx.lineTo(this.center.x, this.bl.y);
			ctx.lineWidth = wid/3;
			ctx.lineCap = "butt";
			ctx.strokeStyle = color[3];
			ctx.stroke();
			break;
		
		case 3:
			if(this.wid > this.hei) var len = this.hei;
			else var len = this.wid;
			if(len > 35) len = 35;
			var hei = (this.tl.y+ this.bl.y)/2;
			var wid1 = this.center.x+ 3/10* this.wid;
			var wid2 = this.center.x- 3/10* this.wid;
			ctx.beginPath();
			ctx.arc(wid1, hei, len*0.39, 0, PI2, true);
			ctx.arc(wid2, hei, len*0.39, 0, PI2, true);
			ctx.fillStyle = color[4];
			ctx.fill();
			ctx.beginPath();
			ctx.arc(wid1, hei, len*0.34, 0, PI2, true);
			ctx.arc(wid2, hei, len*0.34, 0, PI2, true);
			ctx.fillStyle = color[this.color];
			ctx.fill();
			ctx.fill();
			ctx.fill();
			ctx.beginPath();
			ctx.moveTo(wid1, hei- len*0.22);
			ctx.lineTo(wid1, hei+ len*0.22);
			ctx.moveTo(wid2, hei- len*0.22);
			ctx.lineTo(wid2, hei+ len*0.22);
			ctx.strokeStyle = color[4];
			ctx.lineWidth = len/10;
			ctx.lineCap = "round";
			ctx.stroke();
			break;
			
		case 4:
			if(this.wid > this.hei) var len = this.hei;
			else var len = this.wid;
			if(len > 35) len = 35;
			ctx.beginPath();
			ctx.arc(this.center.x, this.center.y, len*0.43, 0, PI2, true);
			ctx.fillStyle = color[4];
			ctx.fill();
			ctx.beginPath();
			ctx.arc(this.center.x, this.center.y, len*0.36, 0, PI2, true);
			ctx.fillStyle = color[this.color];
			ctx.fill();
			ctx.fill();
			ctx.fill();
			ctx.beginPath();
			ctx.moveTo(this.center.x+ len*0.28* cos(this.rad1+ PI_4), this.center.y+ len*0.28* sin(this.rad1+ PI_4));
			ctx.lineTo(this.center.x- len*0.28* cos(this.rad1+ PI_4), this.center.y- len*0.28* sin(this.rad1+ PI_4));
			ctx.moveTo(this.center.x+ len*0.28* cos(this.rad1- PI_4), this.center.y+ len*0.28* sin(this.rad1- PI_4));
			ctx.lineTo(this.center.x- len*0.28* cos(this.rad1- PI_4), this.center.y- len*0.28* sin(this.rad1- PI_4));
			ctx.strokeStyle = color[4];
			ctx.lineWidth = len/10;
			ctx.lineCap = "round";
			ctx.stroke();
			break;
	}
};

//壁の移動を制御する関数
Wall.prototype.move = function(ball, wall){
	//速度の上限を設定
	this.vel.y = Math.max(Math.min(this.vel.y, 3), -3);
	//速度を位置情報に変換
	switch(this.type){
		case 2:
			if(this.vel.y > 0) this.vel.y *= 0.9;
			this.vel.y -= 0.01
			this.tl = this.tl.add(this.vel);
			this.tr = this.tr.add(this.vel);
			if(this.tl.y- this.tlTemp.y > this.uMax){
				this.tl.y = this.tlTemp.y + this.uMax;
				this.tr.y = this.tl.y;
				this.vel.y *= -0.1;
			}
			else if(this.tl.y- this.tlTemp.y < this.lMax){
				this.tl.y = this.tlTemp.y + this.lMax;
				this.tr.y = this.tl.y;
				this.vel.y = 0;
				this.vel.x = 0;
			}
			break;
			
		case 3:
			if(this.num < this.pair){
				this.vel.y *= 0.96;
				wall[this.pair].vel.y *= 0.96;
			}
			this.tl = this.tl.add(this.vel);
			this.tr = this.tr.add(this.vel);
			this.br = this.br.add(this.vel);
			this.bl = this.bl.add(this.vel);
			if(this.tl.y- this.tlTemp.y > this.uMax){
				this.tl.y = this.tlTemp.y + this.uMax;
				this.tr.y = this.trTemp.y + this.uMax;
				this.br.y = this.brTemp.y + this.uMax;
				this.bl.y = this.blTemp.y + this.uMax;
				this.vel.y *= -0.03;
			}
			if(this.tl.y- this.tlTemp.y < this.lMax){
				this.tl.y = this.tlTemp.y + this.lMax;
				this.tr.y = this.trTemp.y + this.lMax;
				this.br.y = this.brTemp.y + this.lMax;
				this.bl.y = this.blTemp.y + this.lMax;
				this.vel.y *= -0.03;
			}
			break;
			
		case 4:
			if(keyCode1[78]) this.radv += -0.003;
			else if(keyCode1[77]) this.radv += 0.003;
			else this.radv *= 0.93;
			this.radv = Math.min(Math.max(-0.2, this.radv), 0.2);
			this.rad1 += this.radv;
			this.rad2 += this.radv;
			if(this.rad1 > this.uMax){
				this.rad2 -= this.rad1- this.uMax;
				this.rad1 = this.uMax;
				this.radv *= -0.1
			}
			else if(this.rad1 < this.lMax){
				this.rad2 -= this.rad1- this.lMax;
				this.rad1 = this.lMax;
				this.radv *= -0.1;
			}
			if(this.rad1 < -PI || this.rad1 > PI){
				this.rad1 = mod(mod(this.rad1, PI2)+ PI, PI2)- PI;
			}
			if(this.rad2 < -PI || this.rad2 > PI){
				this.rad2 = mod(mod(this.rad2, PI2)+ PI, PI2)- PI;
			}
			if(this.centerRad < -PI || this.centerRad > PI){
				this.centerRad = mod(mod(this.centerRad, PI2)+ PI, PI2)- PI;
			}
			this.tl = this.center.add(angle(this.rad1+ this.centerRad).mul(this.centerLen));
			this.tr = this.center.add(angle(this.rad1- this.centerRad+ PI).mul(this.centerLen));
			this.br = this.center.add(angle(this.rad1+ this.centerRad+ PI).mul(this.centerLen));
			this.bl = this.center.add(angle(this.rad1- this.centerRad).mul(this.centerLen));
			break;
	}
}

//接点から壁の振る舞いを計算する関数
Wall.prototype.action = function(ball, wall){
	var e = coefficientRestitution01;
	switch(this.type){
		case 1:
			if(this.contactCnt01<1) return;
			else if(this.contactCnt01==1){
				this.color = this.contact[0].color;
				wall[this.pair].color = this.color;
				return;
			}
			for(i=0; i<this.contactCnt01-1; i++){
				for(j=i+1; j<this.contactCnt01; j++){
					if(this.contact[i].color != this.contact[j].colr){
						this.color = 3;
						ball[this.pair].color = this.color;
						return;
					}
				}
			}
			this.color = this.contact[0].color;
			ball[this.pair].color = this.color;
			return;
		
		case 2:
			for(i=0; i<this.contactCnt01; i++){
				var b = this.contact[i];
				if(b.side > 0 && b.side < 4){
					if(b.pairVel.y < 0.15){
						this.vel.y += 0.1* b.weight/ this.weight;
						continue;
					}
					var temp = (b.pairVel.y* (b.weight- e*this.weight) + this.vel.y* this.weight*(1+e))/ (this.weight+b.weight);
					this.vel.y = (this.vel.y* (this.weight- e*b.weight) + b.pairVel.y* b.weight*(1+e))/ (this.weight+b.weight);
					b.pairVel.y = temp;
				}
			}
			var uMax = Math.max(this.uMax*5/6-this.wid/24, this.uMax*5/6-1.5);
			if(this.tl.y- this.tlTemp.y > uMax){
				this.tl.y = this.tlTemp.y + uMax;
				this.tr.y = this.trTemp.y + uMax;
			}
			if(this.tl.y- this.tlTemp.y < this.lMax){
				this.tl.y = this.tlTemp.y + this.lMax;
				this.tr.y = this.trTemp.y + this.lMax;
			}
			if(this.tl.y- this.tlTemp.y > (this.uMax*5/6-this.wid/24)* 0.85) wall[this.pair].isAlive = false;
			if(this.tl.y- this.tlTemp.y < (this.uMax*5/6-this.wid/24)* 0.50) wall[this.pair].isAlive = true;
			return;
		
		case 3:
			var obje = wall[this.pair];
			if(this.num > obje.num) return;
			var weight = this.weight + obje.weight;
			for(i=0; i<this.contactCnt01; i++){
				var b = this.contact[i];
				if(b.side == 2 || b.side == 8){
					if(b.side == 2 && b.pairVel.y < 0) b.pairVel.y *= -0.1;
					else if(b.side == 8 && b.pairVel.y > 0) b.pairVel.y *= -0.1;
					this.vel.y = (this.vel.y* (weight- e*b.weight) + b.pairVel.y* b.weight*(1+e))/ (weight+b.weight);
				}
				else if(b.side < 4 || b.side > 6){
					var velhx = b.pairVel.cross(b.rad)* sin(b.rad);
					var velhy =-b.pairVel.cross(b.rad)* cos(b.rad);
					var velvx = b.pairVel.x - velhx;
					var velvy = b.pairVel.y - velhy;
					if(b.side < 4 && velvy < 0) velvy = velvy *= -0.1;
					if(b.side > 6 && velvy > 0) velvy = velvy *= -0.1;
					this.vel.y = (this.vel.y* (weight- e*b.weight) + velvy* b.weight*(1+e))/ (weight+b.weight);
				}
			}
			for(i=0; i<obje.contactCnt01; i++){
				var b = obje.contact[i];
				if(b.side == 2 || b.side == 8){
					if(b.side == 2 && b.pairVel.y < 0) b.pairVel.y *= -0.1;
					else if(b.side == 8 && b.pairVel.y > 0) b.pairVel.y *= -0.1;
					obje.vel.y = (obje.vel.y* (weight- e*b.weight) + b.pairVel.y* b.weight*(1+e))/ (weight+b.weight);
				}
				else if(b.side < 4 || b.side > 6){
					var velhx = b.pairVel.cross(b.rad)* sin(b.rad);
					var velhy =-b.pairVel.cross(b.rad)* cos(b.rad);
					var velvx = b.pairVel.x - velhx;
					var velvy = b.pairVel.y - velhy;
					if(b.side < 4 && velvy < 0) velvy = velvy *= -0.1;
					if(b.side > 6 && velvy > 0) velvy = velvy *= -0.1;
					obje.vel.y = (obje.vel.y* (weight- e*b.weight) + velvy* b.weight*(1+e))/ (weight+b.weight);
				}
			}
			this.vel = this.vel.sub(obje.vel).div(2);
			obje.vel.y = -this.vel.y;
			if(wall[3].tl.y+ wall[5].tl.y != wall[3].tlTemp.y+wall[5].tlTemp.y){
				console.log(wall[3], wall[5], wall[3].tl.y+ wall[5].tl.y, "!!!!!!!wall460");
				run = false;
			}
			return;
			
		case 4:
			for(i=0; i<this.contactCnt01; i++){
				var b = this.contact[i];
				var rad1;
				if(b.side%2 == 0 && b.side > 1){
					if(b.side == 2) rad1 = this.rad1 + PI;
					else if(b.side == 4) rad1 = this.rad2+ PI;
					else if(b.side == 6) rad1 = this.rad2;
					else if(b.side == 8) rad1 = this.rad1;
					
					var len = b.pos.sub(this.center).dot(rad1);
					var rad2 = atan2(b.pairVel);
					var vel = b.pairVel.norm();
					var hvel = cos(rad2- rad1)* vel;
					var vvel = -Math.abs(sin(rad2- rad1)* vel);
				}
				else if(b.side != 0 && b.side != 5){
					var rad = atan2(b.pairVel)- atan2(b.pos.sub(b.pairPos));
					var vel = b.pairVel.norm();
					var hvel = sin(rad)* vel;
					var vvel = -cos(rad)* vel;
					var rad = atan2(b.pos.sub(b.pairPos))- atan2(this.center.sub(b.pos));
					var len = b.pos.sub(this.center).norm()* sin(rad);
				}
				vvel = vvel*len/1000;
				this.radv = (this.radv*(this.weight*10- e*b.weight)+ vvel*(1+e)* b.weight)/(this.weight*10+b.weight);
			}
			return;
	}
}

//壁に対してボールがどの位置に来るかを計算する関数
Wall.prototype.areaCheck = function(b, p){
	var j = this.num;
	if(p.sub(this.tl).dot(this.rad2) >=0 && p.sub(this.tl).dot(this.rad1) <= 0){
		b.infoWithWall[j].pos.x = this.tl.x;
		b.infoWithWall[j].pos.y = this.tl.y;
		b.infoWithWall[j].side = 1;
	}
	else if(p.sub(this.tl).cross(this.rad1)>0 && p.sub(this.tl).dot(this.rad1)>=0 && p.sub(this.tr).dot(this.rad1)<=0){
		b.infoWithWall[j].pos.x = this.tl.x;
		b.infoWithWall[j].pos.y = this.tl.y;
		b.infoWithWall[j].rad = this.rad1- PI_2;
		b.infoWithWall[j].side = 2;
	}
	else if(p.sub(this.tr).dot(this.rad1) >= 0 && p.sub(this.tr).dot(this.rad2) >= 0){
		b.infoWithWall[j].pos.x = this.tr.x;
		b.infoWithWall[j].pos.y = this.tr.y;
		b.infoWithWall[j].side = 3;
	}
	else if(p.sub(this.bl).cross(this.rad2)>0 && p.sub(this.bl).dot(this.rad2)>=0 && p.sub(this.tl).dot(this.rad2)<=0){
		b.infoWithWall[j].pos.x = this.bl.x;
		b.infoWithWall[j].pos.y = this.bl.y;
		b.infoWithWall[j].rad = this.rad2- PI_2;
		b.infoWithWall[j].side = 4;
	}
	else if(p.sub(this.tr).cross(this.rad2)<0 && p.sub(this.tr).dot(this.rad2)<=0 && p.sub(this.br).dot(this.rad2)>=0){
		b.infoWithWall[j].pos.x = this.tr.x;
		b.infoWithWall[j].pos.y = this.tr.y;
		b.infoWithWall[j].rad = this.rad2+ PI_2;
		b.infoWithWall[j].side = 6;
	}
	else if(p.sub(this.bl).dot(this.rad1) <= 0 && p.sub(this.bl).dot(this.rad2) <= 0){
		b.infoWithWall[j].pos.x = this.bl.x;
		b.infoWithWall[j].pos.y = this.bl.y;
		b.infoWithWall[j].side = 7;
	}
	else if(p.sub(this.br).cross(this.rad1)<0 && p.sub(this.br).dot(this.rad1)<=0 && p.sub(this.bl).dot(this.rad1)>=0){
		b.infoWithWall[j].pos.x = this.br.x;
		b.infoWithWall[j].pos.y = this.br.y;
		b.infoWithWall[j].rad = this.rad1+ PI_2;
		b.infoWithWall[j].side = 8;
	}
	else if(p.sub(this.br).dot(this.rad2) <= 0 && p.sub(this.br).dot(this.rad1) >= 0){
		b.infoWithWall[j].pos.x = this.br.x;
		b.infoWithWall[j].pos.y = this.br.y;
		b.infoWithWall[j].side = 9;
	}
	else{
		b.infoWithWall[j].side = 5;
	}
}

//壁と正円の衝突判定
Wall.prototype.detectCollision01 = function(b, ball, wall){
	var j = this.num;
	if(b.contact[0].num.slice(0,-2) == this.num+"w" || !b.infoWithWall[j].canCollide) return;
	b.infoWithWall[j].side = 0;
	//円がどの辺あるいはどの角と衝突するかの判定
	this.areaCheck(b, b.pos);
	//得られた判別から当り判定を取っていく
	if(b.infoWithWall[j].side == 5){
		if(b.shootedFrame==counter){
			test[1] = b.pos
			ball[0].absorb(b);
			return;
		}
		else{
			this.areaCheck(b, b.pos.sub(b.vel));
		}
		if(b.infoWithWall[j].side == 5){
		b.explosion(ball, wall);
		}
	}
	if(b.infoWithWall[j].side%2==1){
		//この場合は角に当たる
		var length = b.pos.sub(b.infoWithWall[j].pos).norm();
		if(length <= b.size){
			rad = atan2(b.infoWithWall[j].pos.sub(b.pos).sub(b.vel));
			//反発後の計算
			this.contact[this.contactCnt01].pos = b.infoWithWall[j].pos.add(P0);
			this.contact[this.contactCnt01].excess = b.size- length;
			this.contact[this.contactCnt01].num = b.num+"c"+"w"+"0";
			this.contact[this.contactCnt01].weight = b.weight;
			this.contact[this.contactCnt01].rad = atan2(b.pos.y- b.infoWithWall[j].pos.y, b.pos.x- b.infoWithWall[j].pos.x);
			this.contact[this.contactCnt01].color = b.color;
			this.contact[this.contactCnt01].side = b.infoWithWall[j].side;
			this.contact[this.contactCnt01].pairPos = b.pos.add(P0);
			this.contact[this.contactCnt01].pairVel = b.vel.add(P0);
			
			b.contact[b.contactCnt01].pos = b.infoWithWall[j].pos.add(P0);
			b.contact[b.contactCnt01].length = b.contact[b.contactCnt01].pos.sub(b.pos).norm();
			b.contact[b.contactCnt01].excess = b.size- b.infoWithWall[j].pos.sub(b.pos).norm();
			b.contact[b.contactCnt01].rad = atan2(b.infoWithWall[j].pos.sub(b.pos))
			b.contact[b.contactCnt01].tangent = b.contact[b.contactCnt01].rad+ PI_2;
			b.contact[b.contactCnt01].weight = "NaN";
			b.contact[b.contactCnt01].num = this.num+"w"+"c"+"0";
			b.contact[b.contactCnt01].side = b.infoWithWall[j].side;
			//最後にcontactCnt01をインクリメントして終わり
			this.contactCnt01++;
			b.contactCnt01++;
		}
		else if(length <= b.size*1.5) return;
	}
	else if(b.infoWithWall[j].side%2==0){
		//この場合は辺に当たる
		var drop = (cos(b.infoWithWall[j].rad)* (b.pos.x - b.infoWithWall[j].pos.x) + sin(b.infoWithWall[j].rad)* (b.pos.y - b.infoWithWall[j].pos.y));
		if( drop <= b.size){
			//反発後の計算
			this.contact[this.contactCnt01].pos = b.pos.sub(angle(b.infoWithWall[j].rad).mul(drop));
			this.contact[this.contactCnt01].excess = b.size- drop;
			this.contact[this.contactCnt01].num = b.num+"c"+"w"+"0";
			this.contact[this.contactCnt01].weight = b.weight;
			this.contact[this.contactCnt01].rad = b.infoWithWall[j].rad;
			this.contact[this.contactCnt01].color = b.color;
			this.contact[this.contactCnt01].side = b.infoWithWall[j].side;
			this.contact[this.contactCnt01].pairPos = b.pos.add(P0);
			this.contact[this.contactCnt01].pairVel = b.vel.add(P0);
			
			b.contact[b.contactCnt01].pos = this.contact[this.contactCnt01].pos.add(P0);
			b.contact[b.contactCnt01].length = b.contact[b.contactCnt01].pos.sub(b.pos).norm();
			b.contact[b.contactCnt01].excess = b.size- drop;
			b.contact[b.contactCnt01].rad = b.infoWithWall[j].rad+ PI;
			b.contact[b.contactCnt01].tangent = b.infoWithWall[j].rad- PI_2;
			b.contact[b.contactCnt01].weight = "NaN";
			b.contact[b.contactCnt01].num = this.num+"w"+"c"+"0";
			b.contact[b.contactCnt01].side = b.infoWithWall[j].side;
			//最後にcontactCnt01をインクリメントして終わり
			this.contactCnt01++;
			b.contactCnt01++;
		}
		else if(drop <= b.size*1.5) return;
	}
	else{
		//console.log("正円が内部に入っている")
	}
	//b.infoWithWall[j].canCollide = false;
}

//壁と歪円の衝突判定
Wall.prototype.detectCollision02 = function(b, ball, wall){
	// for(var i=0; i<b.contactCnt01; i++){
		
	// }
	for(i=0; i<b.contactCnt01; i++){
		if(b.contact[i].num.slice(0,-3) == this.num && b.contact[i].num.slice(-3,-2) == "w") return; 
	}
	if(!b.infoWithWall[this.num].canCollide) return;
	b.infoWithWall[this.num].side = 0;
	//円がどの辺あるいはどの角と衝突するかの判定
	this.areaCheck(b, b.pos);
	//得られた判別から当り判定を取っていく
	if(b.infoWithWall[this.num].side == 5){
		if(b.shootedFrame == counter) this.areaCheck(b, ball[0].pos);
		var p = b.pos.sub(b.vel);
		this.areaCheck(b, p);
		if(b.infoWithWall[this.num].side == 5){
		b.explosion(ball, wall);
		}
	}
	//点とぶつかるかの判定
	if(b.infoWithWall[this.num].side%2==1){
		var rad = atan2(b.infoWithWall[this.num].pos.sub(b.pos));
		//接点がどのdotの間にあるのか調べる。iがdot_numberになる
		for(var i=0; i<b.dot.length; i++){
			if(mod(rad, PI2) < mod(b.dot[i].rad- b.dot[0].rad, PI2)) break;
		}
		var dotNum = mod(i);
		var t = (rad- b.dot[mod(dotNum-1)].rad)/ (b.dot[dotNum].rad- b.dot[mod(dotNum-1)].rad);
		var tangent1 = atan2(b.dot[dotNum].abs.sub(b.dot[mod(dotNum-2)].abs));
		var tangent2 = atan2(b.dot[mod(dotNum+1)].abs.sub(b.dot[mod(dotNum-1)].abs));
		var excess = b.dot[mod(dotNum-1)].abs.sub(b.dot[dotNum].abs).cross(b.infoWithWall[this.num].pos.sub(b.dot[dotNum].abs));
		if(excess < 0 && excess > -b.size){
			//接点の計算
			this.contact[this.contactCnt01].pos = b.infoWithWall[this.num].pos.add(P0);
			this.contact[this.contactCnt01].excess = -excess;
			this.contact[this.contactCnt01].num = b.num+"d"+"w"+"0";
			this.contact[this.contactCnt01].weight = b.weight;
			this.contact[this.contactCnt01].rad = rad+ PI;
			this.contact[this.contactCnt01].color = b.color;
			this.contact[this.contactCnt01].side = b.infoWithWall[this.num].side;
			this.contact[this.contactCnt01].pairPos = b.pos.add(P0);
			this.contact[this.contactCnt01].pairVel = b.vel.add(P0);
			
			b.contact[6+b.contactCnt02].pos = b.infoWithWall[this.num].pos.add(P0);
			b.contact[6+b.contactCnt02].length = b.contact[6+b.contactCnt02].pos.sub(b.pos).norm();
			b.contact[6+b.contactCnt02].excess = -excess;
			b.contact[6+b.contactCnt02].rad = rad;
			b.contact[6+b.contactCnt02].tangent = (1-t)*tangent1 + t*tangent2;
			b.contact[6+b.contactCnt02].weight = "NaN";
			b.contact[6+b.contactCnt02].num = this.num+"w"+"d"+"0";
			b.contact[6+b.contactCnt02].side = b.infoWithWall[this.num].side;
			//最後にcontactCnt01をインクリメントして終わり
			this.contactCnt01++;
			b.contactCnt02++;
		}
		return;
	}
	//線とぶつかるかの判定
	else if(b.infoWithWall[this.num].side%2==0){
		var rad = b.infoWithWall[this.num].rad+ PI;
		var dotNum = mod(Math.round(rad*b.dot.length/PI2));
		//壁に垂直な向きへの長さが一番大きい点を調べる
		if(b.dot[mod(dotNum+1)].rel.dot(rad) > b.dot[mod(dotNum-1)].rel.dot(rad)){
			while(b.dot[mod(dotNum+1)].rel.dot(rad) > b.dot[dotNum].rel.dot(rad)){
				dotNum = mod(dotNum+1);
			}
		}
		else{
			while(b.dot[mod(dotNum-1)].rel.dot(rad) > b.dot[dotNum].rel.dot(rad)){
				dotNum = mod(dotNum-1);
			}
		}
		if(b.dot[dotNum].abs.sub(b.infoWithWall[this.num].pos).dot(rad) >= 0){
			//接点の計算
			var a1 = (b.dot[dotNum].abs.y- b.pos.y)/ (b.dot[dotNum].abs.x- b.pos.x);
			var a3 = -1/tan(rad);
			this.contact[this.contactCnt01].pos.x = (a1*b.pos.x- b.pos.y- a3*b.infoWithWall[this.num].pos.x+ b.infoWithWall[this.num].pos.y)/ (a1-a3);
			this.contact[this.contactCnt01].pos.y = a1* (this.contact[this.contactCnt01].pos.x- b.pos.x)+ b.pos.y;
			if(Math.abs(a1) == Infinity){
				this.contact[this.contactCnt01].pos = b.infoWithWall[this.num].pos.add(P0);
			}
			else if(Math.abs(a3) == Infinity){
				this.contact[this.contactCnt01].pos.x = b.infoWithWall[this.num].pos.x;
				this.contact[this.contactCnt01].pos.y = b.pos.y;
			}
			this.contact[this.contactCnt01].excess = b.dot[dotNum].abs.sub(this.contact[this.contactCnt01].pos).dot(PI-rad);
			this.contact[this.contactCnt01].num = b.num+"d"+"w"+"0";
			this.contact[this.contactCnt01].weight = b.weight;
			this.contact[this.contactCnt01].rad = rad;
			this.contact[this.contactCnt01].color = b.color;
			this.contact[this.contactCnt01].side = b.infoWithWall[this.num].side;
			this.contact[this.contactCnt01].pairPos = b.pos.add(P0);
			this.contact[this.contactCnt01].pairVel = b.vel.add(P0);
			
			var num = 6+b.contactCnt02;
			b.contact[num].pos.x = (a1*b.pos.x- b.pos.y- a3*b.infoWithWall[this.num].pos.x+ b.infoWithWall[this.num].pos.y)/ (a1-a3);
			b.contact[num].pos.y = a1* (b.contact[num].pos.x- b.pos.x)+ b.pos.y;
			if(Math.abs(a1) == Infinity){
				b.contact[num].pos = b.infoWithWall[this.num].pos.add(P0);
			}
			else if(Math.abs(a3) == Infinity){
				b.contact[num].pos.x = b.infoWithWall[this.num].pos.x;
				b.contact[num].pos.y = b.pos.y;
			}
			b.contact[num].length = b.contact[num].pos.sub(b.pos).norm();
			b.contact[num].excess = b.dot[dotNum].abs.sub(b.contact[num].pos).dot(PI-rad);
			b.contact[num].rad = atan2(b.contact[num].pos.sub(b.pos));
			b.contact[num].tangent = rad + PI_2;
			b.contact[num].weight = "NaN";
			b.contact[num].num = this.num+"w"+"d"+"0";
			b.contact[num].side = b.infoWithWall[this.num].side;
			//最後にcontactCntをインクリメントして終わり
			this.contactCnt01++;
			b.contactCnt02++;
		}
		return;
	}
	else{
	
	}
}
