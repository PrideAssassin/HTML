//获取游戏地图元素节点
var map = document.getElementById("left");
//获取开始按钮元素节点
var but_start = document.getElementById("start");
//获取成绩分数标签
var p_score = document.getElementById("right_score");
//蛇皮肤载入
var skin = document.getElementById("skin");
//蓝色皮肤
var skin_blue = document.getElementById("skin_blue");
//用来清除定时调用,暂停游戏
var snakeMove = null;
//游戏等级变量
var lev = 100;

//开始菜单界面设为黑色
map.style.backgroundColor = "black";

//游戏难度选择低
document.getElementById("left_p1").onclick = function() {
	lev = 100;
	map.style.backgroundColor = "white";
	//初始化
	init();
}
//游戏难度选择高
document.getElementById("left_p2").onclick = function() {
	lev = 30;
	map.style.backgroundColor = "white";
	//初始化
	init();
}

//皮肤按钮事件
skin.onclick = function() {
	if (skin.innerHTML == "皮肤加载功能") {
		skin.innerHTML = "皮肤加载成功";
	} else {
		skin.innerHTML = "皮肤加载功能"
	}
}

//皮肤按钮事件
skin_blue.onclick = function() {
	if (skin_blue.innerHTML == "蓝色皮肤") {
		skin_blue.innerHTML = "皮肤加载成功";
	} else {
		skin_blue.innerHTML = "蓝色皮肤"
	}
}

//游戏开始进入,初始化
function init() {
	//获取地图宽高
	this.mapW = parseInt(getComputedStyle(map).width);
	this.mapH = parseInt(getComputedStyle(map).height);
	//食物的宽高
	this.foodW = 20;
	this.foodH = 20;
	//初始化食物位置
	this.foodX = 0;
	this.foodY = 0;
	//初始化蛇身数据
	this.snakeBody = new Array();
	this.snakeBody[0] = [2, 0];
	this.snakeBody[1] = [1, 0];
	this.snakeBody[2] = [0, 0];
	//蛇身的宽度高度
	this.snakeW = 20;
	this.snakeH = 20;
	//生成障碍物
	roadblock();
	//生成食物
	food();
	//生成蛇身
	snake();
	//开始按钮事件---------------调用开始游戏函数
	but_start.onclick = function() {
		if (but_start.innerHTML == "开始") {
			but_start.innerHTML = "暂停";
			startgame();
		} else {
			but_start.innerHTML = "开始";
			pausegame();
		}
	}
	//初始化方向
	this.direction = "right";
	//初始成绩
	this.score = 0;
}

//--------------------------开始游戏
function startgame() {
	//定时器,lev调用间隔，让游戏一直运行 
	snakeMove = setInterval(move, lev);
}

//获取按键操作
function bindkeyDown() {
	window.onkeydown = function(event) {
		//获取键盘按键
		code = event.keyCode;
		//不能反向操作 
		if (this.direction == "right" && code == 37) {
			//返回就等于不执行呗,按了也没用跳出去
			return;
		}
		if (this.direction == "left" && code == 39) {
			return;
		}
		if (this.direction == "top" && code == 40) {
			return;
		}
		if (this.direction == "bottom" && code == 38) {
			return;
		}
		//判读用户按下的键
		switch (code) {
			case 37:
				this.direction = "left";
				break;
			case 38:
				this.direction = "top";
				break;
			case 39:
				this.direction = "right";
				break;
			case 40:
				this.direction = "bottom";
				break;
		}
	}
}

//暂停游戏
function pausegame() {
	clearInterval(snakeMove);
}

//游戏开始一直运行循环的函数 ------蛇一直移动
function move() {
	//绑定键盘按下事件
	bindkeyDown();
	//修改snakebody数组来进行移动(修改蛇身体)
	for (var i = this.snakeBody.length - 1; i > 0; i--) {
		//当前的数组的最后第2个位置,蛇往前移动,就变成了最后的位置
		this.snakeBody[i][0] = this.snakeBody[i - 1][0];
		this.snakeBody[i][1] = this.snakeBody[i - 1][1];
	}
	//判读方向来确定蛇头的值(修改蛇头)
	switch (this.direction) {
		case "top":
			this.snakeBody[0][1] -= 1;
			break;
		case "bottom":
			this.snakeBody[0][1] += 1;
			break;
		case "left":
			this.snakeBody[0][0] -= 1;
			break;
		case "right":
			this.snakeBody[0][0] += 1;
			break;
	}

	//清除之前蛇身
	cleansnake("snake");
	//重新画蛇
	snake();
	//判读撞墙
	judge();
	//吃东西
	if (this.snakeBody[0][0] == (this.foodX) && this.snakeBody[0][1] == (this.foodY)) {
		//移出被吃掉的食物
		cleansnake("food");
		//生成新的食物
		food();
		//成绩加分
		this.score += 10;
		p_score.innerHTML = "分数:" + this.score;
		//蛇身长度增加
		addlength();
	}
}

