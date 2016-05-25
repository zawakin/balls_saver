//動体を定義する関数=========================================================================================
var Character = function(){
	//諸々の設定
	this.pos = new Point();
	this.vel = new Point();
	this.isAlive = false;
	this.isVisible = false;
	this.color = 0;
	this.size = 0;
	this.weight = 0;
	this.num = 0;
	this.arc = 0;
	this.isDistort = false;
	this.isDistorted = false;
	this.contactCnt01 = 0;
	this.contactCnt01Temp = 0;
	this.contactCnt02 = 0;
	this.explosionFrame = 0;
	this.shootedFrame = 0;
	this.contact = new Array(12);
	for(i=0; i<this.contact.length; i++){
		this.contact[i] = {};
		this.contact[i].num = "NaN";
		this.contact[i].pos = new Point();
		this.contact[i].rad = 0;
		this.contact[i].tangent = 0;
		this.contact[i].length = 0;
		this.contact[i].excess = 0;
		this.contact[i].weight = 0;
		this.contact[i].side = 0;
		this.contact[i].pairPos = new Point();
		this.contact[i].pairVel = new Point();
	}
	this.dot = new Array(64);
	for(i=0; i<this.dot.length; i++){
		this.dot[i] = {};
		this.dot[i].abs = new Point();
		this.dot[i].rel = new Point();
		this.dot[i].rad = 0;
	}
	this.infoWithWall = new Array(WALL_MAX_COUNT);
	for(i=0; i<this.infoWithWall.length; i++){
		this.infoWithWall[i] = {};
		this.infoWithWall[i].pos = new Point();
		this.infoWithWall[i].rad = 0;
		this.infoWithWall[i].canCollide = false;
		this.infoWithWall[i].side = 0;
	}
	this.bezier = new Array(12);
	for(i=0; i<this.bezier.length; i++){
		this.bezier[i] = {}
		this.bezier[i].radGap = 0;
		this.bezier[i].dotNum = 0;
		this.bezier[i].arc1 = 0;
		this.bezier[i].arc2 = 0;
		this.bezier[i].midPos = new Point();
		this.bezier[i].midTangent = 0;
		this.bezier[i].midExcess = 0;
		this.bezier[i].midArc = 0;
	}
}

//球を生成する関数
Character.prototype.set = function(p, s, v, c){
	//座標、速度、サイズをセット
	this.pos.x = p.x;
	this.pos.y = p.y;
	this.vel.x = v.x;
	this.vel.y = v.y;
	this.color = c;
	this.size = s;
	this.weight = s*s;
	this.isAlive = true;
	this.isVisible = true;
};

//球を初期化する関数
Character.prototype.initialize = function(){
	this.isAlive = false;
	this.isVisible = false;
	this.contactCnt01 = 0;
	this.contactCnt02 = 0;
	this.contactCnt01Temp = 0;
	this.isDistort = false;
	this.isDistorted = false;
	this.size = 0;
	this.weight = 0;
	for(i=0; i<this.contact.length; i++){
		this.contactInitialize(i);
	}
	for(i=0; i<this.bezier.length; i++){
		this.bezierInitialize(i);
	}
}

//球のcontactを初期化する関数
Character.prototype.contactInitialize = function(i){
	this.contact[i].num = "NaN";
	this.contact[i].pos.x = 0;
	this.contact[i].pos.y = 0;
	this.contact[i].rad = 0;
	this.contact[i].tangent = 0;
	this.contact[i].length = 0;
	this.contact[i].excess = 0;
	this.contact[i].weight = 0;
	this.contact[i].side = 0;
	this.contact[i].pairPos.x = 0;
	this.contact[i].pairPos.y = 0;
	this.contact[i].pairVel.x = 0;
	this.contact[i].pairVel.y = 0;
}

//球のcontactを複製する関数
Character.prototype.contactCopy = function(i, j){
	this.contact[i].pos.x = this.contact[j].pos.x;
	this.contact[i].pos.y = this.contact[j].pos.y;
	this.contact[i].rad = this.contact[j].rad;
	this.contact[i].excess = this.contact[j].excess;
	this.contact[i].length = this.contact[j].length;
	this.contact[i].tangent = this.contact[j].tangent;
	this.contact[i].num = this.contact[j].num;
	this.contact[i].weight = this.contact[j].weight;
	this.contact[i].side = this.contact[j].side;
	this.contact[i].pairPos.x = this.contact[j].pairPos.x;
	this.contact[i].pairPos.y = this.contact[j].pairPos.y;
	this.contact[i].pairVel.x = this.contact[j].pairVel.x;
	this.contact[i].pairVel.y = this.contact[j].pairVel.y;
}

//球のbezierを初期化する関数
Character.prototype.bezierInitialize = function(i){
	this.bezier[i].radGap = 0;
	this.bezier[i].dotNum = 0;
	this.bezier[i].arc1 = 0;
	this.bezier[i].arc2 = 0;
	this.bezier[i].midPos.x = 0;
	this.bezier[i].midPos.y = 0;
	this.bezier[i].midTangent = 0;
	this.bezier[i].midExcess = 0;
	this.bezier[i].midArc = 0;
}

//球を描写する関数
Character.prototype.draw = function(f, b){
	//ボールの色に描写を合わせる
	ctx.beginPath();
	if(this.isDistort || this.isDistorted){
		//歪円だった場合
		var dot = this.dot
		ctx.moveTo(dot[0].abs.x, dot[0].abs.y);
		for(i=1; i<dot.length; i++){
			ctx.lineTo(dot[i].abs.x, dot[i].abs.y);
		}
		ctx.closePath();
	}
	else ctx.arc(this.pos.x, this.pos.y, this.size, 0, PI2, true);
	
	if(f==2 && this.shootedFrame > counter-2){
		ctx.save();
		ctx.clip();
		if(b.isDistort || b.isDistorted){
			ctx.moveTo(b.dot[0].abs.x, b.dot[0].abs.y);
			for(i=0; i<b.dot.length; i++){
				ctx.lineTo(b.dot[i].abs.x, b.dot[i].abs.y)
			}
			ctx.closePath();
		}
		else ctx.arc(b.pos.x, b.pos.y, b.size, 0, PI2, false);
	}
	if(f == 1) ctx.fillStype = color[4];
	else ctx.fillStyle = color[this.color];
	ctx.fill();
	ctx.restore();
}

