module fighter
{
    /**
     * 主游戏容器
     */
    export class GameContainer extends egret.DisplayObjectContainer
    {
        /**@private*/
        private stageW:number;
        /**@private*/
        private stageH:number;



        /**游戏场景1*/
        private gameBG :egret.Bitmap;
        /**开始按钮*/
        private btnStart:egret.Bitmap;
        /**结束图案*/
        private goal:egret.Bitmap;

        /**可滚动背景*/
        private bg:fighter.BgMap;
        /**我的飞机*/
        private myFighter:fighter.Airplane;
        /**我的子弹*/
        private myBullets:fighter.Bullet[] = [];
        /**敌人的飞机*/
        private enemyFighters:fighter.Airplane[] = [];


        /**触发创建敌机的间隔*/
        private enemyFightersTimer:egret.Timer = new egret.Timer(1000);
        /**敌人的子弹*/
        private enemyBullets:fighter.Bullet[] = [];
        /**成绩显示*/
        private scorePanel:fighter.ScorePanel;
        /**我的成绩*/
        private myScore:number;
        /**@private*/
        private _lastTime:number;

        private _gameTime:number;



        // private gameTimer:egret.Timer;

        public constructor() {
            super();
            this._lastTime = egret.getTimer();
            this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
        }
        /**初始化*/
        private onAddToStage(event:egret.Event){
            this.removeEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
            this.createGameScene();
        }
        /**创建游戏场景*/
        private createGameScene():void{


            this.stageW = this.stage.stageWidth;
            this.stageH = this.stage.stageHeight;
            //背景
            this.gameBG = fighter.createBitmapByName("bg1Image");//游戏场景1
            this.gameBG.x = (this.stageW-this.gameBG.width)/2;//居中定位
            this.gameBG.y = (this.stageH-this.gameBG.height)/2;//居中定位
            this.addChild(this.gameBG);
            //开始按钮
            this.btnStart = fighter.createBitmapByName("btnStart");//开始按钮
            this.btnStart.x = (this.stageW-this.btnStart.width)/2;//居中定位
            this.btnStart.y = (this.stageH-this.btnStart.height)/2*1.75;//居中定位
            this.btnStart.touchEnabled = true;//开启触碰
            this.btnStart.addEventListener(egret.TouchEvent.TOUCH_TAP,this.gameStart,this);//点击按钮开始游戏
            this.addChild(this.btnStart);
            //预创建
            // this.preCreatedInstance();
        }
        /**预创建一些对象，减少游戏时的创建消耗*/
    /*    private preCreatedInstance():void {
            for(var i:number=0;i<20;i++) {
                var bullet = fighter.Bullet.produce("b1");
                fighter.Bullet.reclaim(bullet,"b1");
            }
            for(var i:number=0;i<20;i++) {
                var bullet = fighter.Bullet.produce("b2");
                fighter.Bullet.reclaim(bullet,"b2");
            }
            for(var i:number=0;i<20;i++) {
                var enemyFighter:fighter.Airplane = fighter.Airplane.produce("f2",1000);
                fighter.Airplane.reclaim(enemyFighter,"f2");
            }
        }
*/
        /**游戏开始*/
        private gameStart():void{


            this.removeChild(this.btnStart);

            //this._anchorX=0;
            //this._anchorY=0;

            this.createRoute();

            //this.bg.start();
            //我的飞机
            this.myFighter = new fighter.Airplane(RES.getRes("star"),100);
            //this.myFighter.y = this.stageH-this.myFighter.height+5;

            this.addChild(this.myFighter);
           // this.scorePanel = new fighter.ScorePanel();
            this._gameTime = egret.getTimer();

            this.addEventListener(egret.Event.ENTER_FRAME,this.gameViewUpdate,this);
            this.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.touchHandler,this);
            this.myFighter.x = this.gameBG.x+155;
            this.myFighter.y = this.gameBG.y+550;
            // this.myFighter.fire();//开火
            this.myFighter.blood = 10;
            this.touchEnabled=true;
            //   this.myFighter.addEventListener("createBullet",this.createBulletHandler,this);
            //  this.enemyFightersTimer.addEventListener(egret.TimerEvent.TIMER,this.createEnemyFighter,this);
            //    this.enemyFightersTimer.start();
            if(this.scorePanel.parent==this)
                this.removeChild(this.scorePanel);
        }
        /**响应Touch*/
        private touchHandler(evt:egret.TouchEvent):void{
            if(evt.type==egret.TouchEvent.TOUCH_MOVE)
            {
                var tx:number = evt.localX;
                tx = Math.max(0,tx);
                tx = Math.min(this.stageW-this.myFighter.width,tx);
                if((tx-this.myFighter.x) >= 10 )
                    this.myFighter.x += 10;
                else
                    if ((this.myFighter.x-tx) >= 10)
                       this.myFighter.x -= 10;
                    else
                        this.myFighter.x=tx;

                var ty:number = evt.localY;
                ty = Math.max(0,ty);
                ty = Math.min(this.stageH-this.myFighter.height,ty);
                if((ty-this.myFighter.y) >= 10 )
                    this.myFighter.y += 10;
                else
                if ((this.myFighter.y-ty) >= 10)
                    this.myFighter.y -= 10;
                else
                    this.myFighter.y=ty;
                this.gameHitTest();

            }
        }
        private createRoute():void
        {


            //画迷宫
            var DrawX=this.gameBG.x;
            var DrawY=this.gameBG.y;

            var shp:egret.Shape = new egret.Shape();
            shp.graphics.beginFill( 0xffffff );
            shp.graphics.drawRect( DrawX+30,DrawY+20,430-2*DrawX,50);
            shp.graphics.endFill();
            this.addChild( shp );

            var shp11:egret.Shape = new egret.Shape();
            shp11.graphics.beginFill( 0xffffff );
            shp11.graphics.drawRect( DrawX+30,DrawY+70,60,250);
            shp11.graphics.endFill();
            this.addChild( shp11 );

            var shp1:egret.Shape = new egret.Shape();
            shp1.graphics.beginFill( 0xffffff );
            shp1.graphics.drawRect( DrawX+30,DrawY+250,430-2*DrawX,70);
            shp1.graphics.endFill();
            this.addChild( shp1 );

            var shp12:egret.Shape = new egret.Shape();
            shp12.graphics.beginFill( 0xffffff );
            shp12.graphics.drawRect( 430-40-2*DrawX,DrawY+250,70,250);
            shp12.graphics.endFill();
            this.addChild( shp12 );

            var shp2:egret.Shape = new egret.Shape();
            shp2.graphics.beginFill( 0xffffff );
            shp2.graphics.drawRect( DrawX+150,DrawY+500,430-120-2*DrawX,90);
            shp2.graphics.endFill();
            this.addChild( shp2 );

            this.goal = fighter.createBitmapByName("go1");//结束图案
            this.goal.x = 430-40-2*this.gameBG.x;
            this.goal.y = this.gameBG.y+20;
            this.addChild(this.goal);

        }
        /**创建子弹(包括我的子弹和敌机的子弹)*/
    /*    private createBulletHandler(evt:egret.Event):void{
            var bullet:fighter.Bullet;
            if(evt.target==this.myFighter) {
                for(var i:number=0;i<2;i++) {
                    bullet = fighter.Bullet.produce("b1");
                    bullet.x = i==0?(this.myFighter.x+10):(this.myFighter.x+this.myFighter.width-22);
                    bullet.y = this.myFighter.y+30;
                    this.addChildAt(bullet,this.numChildren-1-this.enemyFighters.length);
                    this.myBullets.push(bullet);
                }
            } else {
                var theFighter:fighter.Airplane = evt.target;
                bullet = fighter.Bullet.produce("b2");
                bullet.x = theFighter.x+28;
                bullet.y = theFighter.y+10;
                this.addChildAt(bullet,this.numChildren-1-this.enemyFighters.length);
                this.enemyBullets.push(bullet);
            }
        }*/
        /**创建敌机*//*
        private createEnemyFighter(evt:egret.TimerEvent):void{
            var enemyFighter:fighter.Airplane = fighter.Airplane.produce("f2",1000);
            enemyFighter.x = Math.random()*(this.stageW-enemyFighter.width);
            enemyFighter.y = -enemyFighter.height-Math.random()*300;
            enemyFighter.addEventListener("createBullet",this.createBulletHandler,this);
            enemyFighter.fire();
            this.addChildAt(enemyFighter,this.numChildren-1);
            this.enemyFighters.push(enemyFighter);
        }*/
        /**游戏画面更新*/
        private gameViewUpdate(evt:egret.Event):void{
            //为了防止FPS下降造成回收慢，生成快，进而导致DRAW数量失控，需要计算一个系数，当FPS下降的时候，让运动速度加快
            var nowTime:number = egret.getTimer();
            var fps:number = 1000/(nowTime-this._lastTime);
            this._lastTime = nowTime;
            var speedOffset:number = 60/fps;
            //我的子弹运动
            var i:number = 0;
            var bullet:fighter.Bullet;
            var myBulletsCount:number = this.myBullets.length;
            var delArr:any[] = [];


        }
        /**游戏碰撞检测*/
        private gameHitTest():void {
            var i:number, j:number;
            var x:number, y:number;
            var bullet:fighter.Bullet;
            var theFighter:fighter.Airplane;
            var myBulletsCount:number = this.myBullets.length;
            var enemyFighterCount:number = this.enemyFighters.length;
            var enemyBulletsCount:number = this.enemyBullets.length;
            //将需消失的子弹和飞机记录
            var delBullets:fighter.Bullet[] = [];
            var delFighters:fighter.Airplane[] = [];

//我的子弹可以消灭敌机
            /*for (i = 0; i < myBulletsCount; i++) {
                bullet = this.myBullets[i];
                for (j = 0; j < enemyFighterCount; j++) {
                    theFighter = this.enemyFighters[j];
                    if (fighter.GameUtil.hitTest(theFighter, bullet)) {
                        theFighter.blood -= 2;
                        if (delBullets.indexOf(bullet) == -1)
                            delBullets.push(bullet);
                        if (theFighter.blood <= 0 && delFighters.indexOf(theFighter) == -1)
                            delFighters.push(theFighter);
                    }
                }
            }
            //敌人的子弹可以减我血
            for (i = 0; i < enemyBulletsCount; i++) {
                bullet = this.enemyBullets[i];
                if (fighter.GameUtil.hitTest(this.myFighter, bullet)) {
                    this.myFighter.blood -= 1;
                    if (delBullets.indexOf(bullet) == -1)
                        delBullets.push(bullet);
                }
            }
            //敌机的撞击可以消灭我
            for (i = 0; i < enemyFighterCount; i++) {
                theFighter = this.enemyFighters[i];
                if (fighter.GameUtil.hitTest(this.myFighter, theFighter)) {
                    this.myFighter.blood -= 10;
                }
            }*/
            //进入非白区则被终止

            x=this.myFighter.x;
            y=this.myFighter.y;
            this.myScore=0;


           // this.anchorOffsetY=this.gameBG.y;

            //两边
            if (x <= this.gameBG.x+30 || x >= (430-2*this.gameBG.x))
                this.myFighter.blood -= 10;
            //上下
            if (y >= (this.gameBG.y+590) || y<=(this.gameBG.y+20))
                this.myFighter.blood -= 10;


            if(x>=(this.gameBG.x+90) && x<=(430-2*this.gameBG.x))
                if (y>=(this.gameBG.y+70) && y<=(this.gameBG.y+250))
                    this.myFighter.blood -= 10;

            if(x>=(this.gameBG.x+30) && x<=(430-40-2*this.gameBG.x))
                if (y>=(this.gameBG.y+340) && y<=(this.gameBG.y+500))
                    this.myFighter.blood -= 10;


            //成功通过
            if (x > (430-40-2*this.gameBG.x) && x < (430-2*this.gameBG.x) && y < (this.gameBG.y+70) && y> (this.gameBG.y+20))
            {
            this.myFighter.blood -= 10;
            this.myScore = (egret.getTimer() - this._gameTime) / 1000;

            }


            if(this.myFighter.blood<=0 ) {
                  this.gameStop();
            }

        }
        /**游戏结束*/
        private gameStop():void{
            this.createGameScene();
            this.addChild(this.btnStart);


            //this.bg.pause();
            this.removeEventListener(egret.Event.ENTER_FRAME,this.gameViewUpdate,this);
            this.removeEventListener(egret.TouchEvent.TOUCH_MOVE,this.touchHandler,this);
            //this.myFighter.stopFire();
            //this.myFighter.removeEventListener("createBullet",this.createBulletHandler,this);
            //this.enemyFightersTimer.removeEventListener(egret.TimerEvent.TIMER,this.createEnemyFighter,this);
            //this.enemyFightersTimer.stop();
            //清理子弹
            //var i:number = 0;
            //var bullet:fighter.Bullet;

            //显示成绩
            this.scorePanel = new fighter.ScorePanel();
            this.scorePanel.showScore(this.myScore);
            this.scorePanel.x = (this.stageW-this.scorePanel.width)/2;
            this.scorePanel.y = 100;
            this.addChild(this.scorePanel);


        }
    }
}