//清除地图内容
function cleansnake(classname) {
	var snakes = document.getElementsByClassName(classname);
	while (snakes.length) {
		snakes[0].parentNode.removeChild(snakes[0]);
	}
}

//初始化打印蛇
function snake() {
	//for遍历数组,根据蛇数组循环创建节点，放入地图中，并添加样式
	for (var i = 0; i < this.snakeBody.length; i++) {
		//创建蛇身节点
		var snakeBox = document.createElement("div");
		//设置蛇的宽度高度
		snakeBox.style.width = this.snakeW + "px";
		snakeBox.style.height = this.snakeH + "px";
		//放入地图进行定位
		map.appendChild(snakeBox);
		snakeBox.style.position = "absolute";
		//设置类名,用来清除身体
		snakeBox.setAttribute("class", "snake");
		//蛇皮肤	，根据按钮中的内容来确定使用图片背景还是纯色背景
		if (skin.innerHTML == "皮肤加载成功") {
			//skin加载的是div图片背景
			if (i == 0) {
				//蛇头分别加载
				snakeBox.style.backgroundImage = "url(img/snake.jpg)";
			} else {
				//蛇身体分别加载
				snakeBox.style.backgroundImage = "url(img/head.png)";
				snakeBox.style.backgroundPosition = "center";
				snakeBox.style.backgroundRepeat = "no-repeat";
			}
		} else {
			//设置颜色
			snakeBox.style.backgroundColor = "red";
		}
		//skin_blue蓝色的
		if (skin_blue.innerHTML == "皮肤加载成功") {
			snakeBox.style.backgroundColor = "blue";
		} else {
			//设置颜色
			snakeBox.style.backgroundColor = "red";
		}
		if (i == 0) {
			snakeBox.style.backgroundColor = "yellow";
		}

		//位置计算
		snakeBox.style.top = this.snakeW * this.snakeBody[i][1] + "px";
		snakeBox.style.left = this.snakeH * this.snakeBody[i][0] + "px";
	}
}

//食物
function food() {
	while (true) {
		//食物根据自身宽度，占满当前行所在的个数，随机最大不能超过这个数,食物一直在地图内随机,
		this.foodX = Math.floor(Math.random() * (this.mapW / this.foodW));
		this.foodY = Math.floor(Math.random() * (this.mapH / this.foodH));
		//创建一个盒子
		var foodBox = document.createElement("div");
		//初始化食物宽度高度
		foodBox.style.width = this.foodW + "px";
		foodBox.style.height = this.foodH + "px";
		//设置食物绝对定位坐标
		foodBox.style.position = "absolute";
		//添加食物图片
		foodBox.style.backgroundImage = "url(img/shiwu.png)";
		//由于食物自身有宽度-----需要*20
		foodBox.style.top = 20 * this.foodY + "px";
		foodBox.style.left = 20 * this.foodX + "px";
		//设置类名
		foodBox.setAttribute("class", "food");
		//设置颜色
		foodBox.style.backgroundColor = "red";
		//加入到地图中

		//判读食物是否生成在障碍物中
		var zhangaiwu = false;

		for (var i = 0; i < this.roadblocks_xy.length; i++) {
			if (foodX == this.roadblocks_xy[i][0] && foodY == this.roadblocks_xy[i][1]) {
				zhangaiwu = true;
			}
		}


		//判断食物是否生成在蛇的身体上
		var shehead = false;
		for (var i = 0; i < this.snakeBody.length; i++) {
			//食物与蛇身体重合不生成
			if (foodX == this.snakeBody[i][0] && foodY == this.snakeBody[i][1]) {
				shehead = true;
			}
		}

		//如果不在障碍物和蛇身上就创建食物
		if (zhangaiwu == false && shehead == false) {
			//生成食物
			map.appendChild(foodBox);
			//跳出循环
			return;
		}

	}
}