//球を破裂させる関数
Character.prototype.explosion = function(ball, wall){
	this.initialize();
	var amount = Math.max(Math.floor(sqrt(this.size/3)+ Math.random()*2), 4);
	var count = 0;
	var j = 1;
	while(count < amount){
		if(!ball[ball.length-j].isVisible){
			var v = new Point();
			var size = Math.max(sqrt(this.weight/amount)+ Math.random()*3- 2, 8);
			v.x = Math.min(sqrt(Math.abs(this.vel.x/2))*4, 3)+ Math.random()*8- 4;
			v.y = Math.min(sqrt(Math.abs(this.vel.y/2))*4, 3)+ Math.random()*6- 7;
			ball[ball.length-j].set(this.pos, size, v, Math.ceil(Math.random()*2));
			ball[ball.length-j].isAlive = false;
			count++;
		}
		j++;
	}
}

//球同士の吸収を処理する関数
Character.prototype.absorb = function(b){
	//もし自機と撃ったばかりの球が遠ざかるようになっていたら、吸収を無視する
	if(this.num==0 && b.shootedFrame+30 > counter){
		var rad = atan2(this.pos.sub(b.pos))
		console.log(this.vel.add(b.vel))
		console.log(this.vel.add(b.vel).dot(rad))
		console.log(angle(rad))
		console.log(angle(rad).mul(this.vel.add(b.vel).dot(rad)).dot(rad))
		if(angle(rad).mul(this.vel.add(b.vel).dot(rad)).dot(rad) < 0) return
	}
	//吸収後の重さと半径、重心と速度を求める
	var weight = this.weight + b.weight;
	if(b.shootedFrame+2 < counter){
		this.pos = this.pos.mul(this.weight).add(b.pos.mul(b.weight)).div(weight);
		this.vel = this.vel.mul(this.weight).add(b.vel.mul(b.weight)).div(weight);
	}
	this.weight = weight;
	this.size = sqrt(weight);
	//球の各dotの座標を移動する
	for(i=0; i<this.dot.length; i++){
		this.dot[i].abs = this.pos.add(this.dot[i].rel);
	}
	//遅い番号の生存フラグを偽にし、諸々の情報をリセットする
	b.initialize();
}

//球のdotの情報を計算する関数
Character.prototype.calcuDotInfo = function(center){
	for(var i=0; i<dotLen; i++){
		this.dot[i].rel = this.dot[i].abs.sub(center);
		this.dot[i].rad = atan2(this.dot[i].rel);
	}
}

//重力を作用させる関数
Character.prototype.fall = function(){
	if(!this.isDistorted) this.vel.y += 0.2;
	else this.vel.y += Math.max(0, 0.1- this.arc/ this.size/3.5);
}

//速度を位置情報に変換する関数
Character.prototype.move = function(){
	//速度の上限を設定
	if(this.vel.norm() > maxVel){
		this.vel = this.vel.normalize().mul(maxVel);
	}
	//速度を位置情報に変換
	this.pos = this.pos.add(this.vel);
}

//球の位置情報を補正する関数
Character.prototype.positionCorrection = function(ball, wall, n, m){
	//めり込んだ分の補正を行う
	for(i=0; i<6+this.contactCnt02; i++){
		if(i<6 && i>=this.contactCnt01) continue;
		var rad = this.contact[i].rad+ PI;
		var excess = this.contact[i].excess;
		this.pos.x += excess* cos(rad);
		this.pos.y += excess* sin(rad);
	}
}

//球のバウンドを処理する関数
Character.prototype.bound = function(ball, wall){
	var con = this.contact;
	for(i=0; i<6+this.contactCnt02; i++){
		if(i>=this.contactCnt01 && i<6) continue;
		var rad = this.contact[i].rad;
		//相手が球か壁かで場合分けをする
		if(this.contact[i].num.slice(-3,-2) == "w"){
			//相手が壁の場合
			var e = coefficientRestitution01;
			var obje = wall[this.contact[i].num.slice(0,-3)];
			var velvx = this.vel.dot(rad)* cos(rad);
			var velvy = this.vel.dot(rad)* sin(rad);
			var velhx = this.vel.x- velvx;
			var velhy = this.vel.y- velvy;
			//壁の種類によって場合分け
			if(obje.type == 0 || obje.type == 1){
				if(new Point(velvx, velvy).dot(rad) < 0 && this.shootedFrame==counter) {test[0]++;return;}
				velvx *= -e;
				velvy *= -e;
			}
			else if(obje.type == 2){
				if(new Point(velvx, velvy).dot(rad) < 0) return;
					if(con[i].side > 3 && con[i].side < 7){
					velvx *= -e;
					velvy = (velvy* (this.weight- e*obje.weight*10)+ obje.vel.y*(1+e)*obje.weight*10)/ (this.weight+ obje.weight*10);
				}
				else if(con[i].side != 0 && con[i].side != 5){
					velvx *= -e;
					velvy *= -e;
				}
			}
			else if(obje.type == 3){
				if(con[i].side == 4 || con[i].side == 6){
					if(new Point(velvx, velvy).dot(rad) < 0) return;
					velvx *= -e;
					velvy *= -e;
				}
				else if(con[i].side != 0 && con[i].side != 5){
					if(new Point(velvx- obje.vel.x, velvy- obje.vel.y).dot(rad) < 0) return;
					if(con[i].side < 4 && Math.abs(velvy) < 0.01 && obje.vel.y > 0) continue;
					if(con[i].side > 6 && Math.abs(velvy) < 0.01 && obje.vel.y < 0) continue;
					velvx *= -e;
					velvy = (velvy* (this.weight- e*obje.weight*10)+ obje.vel.y*(1+e)*obje.weight*10)/ (this.weight+ obje.weight*10);
				}
			}
			else if(obje.type == 4){
				var rad;
				var len;
				if(con[i].side%2 == 0 && con[i].side > 1){
					if(con[i].side == 2) rad = obje.rad1;
					else if(con[i].side == 4) rad = obje.rad2;
					else if(con[i].side == 6) rad = obje.rad2+ PI;
					else if(con[i].side == 8) rad = obje.rad1+ PI;
					len = con[i].pos.sub(obje.center).dot(rad);
					var vx = len* obje.radv* cos(rad+ PI_2);
					var vy = len* obje.radv* sin(rad+ PI_2);
					if(new Point(velvx- vx, velvy- vy).dot(rad) < -0.001) return;
					if(new Point(velvx, velvy).norm() < 0.1 && new Point(vx, vy).norm() < 0.1){
						velvx *= -e;
						velvy *= -e;
					}
					else{
						velvx = (velvx* (this.weight- e*obje.weight*10)+ vx* (1+e)* obje.weight*10)/ (this.weight+ obje.weight*10);
						velvy = (velvy* (this.weight- e*obje.weight*10)+ vy* (1+e)* obje.weight*10)/ (this.weight+ obje.weight*10);
					}
				}
				else if(con[i].side != 0 && con[i].side != 5){
					rad = atan2(con[i].pos.sub(this.pos))- atan2(obje.center.sub(con[i].pos));
					len = -obje.center.sub(con[i].pos).norm()* sin(rad);
					rad = atan2(con[i].pos.y- this.pos.y, con[i].pos.x- this.pos.x);
					var vx = len* obje.radv* cos(rad);
					var vy = len* obje.radv* sin(rad);
					if(new Point(velvx- vx, velvy- vy).dot(rad) < 0) return;
					if(new Point(velvx, velvy).norm() < 0.1 && new Point(vx, vy).norm() < 0.1){
						velvx *= -e;
						velvy *= -e;
					}
					else{
						velvx = (velvx* (this.weight- e*obje.weight*10)+ vx* (1+e)* obje.weight*10)/ (this.weight+ obje.weight*10);
						velvy = (velvy* (this.weight- e*obje.weight*10)+ vy* (1+e)* obje.weight*10)/ (this.weight+ obje.weight*10);
					}
				}
			}
		}
		else{
			//相手が球の場合
			var e = coefficientRestitution02;
			var b = this.contact[i];
			var velvx = this.vel.dot(rad)* cos(rad);
			var velvy = this.vel.dot(rad)* sin(rad);
			var velhx = this.vel.x- velvx;
			var velhy = this.vel.y- velvy;
			var vx = b.pairVel.dot(rad)* cos(rad);
			var vy = b.pairVel.dot(rad)* sin(rad);
			//もし二つの球が相対的に離れるように動いているのに、接点を持っている場合衝突を無視する
			if(new Point(velvx- vx, velvy- vy).dot(rad) < 0) return;
			velvx = (velvx* (this.weight- e*b.weight)+ vx* (1+e)* b.weight)/ (this.weight+ b.weight);
			velvy = (velvy* (this.weight- e*b.weight)+ vy* (1+e)* b.weight)/ (this.weight+ b.weight);
		}
		this.vel.x = velhx + velvx;
		this.vel.y = velhy + velvy;
	}
}

//クリック時に動作する関数======================================================================================
//マウスを押した時に点線を描画する関数
Character.prototype.strokeDottedLine = function(c){
	var space = 2+ Math.max(Math.min(sqrt(this.size), 10), 3)+ length/50;
	var dotted = Math.floor((length+space+1)/ space);
	var p1x, p1y, p2x, p2y;
	var len1 = this.dot[radNum].rel.norm();
	var len2 = length+ len1- space +2;
	ctx.beginPath();
	for(var i=1; i<dotted/2-1; i++){
		ctx.moveTo(this.pos.x+ (len2- space*2*i)* cos(radian), this.pos.y+ (len2- space*2*i)* sin(radian));
		ctx.lineTo(this.pos.x+ (len2- space*(2*i+1))* cos(radian), this.pos.y+ (len2- space*(2*i+1))* sin(radian));
	}
	if(dotted%2 == 0 && dotted > 2){
		ctx.moveTo(this.pos.x+ (len2- space*2*i)* cos(radian), this.pos.y+ (len2- space*2*i)* sin(radian));
		ctx.lineTo(this.pos.x+ len1* cos(radian), this.pos.y+ len1* sin(radian));
	}
	ctx.strokeStyle = color[c];
	ctx.lineCap = "butt";
	ctx.lineWidth = 2+ Math.max(Math.min(sqrt(this.size), 8), 3)+ length/260;
	test[0] = sqrt(this.size);
	ctx.closePath();
	ctx.stroke();
};

//マウスを放した時に新しい球を発射する関数
Character.prototype.shoot = function(b, c){
	this.size = 13;
	if(b.weight- this.size*this.size < 100　|| length<=0) return;
	this.vel.x = sqrt(length)* cos(radian)*0.7;
	this.vel.y = sqrt(length)* sin(radian)*0.7;
	if(this.vel.norm() > maxVel){
		var p = this.vel.normalize();
		this.vel = p.mul(maxVel);
	}
	var len = b.dot[radNum].rel.norm()//+ this.size;
	this.pos.x = b.pos.x+ len* cos(radian);
	this.pos.y = b.pos.y+ len* sin(radian);
	this.set(this.pos, this.size, this.vel, c);
	this.shootedFrame = counter;
	b.weight -= this.weight;
	b.size = sqrt(b.weight);
}

//球の吸収、衝突判定について===================================================================================
//球の衝突判定をまとめた関数
Character.prototype.collisionCheck = function(ball, wall, f){
	//この場合はボールは正円
	for(var i=this.num+1; i<ball.length; i++){
		//まずはほかのボールとの当り判定
		if(ball[i].isAlive && this.color != ball[i].color && !(this.num == 0 && this.size > ball[i].size)){
			if(!ball[i].isDistorted && f) this.detectCollision01(ball[i]);
			else ball[i].detectCollision02(this, false);
		}
	}
	//次に壁との当り判定
	for(var i=0; i<wall.length; i++){
		if(wall[i].isAlive && this.color != wall[i].color) wall[i].detectCollision01(this, ball, wall);
	}
};

//相手の中心座標に一番近いdotの番号を調べる
Character.prototype.calcuDotnum = function(b){
	var rad = atan2(b.pos.sub(this.pos));
	var i = mod(Math.ceil(rad* dotLen/PI2));
	if(this.dot[mod(i+1)].abs.sub(b.pos).norm() < this.dot[mod(i-1)].abs.sub(b.pos).norm()){
		i = mod(i+1);
		while(this.dot[mod(i+1)].abs.sub(b.pos).norm() < this.dot[i].abs.sub(b.pos).norm()){
			i = mod(i+1);
		}
	}
	else{
		while(this.dot[mod(i-1)].abs.sub(b.pos).norm() < this.dot[i].abs.sub(b.pos).norm()){
			i = mod(i-1);
		}
	}
	return i;
}