//增加蛇的身体长度,在吃完食物后调用
function addlength() {
	//保存当前蛇尾的坐标
	var snake_endX = this.snakeBody[this.snakeBody.length - 1][0];
	var snake_endY = this.snakeBody[this.snakeBody.length - 1][1];
	//根据方向在蛇尾处增加蛇的身体
	if (this.direction == "right") {
		this.snakeBody[this.snakeBody.length] = [snake_endX - 1, snake_endY + 0];
	}
	if (this.direction == "left") {
		this.snakeBody[this.snakeBody.length] = [snake_endX + 1, snake_endY + 0];
	}
	if (this.direction == "bottom") {
		this.snakeBody[this.snakeBody.length] = [snake_endX + 0, snake_endY - 1];
	}
	if (this.direction == "top") {
		this.snakeBody[this.snakeBody.length] = [snake_endX + 0, snake_endY + 1];
	}
}

//判断蛇的死亡
function judge() {
	//判读蛇头在墙左右两边的位置
	if (this.snakeBody[0][0] >= this.mapW / this.snakeW || this.snakeBody[0][0] < 0) {
		alert("撞墙游戏结束-----当前得分:" + score);
		// gameover=false;
		clearInterval(snakeMove);
		cleansnake("snake");
		cleansnake("food");
		cleansnake("roadblock");
		init();
		but_start.innerHTML = "开始";
		p_score.innerHTML = "分数:0";
		lev = 100;
	}
	//判读蛇头在墙上下两边的位置
	if (this.snakeBody[0][1] >= this.mapH / this.snakeH || this.snakeBody[0][1] < 0) {
		alert("撞墙游戏结束-----当前得分:" + score);
		//将游戏的循环调用清空
		clearInterval(snakeMove);
		//删除地图中的蛇
		cleansnake("snake");
		//删除地图中食物
		cleansnake("food");
		//清除障碍物
		cleansnake("roadblock");
		//重新初始化
		init();
		//按钮内容变为开始
		but_start.innerHTML = "开始";
		//成绩清空
		p_score.innerHTML = "分数:0";
		//难度重置为100
		lev = 100;
	}
	//判读蛇头是否与蛇身重合
	for (var i = 1; i < this.snakeBody.length; i++) {
		if (this.snakeBody[0][0] == this.snakeBody[i][0] && this.snakeBody[0][1] == this.snakeBody[i][1]) {
			alert("咬到自己游戏结束-----当前得分:" + score);
			// gameover=false;
			clearInterval(snakeMove);
			cleansnake("snake");
			cleansnake("food");
			//清除障碍物
			cleansnake("roadblock");
			init();
			but_start.innerHTML = "开始";
			p_score.innerHTML = "分数:0";
			lev = 100;
		}
	}
	for (var i = 0; i < this.roadblocks_xy.length; i++) {
		if (this.snakeBody[0][0] == this.roadblocks_xy[i][0] && this.snakeBody[0][1] == this.roadblocks_xy[i][1]) {
			alert("撞到障碍物游戏结束-----当前得分:" + score);
			// gameover=false;
			clearInterval(snakeMove);
			cleansnake("snake");
			cleansnake("food");
			//清除障碍物
			cleansnake("roadblock");
			init();
			but_start.innerHTML = "开始";
			p_score.innerHTML = "分数:0";
			lev = 100;
		}
	}
}

//添加障碍物
function roadblock() {
	//障碍物数组坐标位置
	this.roadblocks_xy = new Array();
	this.roadblocks_xy[0] = [5, 6];
	this.roadblocks_xy[1] = [5, 7];
	this.roadblocks_xy[2] = [13, 6];
	this.roadblocks_xy[3] = [12, 6];
	this.roadblocks_xy[4] = [11, 6];


	for (var i = 0; i < this.roadblocks_xy.length; i++) {
		//障碍物创建
		var roadblocks = document.createElement("div");
		roadblocks.style.width = "20px";
		roadblocks.style.height = "20px";
		//障碍物背景色
		roadblocks.style.backgroundColor = "orange";
		//障碍物字体颜色
		roadblocks.style.color = "black";
		//设置类名
		roadblocks.setAttribute("class", "roadblock");
		//障碍物显示文字内容---文本节点
		roadblocks.appendChild(document.createTextNode("墙"));
		//加入地图中
		map.appendChild(roadblocks);
		//定位绝对
		roadblocks.style.position = "absolute";
		roadblocks.style.left = (20 * this.roadblocks_xy[i][0]) + "px";
		roadblocks.style.top = (20 * this.roadblocks_xy[i][1]) + "px";
	}


}