//正円と正円で吸収判定を取る関数
Character.prototype.detectAbsorption01 = function(b){
	if(b.pos.sub(this.pos).norm() < this.size + b.size){
		if(b.shootedFrame+1 < counter){
			this.absorb(b);
		}
	}
}

//正円と歪円で吸収判定を取る関数
Character.prototype.detectAbsorption02 = function(b, f){
	var dotNum = this.calcuDotnum(b);
	var len = this.dot[dotNum].abs.sub(b.pos).norm();
	if(len<b.size || this.pos.sub(b.pos).norm()<this.pos.sub(this.dot[dotNum].abs).norm()){
		if(b.shootedFrame+1 < counter){
			var weight = this.weight+ b.weight;
			//番号が遅いほうを殺す。その判定をfでおこなう
			if(f) this.absorb(b);
			else b.absorb(this);
		}
	}
}

//歪円と歪円で吸収判定を取る関数
Character.prototype.detectAbsorption03 = function(b){
	var dotNum1 = this.calcuDotnum(b);
	var dotNum2 = b.calcuDotnum(this);
	var len1 = this.dot[dotNum1].abs.sub(this.pos).norm();
	var len2 = b.dot[dotNum2].abs.sub(b.pos).norm();
	if(this.pos.sub(b.pos).norm() < (len1 + len2)){
		this.absorb(b);
	}
}

//正円と正円で衝突判定を取る関数
Character.prototype.detectCollision01 = function(b){
	if(this.contact[0].num.slice(0,-2) == b.num+"c") return;
	if(b.pos.sub(this.pos).norm() < this.size + b.size){
		//衝突時の接点の情報を求める
		var rad = atan2(b.pos.sub(this.pos));
		var len = b.pos.sub(this.pos).norm();
		var len1 = (len*len + this.size*this.size - b.size*b.size)/ (2*len);
		
		this.contact[this.contactCnt01].pos.x = this.pos.x+ cos(rad)* len1;
		this.contact[this.contactCnt01].pos.y = this.pos.y+ sin(rad)* len1;
		this.contact[this.contactCnt01].rad = rad;
		this.contact[this.contactCnt01].tangent = rad + PI_2;
		this.contact[this.contactCnt01].length = this.contact[this.contactCnt01].pos.sub(this.pos).norm();
		this.contact[this.contactCnt01].excess = this.size - len1;
		this.contact[this.contactCnt01].weight = b.weight;
		this.contact[this.contactCnt01].num = b.num+"c"+"c"+"0";
		this.contact[this.contactCnt01].pairPos = b.pos.add(P0);
		this.contact[this.contactCnt01].pairVel = b.vel.add(P0);
		
		rad = rad+ PI;
		var len2 = (len*len + b.size*b.size - this.size*this.size)/ (2*len);
		b.contact[b.contactCnt01].pos.x = b.pos.x+ cos(rad)* len2;
		b.contact[b.contactCnt01].pos.y = b.pos.y+ sin(rad)* len2;
		b.contact[b.contactCnt01].rad = rad;
		b.contact[b.contactCnt01].tangent = rad + PI_2;
		b.contact[b.contactCnt01].length = b.contact[b.contactCnt01].pos.sub(b.pos).norm();
		b.contact[b.contactCnt01].excess = b.size - len2;
		b.contact[b.contactCnt01].weight = this.weight;
		b.contact[b.contactCnt01].num = this.num+"c"+"c"+"0";
		b.contact[b.contactCnt01].pairPos = this.pos.add(P0);
		b.contact[b.contactCnt01].pairVel = this.vel.add(P0);
		//最後にcontactCntをインクリメントと互いの衝突済みフラグを真にして終わりして終了
		this.contactCnt01++;
		b.contactCnt01++;
	}
}

//正円と歪円で衝突判定を取る関数
Character.prototype.detectCollision02 = function(b, f){
	if(!f && this.contact[0].num.slice(0,-2) == b.num+"b") return;
	for(i=0; i<this.contactCnt01; i++){
		if(this.contact[i].num.slice(0,-3) == b.num && this.contact[i].num.slice(-3,-2) != "w") return; 
	}
	//まずは正円に一番近い歪円上の点を求める。
	var dotNum = this.calcuDotnum(b);
	var len = this.dot[dotNum].abs.sub(b.pos).norm();
	if(len <b.size || this.pos.sub(b.pos).norm() < this.pos.sub(this.dot[dotNum].abs).norm()){
		//衝突時の接点の情報を求める
		var excess = b.size- len;
		var rad1 = atan2(this.dot[dotNum].abs.sub(b.pos));
		var rad2 = atan2(b.pos.sub(this.pos));
		var tangent1 = atan2(this.dot[mod(dotNum-2)].abs.sub(this.dot[dotNum].abs));
		var tangent2 = atan2(this.dot[dotNum].abs.sub(this.dot[mod(dotNum+2)].abs));
		var t = mod(rad2- this.dot[mod(dotNum-1)].rad, PI2)/ mod(this.dot[mod(dotNum+1)].rad- this.dot[mod(dotNum-1)].rad, PI2);
		t = Math.max(Math.min(t, 1), -1);
		var tangent = mod(tangent1+ mod(tangent2- tangent1, PI2)*t, PI2);
		
		this.contact[6+this.contactCnt02].pos = this.dot[dotNum].abs.add(P0);
		this.contact[6+this.contactCnt02].rad = atan2(this.dot[dotNum].abs.sub(this.pos));
		this.contact[6+this.contactCnt02].tangent = rad1- PI_2;
		this.contact[6+this.contactCnt02].length = this.contact[6+this.contactCnt02].pos.sub(this.pos).norm();
		this.contact[6+this.contactCnt02].excess = excess* this.size/ (this.size+b.size);
		this.contact[6+this.contactCnt02].weight = b.weight;
		this.contact[6+this.contactCnt02].num = b.num+"c"+"d"+"0";
		this.contact[6+this.contactCnt02].pairPos = b.pos.add(P0);
		this.contact[6+this.contactCnt02].pairVel = b.vel.add(P0);
		
		b.contact[b.contactCnt01].pos = this.dot[dotNum].abs.add(P0);
		b.contact[b.contactCnt01].rad = atan2(b.contact[b.contactCnt01].pos.add(b.vel).sub(b.pos));
		b.contact[b.contactCnt01].tangent = tangent;
		b.contact[b.contactCnt01].length = b.contact[b.contactCnt01].pos.sub(b.pos).norm();
		b.contact[b.contactCnt01].excess = excess//* b.size/ (this.size+b.size);
		b.contact[b.contactCnt01].weight = this.weight
		b.contact[b.contactCnt01].num = this.num+"d"+"c"+"0";
		b.contact[b.contactCnt01].pairPos = this.pos.add(P0);
		b.contact[b.contactCnt01].pairVel = this.vel.add(P0);
		//最後にcontactCntをインクリメントして終了
		this.contactCnt02++;
		b.contactCnt01++;
	}
}

//歪円と歪円で衝突判定を取る関数
Character.prototype.detectCollision03 = function(b){
	for(i=0; i<this.contactCnt01; i++){
		if(this.contact[i].num.slice(0,-3) == b.num && this.contact[i].num.slice(-3,-2) != "w") return; 
	}
	var dotNum1 = this.calcuDotnum(b);
	var dotNum2 = b.calcuDotnum(this);
	var len1 = this.dot[dotNum1].abs.sub(this.pos).norm();
	var len2 = b.dot[dotNum2].abs.sub(b.pos).norm();
	if(this.pos.sub(b.pos).norm() < (len1+len2)){
		//衝突時の接点の情報を求める
		var p = this.dot[dotNum1].abs.mul(this.size).add(b.dot[dotNum2].abs.mul(b.size)).div(this.size+b.size);
		this.contact[6+this.contactCnt02].pos = p.add(P0);
		this.contact[6+this.contactCnt02].rad = atan2(p.sub(this.pos))
		this.contact[6+this.contactCnt02].tangent = "NaN";
		this.contact[6+this.contactCnt02].length = p.sub(this.pos).norm();
		this.contact[6+this.contactCnt02].excess = "NaN";
		this.contact[6+this.contactCnt02].weight = b.weight;
		this.contact[6+this.contactCnt02].num = b.num+"d"+"d"+"0";
		this.contact[6+this.contactCnt02].pairPos = b.pos.add(P0);
		this.contact[6+this.contactCnt02].pairVel = b.vel.add(P0);
		
		b.contact[6+b.contactCnt02].pos = p.add(P0);
		b.contact[6+b.contactCnt02].rad = atan2(p.sub(b.pos));
		b.contact[6+b.contactCnt02].tangent = "NaN";
		b.contact[6+b.contactCnt02].length = p.sub(b.pos).norm();
		b.contact[6+b.contactCnt02].excess = "NaN";
		b.contact[6+b.contactCnt02].weight = this.weight;
		b.contact[6+b.contactCnt02].num = this.num+"d"+"d"+"0";
		b.contact[6+b.contactCnt02].pairPos = this.pos.add(P0);
		b.contact[6+b.contactCnt02].pairVel = this.vel.add(P0);
		//最後にcontactCntをインクリメントして終了
		this.contactCnt02++;
		b.contactCnt02++;
	}
}

//変形による影響を処理する関数=================================================================================
//壁を押す関数
Character.prototype.pushWall = function(con, wall){
	var obje = wall[con.num.slice(0,-3)];
	if(obje.type == 3){
		var pow = con.excess* con.excess* sin(con.rad)/ sqrt(obje.weight);
		obje.tl.y = Math.max(Math.min(obje.tl.y+ pow, obje.tlTemp.y+ obje.uMax), obje.tlTemp.y+ obje.lMax);
		obje.tr.y = obje.tl.y;
		obje.br.y = obje.tl.y+ obje.hei;
		obje.bl.y = obje.br.y;
		var pair = wall[obje.pair];
		pair.tl.y = Math.max(Math.min(pair.tl.y- pow, pair.tlTemp.y+ pair.uMax), pair.tlTemp.y+ pair.lMax);
		pair.tr.y = pair.tl.y;
		pair.br.y = pair.tl.y+ pair.hei;
		pair.bl.y = pair.br.y
	}
	//この場合は角度が動く壁
	else if(obje.type == 4){
		if(con.side%2 == 0 && con.side > 1){
			if(con.side == 2) rad = obje.rad1 + PI;
			else if(con.side == 4) rad = obje.rad2 + PI;
			else if(con.side == 6) rad = obje.rad2;
			else rad = obje.rad1;
			var len = (con.pos.x- obje.center.x)* cos(rad) + (con.pos.y- obje.center.y)* sin(rad);
		}
		else if(con.side != 5 && con.side != 0){
			var rad = atan2(con.pos.sub(this.pos))- atan2(obje.center.sub(this.pos));
			var len = this.pos.sub(obje.center).norm()* sin(rad);
		}
		else console.log("!!!!!!!!!", con.side)
		if(con.side == 0) run = false;
		var pow = con.excess* con.excess* len/ sqrt(obje.weight)/ 10000;
		obje.radv -= Math.max(Math.min(pow, 0.05), -0.05);
	}
}

//球の歪みを描くのに必要な情報を計算する関数
Character.prototype.calcuDistortion = function(bez, con1, con2){
	bez.radGap = mod(con2.rad- con1.rad, PI2);
	bez.dotNum = mod(Math.round(con1.rad* dotLen/ PI2));
	bez.arc1 = 4/3* this.weight/ con1.length* tan(bez.radGap/4);
	bez.arc2 = 4/3* this.weight/ con2.length* tan(bez.radGap/4);
	bez.midPos.x = 1/8*con1.pos.x+ 3/8*(con1.pos.x+ bez.arc1* cos(con1.tangent))+ 3/8*(con2.pos.x- bez.arc2* cos(con2.tangent))+ 1/8*con2.pos.x;
	bez.midPos.y = 1/8*con1.pos.y+ 3/8*(con1.pos.y+ bez.arc1* sin(con1.tangent))+ 3/8*(con2.pos.y- bez.arc2* sin(con2.tangent))+ 1/8*con2.pos.y;
	bez.midTangent = con1.rad+ bez.radGap/2+ PI_2;
	bez.midExcess = this.size- this.pos.sub(bez.midPos).norm();
	bez.arc1 = 4/3* this.weight/ con1.length* tan(bez.radGap/8);
	bez.midArc = 4/3* this.weight/ (this.size- bez.midExcess)* tan(bez.radGap/8);
	bez.arc2 = 4/3* this.weight/ con2.length* tan(bez.radGap/8);
}

//実際の歪みの軌道を計算する関数
Character.prototype.calcuBezier = function(bez, con1, con2, gap, dot, k){
	for(var i=0; i<gap/2; i++){
		if(typeof(dot[mod(bez.dotNum+i)])=="undefined"){
			dot[mod(bez.dotNum+i)] = {};
			dot[mod(bez.dotNum+i)].abs = new Point();
		}
		var t = 2*i/gap;
		var s = 1-t;
		dot[mod(bez.dotNum+i)].abs.x = s*s*s*con1.pos.x+ 3*s*s*t*(con1.pos.x+ bez.arc1*cos(con1.tangent))+
		                                  3*s*t*t*(bez.midPos.x- bez.midArc*cos(bez.midTangent))+ t*t*t*bez.midPos.x;
		dot[mod(bez.dotNum+i)].abs.y = s*s*s*con1.pos.y+ 3*s*s*t*(con1.pos.y+ bez.arc1*sin(con1.tangent))+
		                                  3*s*t*t*(bez.midPos.y- bez.midArc*sin(bez.midTangent))+ t*t*t*bez.midPos.y;
	}
	for(var i=gap; i>=gap/2; i--){
		if(typeof(dot[mod(bez.dotNum+i)])=="undefined"){
			dot[mod(bez.dotNum+i)] = {};
			dot[mod(bez.dotNum+i)].abs = new Point();
		}
		var t = (i-gap/2)*2/gap;
		var s = 1-t;
		dot[mod(bez.dotNum+i)].abs.x = s*s*s*bez.midPos.x+ 3*s*s*t*(bez.midPos.x+ bez.midArc*cos(bez.midTangent))+
		                                  3*s*t*t*(con2.pos.x- bez.arc2*cos(con2.tangent))+ t*t*t*con2.pos.x;
		dot[mod(bez.dotNum+i)].abs.y = s*s*s*bez.midPos.y+ 3*s*s*t*(bez.midPos.y+ bez.midArc*sin(bez.midTangent))+
		                                  3*s*t*t*(con2.pos.y- bez.arc2*sin(con2.tangent))+ t*t*t*con2.pos.y;
	}
}

//得られた接点の情報が適切かを判断する関数(主に接点同士が近すぎないかについて)
Character.prototype.checkContact = function(ball, wall){
	var num1 = this.contactCnt01;
	var num2 = this.contactCnt02;
	var con = this.contact;
	for(i=0; i<num1-1; i++){
		for(j=i+1; j<num1; j++){
			if(con[i].pos.sub(con[j].pos).norm() < this.size* 0.01){
				for(k=j; k<num1; k++){
					this.contactCopy(k, k+1);
				}
				num1--;
				this.contactCnt01--;
			}
		}
	}
	for(i=6; i<6+num2; i++){
		for(j=0; j<num1; j++){
			if(con[i].pos.sub(con[j].pos).norm() < this.size* 0.01){
				for(k=i; k<6+num2; k++){
					this.contactCopy(k, k+1);
				}
				num2--;
				this.contactCnt02--;
			}
		}
		for(j=i+1; j<6+num2; j++){
			if(con[i].pos.sub(con[j].pos).norm() < this.size* 0.01){
				for(k=j; k<6+num2; k++){
					this.contactCopy(k, k+1);
				}
				num2--;
				this.contactCnt02--;
			}
		}
	}
	if(this.contactCnt01==2){
		if(mod(con[0].rad- con[1].rad, PI2) < PI*0.1 || mod(con[1].rad- con[0].rad, PI2) < PI*0.1){
			if(con[0].pos.length < con[1].pos.length) j = 0;
			else j = 1;
			//相手の方も消してあげないといけない
			if(con[mod(j+1)].num.slice(-3,-2) != "w"){
				var b = ball[con[mod(j+1, 2)].num.slice(0, -3)];
				for(k=0; k<11; k++){
					if(b.contact[k].num.slice(0, -3) == this.num+"c"){
						for(l=k; l<11; l++){
							b.contactCopy(l, l+1);
						}
						b.contactCnt01--;
						break;
					}
				}
			}
			else{
				var obje = wall[con[(j+1)%2].num.slice(0,-3)];
				for(k=0; k<11; k++){
					if(obje.contact[k].num.slice(0, -2) == this.num+"c"){
						for(l=k; l<11; l++){
							obje.contactCopy(l, l+1);
						}
						obje.contactCnt01--;
						break;
					}
				}
			}
			this.contactCopy(0, j);
			this.contactCnt01 = 1;
			this.contactCnt02 = 0;
		}
	}
}

////得られた接点の情報が適切かを判断する関数(実際に軌跡を計算して球の概形の内側に収まっているか確かめる)
Character.prototype.checkDistortion = function(ball, wall){
	var i, j, k;
	var num = this.contactCnt01
	var con = this.contact;
	var dot = this.dot;
	var bez = this.bezier;
	for(i=0; i<num; i++){
		con[i].length = con[i].pos.sub(this.pos).norm();
		con[i].excess = this.size- con[i].length;
	}
	var radGap;
	var arc;
	var max = 0;
	var maxi=0, maxj=0;
	for(i=0; i<num-1; i++){
		for(j=i+1; j<num; j++){
			radGap = mod(con[i].rad- con[j].rad, PI2);
			radGap = Math.min(radGap, PI2- radGap);
			arc = 4/3* this.weight/ (con[i].length+con[j].length)/2* tan(radGap/4);
			if(arc > max){
				max = arc;
				maxi = i;
				maxj = j;
			}
		}
	}
	this.arc = max;
	if(max < this.size*0.1*4/3){
		this.positionCorrection();
		return;
		console.log("TESTALERT!", max, this.size*0.1*4/3, num);
		var mini;
		var min = this.size*3;
		var len = 0;
		for(i=0; i<num; i++){
			len = con[i].pos.sub(this.pos).norm();
			if(len < min){
				min = len;
				mini = i;
			}
		}
		if(num==undefined || mini==undefined){run=false; console.log("num, mini is undefined")};
		for(i=0; i<num; i++){
			if(con[i].num.slice(-3,-2)=="w") mini = i;
		}
		for(i=0; i<num; i++){
			if(i==mini) continue;
			if(con[i].num.slice(-3,-2)=="w"){
				var obje = wall[con[i].num.slice(0,-3)]
				for(j=0; j<12; j++){
					if(obje.contact[j].num.slice(0,-3)+"a" == this.num+"a" && obje.contact[j].num.slice(-3,-2) != "w"){
						for(k=j; k<11; k++){
							obje.contactCopy(k, k+1);
						}
						obje.contactCnt01--;
						break;
					}
				}
			}
			else{
				var B = ball[con[i].num.slice(0,-3)]
				for(j=0; j<12; j++){
					if(B.contact[j].num.slice(0,-3)+"a" == this.num+"a" && B.contact[j].num.slice(-3,-2) != "w"){
						if(j<6){
							for(k=j; k<5; k++){	
								B.contactCopy(k, k+1);
							}
							B.contactCnt01--;
							break;
						}
						else{
							for(k=6+j; k<12; k++){
								B.contactCopy(k, k+1);
							}
							B.contactCnt02--;
							break;
						}
					}
				}
			}
		}
		this.contactCopy(0, mini);
		this.contactCnt01 = 1;
		return;
	}
	else{
		//一番影響の強い二つの接点によって描かれる歪を計算する
		this.calcuDistortion(bez[0], con[maxi], con[maxj]);
		this.calcuDistortion(bez[1], con[maxj], con[maxi]);
		this.calcuBezier(bez[0], con[maxi], con[maxj], mod(bez[1].dotNum- bez[0].dotNum), dot);
		this.calcuBezier(bez[1], con[maxj], con[maxi], mod(bez[0].dotNum- bez[1].dotNum), dot);
		//各dotのrelとradを求める
		var power = new Point();
		for(i=0; i<num; i++){
			if(i==maxi || i==maxj){
				if(con[i].excess/this.size < 0.01){
					power.x += (con[i].excess* this.size+ 0.000001)* cos(con[i].tangent+ PI_2);
					power.y += (con[i].excess* this.size+ 0.000001)* sin(con[i].tangent+ PI_2);
				}
				else{
					power.x += con[i].excess* con[i].excess* cos(con[i].tangent+ PI_2);
					power.y += con[i].excess* con[i].excess* sin(con[i].tangent+ PI_2);
				}
				//相手が動く壁だった場合に相手の壁にかかる力を計算する
				if(con[i].num.slice(-3, -2) == "w") this.pushWall(con[i], wall);
			}
		}
		//仮の中心座標とiの接点までの距離を調べる
		var a = con[maxi].pos.add(con[maxj].pos).div(2);
		var b = new Point();
		b.x = (con[maxj].pos.y- con[maxi].pos.y);
		b.y =-(con[maxj].pos.x- con[maxi].pos.x);
		b = b.normalize();
		a = b.mul(this.pos.sub(a).dot(b)).add(a);
		for(i=this.contactCnt01-1; i>=0; i--){
			if(i==maxi || i==maxj) continue;
			//各dotのrelとradを求める
			this.calcuDotInfo(a);
			//次にiの接点方向に伸びる直線と歪の曲線との交点を調べる
			var rad = atan2(con[i].pos.sub(a));
			for(j=0; j<dotLen; j++){
				if(mod(rad, PI2) < mod(dot[j].rad- dot[0].rad, PI2)) break;
			}
			var gapVolume = mod(j-1);
			var t = (rad- dot[gapVolume].rad)/ (dot[mod(gapVolume+1)].rad- dot[gapVolume].rad);
			var len1 = dot[gapVolume].abs.sub(this.pos).norm();
			var len2 = dot[mod(gapVolume+1)].abs.sub(this.pos).norm();
			len1 = (1-t)* len1 + t* len2;
			if(len1- con[i].pos.sub(a).norm() < this.size*0.03){
				//もし消すべき接点の相手がボールだった場合、相手のボールの接点も消しといてあげないといけない
				if(con[i].num.slice(-3,-2) != "w"){
					var B = ball[con[i].num.slice(0,-3)]
					for(j=0; j<12; j++){
						if(B.contact[j].num.slice(0,-3)+"a" == this.num+"a" && B.contact[j].num.slice(-3,-2) != "w"){
							if(j<6){
								for(k=j; k<5; k++){	
									B.contactCopy(k, k+1);
								}
								B.contactCnt01--;
								break;
							}
							else{
								for(k=6+j; k<12; k++){
									B.contactCopy(k, k+1);
								}
								B.contactCnt02--;
								break;
							}
						}
					}
				}
				//相手が壁でも同じことをする
				else{
					var obje = wall[con[i].num.slice(0,-3)]
					for(j=0; j<12; j++){
						if(obje.contact[j].num.slice(0,-3)+"a" == this.num+"a" && obje.contact[j].num.slice(-3,-2) != "w"){
							for(k=j; k<11; k++){
								obje.contactCopy(k, k+1);
							}
							obje.contactCnt01--;
							break;
						}
					}
				}
				for(j=i; j<num; j++){
					this.contactCopy(j, j+1);
				}
				this.contactCnt01--;
				if(maxi > i) maxi--;
				if(maxj > i) maxj--;
			}
			else{
				var excess = len1- con[i].pos.sub(a).norm();
				power.x += excess*excess* cos(con[i].tangent+ PI_2);
				power.y += excess*excess* sin(con[i].tangent+ PI_2);
				//相手が動く壁だった場合に相手の壁にかかる力を計算する
				if(con[i].num.slice(-3, -2) == "w") this.pushWall(con[i], wall);
			}
		}
	}
	this.pos = this.pos.add(power.div(this.size));
	// for(i=0; i<wall.length; i++){
		// this.infoWithWall[i].canCollide = true;
	// }
	for(i=0; i<this.contactCnt01; i++){
		if(con[i].num.slice(-3,-2) =="w"){
			this.infoWithWall[con[i].num.slice(0,-3)].canCollide = false;
		}
	}
}

//物体の歪みの軌跡を計算する関数(正円状態で得られた接点に限る)
Character.prototype.detectDistortion01 = function(ball, wall){
	//取ってはいけない接点を排除したので、改めて歪を計算する
	var i, j, k;
	var num = this.contactCnt01
	var con = this.contact;
	var dot = this.dot;
	var bez = this.bezier;
	var excessC = 0;
	//まずは各接点についてexcessが一定値を超えているとカウントをインクリメントする。
	for(i=0; i<num; i++){
		if(con[i].excess >= this.size*0.15) excessC++;
	}
	//カウントが一定数を超えていたらめり込みによって破裂する
	if(excessC >= 2){
		if(this.explosionFrame+2 > counter){
			this.explosion(ball, wall);
		}
		else this.explosionFrame = counter;
	return;
	}
	//この時点でボールがひずんだことは確定したのでフラグを真にする
	this.isDistort = true;
	//もし接点が二つしかなかったらcheckDistortionで計算した曲線で十分なのでここで終わり
	if(this.contactCnt01 < 3) return;
	
	//この時点で接点が三つ以上あったら改めて歪を計算する必要がある
	//まず各接点を中心からの角度が小さい順に並び返す
	for(i=0; i<num-1; i++){
		for(j=i+1; j<num; j++){
			if(mod(con[i].rad, PI2) > mod(con[j].rad, PI2)){
				this.contactCopy(11, i);
				this.contactCopy(i, j);
				this.contactCopy(j, 11);
			}
		}
	}
	//それぞれの接点間の角度を計算する。後曲線の変わり目がどこにあるのか計算する
	for(i=0; i<num; i++){
		con[i].length = this.pos.sub(con[i].pos).norm();
		con[i].excess = this.size- con[i].length;
	}
	//ベジエ曲線でゆがみを表現していく。ついでに曲線状の各点の座標を計算していく
	for(i=0; i<num; i++){
		this.calcuDistortion(bez[i], con[i], con[mod(i+1,num)]);
	}
	for(i=0; i<num; i++){
		var gap = mod(bez[mod(i+1, num)].dotNum- bez[i].dotNum);
		this.calcuBezier(bez[i], con[i], con[mod(i+1, num)], gap, dot, i); 
	}
	//各dotのrelとradを求める
	this.calcuDotInfo(this.pos);
}

//物体の歪みの軌跡を計算する関数(歪円状態で得られた接点に限る)
Character.prototype.detectDistortion02 = function(ball){
	var i, j, k;
	var num1 = this.contactCnt01;
	var num2 = this.contactCnt02;
	var con = this.contact;
	var dot = this.dot;
	var bez = this.bezier;
	var conNum;
	var dotNum;
	var dotTemp = new Array();
	var power = new Point();
	//まず新しくできた各接点がどの既存の接点間にあるのかを調べる。接点はcon[conNum]とcon[conNum+1]の間にある
	if(num1<2) return; 
	for(i=6; i<6+num2; i++){
		con[i].rad = mod(con[i].rad, PI2);
		con[0].rad = mod(con[0].rad, PI2);
		for(j=0; j<num1; j++){
			con[(j+1)%num1].rad = mod(con[(j+1)%num1].rad, PI2);
			if(mod(con[i].rad- con[j].rad, PI2) < mod(con[mod(j+1, num1)].rad- con[j].rad, PI2)){
				conNum = j;
				break;
			}
		}
		dotNum = mod(bez[mod(conNum+1, num1)].dotNum- bez[conNum].dotNum);
		var contact = {};
		contact.pos = new Point();
		contact.pos.x = this.pos.x+ this.size*cos(con[i].rad);
		contact.pos.y = this.pos.y+ this.size*sin(con[i].rad);
		contact.length = this.size;
		contact.excess = 0;
		contact.rad = con[i].rad;
		contact.tangent = con[i].rad+ PI_2;
		//こっから計算
		this.calcuDistortion(bez[i], con[conNum], contact);
		var gap = mod(mod(Math.round(contact.rad* dotLen/ PI2))- bez[conNum].dotNum);
		this.calcuBezier(bez[i], con[conNum], contact, gap, dotTemp);
		conNum = mod(conNum+1, num1);
		con[conNum].rad = atan2(con[conNum].pos.sub(this.pos));
		con[conNum].tangent = con[conNum].rad+ PI_2;
		this.calcuDistortion(bez[i], contact, con[conNum]);
		gap = mod(bez[conNum].dotNum- bez[i].dotNum);
		this.calcuBezier(bez[i], contact, con[conNum], gap, dotTemp);
		
		conNum = mod(conNum-1, num1);
		//接点がどのdotの間にあるのか調べる。jがdot_numberになる
		for(j=0; j<dot.length; j++){
			dot[j].rad = atan2(dot[j].rel);
		}
		for(j=0; j<dot.length; j++){
			if(mod(con[i].rad- dot[0].rad, PI2) < mod(dot[j].rad- dot[0].rad, PI2)) break;
		}
		var gapVolume = mod(j-1);
		var len1 = dot[gapVolume].abs.sub(this.pos).norm();
		var len2 = dot[(gapVolume+1)%dot.length].abs.sub(this.pos).norm();
		var t = mod(con[i].rad- dot[gapVolume].rad, PI2)/ mod(dot[mod(gapVolume+1)].rad- dot[gapVolume].rad, PI2);
		t = Math.max(Math.min(t, 1), -1);
		
		var len3 = (1-t)* len1 + t* len2;
		var len4 = con[i].pos.sub(this.pos).norm();
		//ついでにここでボールが受ける力も計算しておく
		var excess = (len3- len4)*len3*len3/this.size/this.size;
		power.x += excess*excess* -cos(contact.tangent- PI_2);
		power.y += excess*excess* -sin(contact.tangent- PI_2);
		if(t > 10 || !len4){
			console.log("t is too large or len4 is false", t, len4);
			run = false;
		}
		var s = (len4-this.size)/ (len3-this.size);
		s = Math.max(Math.min(s, 1), -1);
		for(j=0; j<dotNum+1; j++){
			var num = mod(bez[conNum].dotNum+j);
			dot[num].abs = dot[num].abs.mul(s).add(dotTemp[num].abs.mul(1-s));
			dot[num].rel = dot[num].abs.sub(this.pos);
		}
	}
	this.pos = this.pos.add(power.div(this.size));
}