/**
 * Created by shaorui on 14-6-8.
 */
module fighter
{
    /**
     * 成绩显示
     */
    export class ScorePanel extends egret.Sprite
    {
        private txt:egret.TextField;
        /**胜利图案*/
        private winner:egret.Bitmap;
        public constructor() {
            super();
            var g:egret.Graphics = this.graphics;
            g.beginFill(0x000000,0.8);
            g.drawRect(0,0,400,200);
            g.endFill();
            this.txt = new egret.TextField();
            this.txt.width = 400;
            this.txt.height = 200;
            this.txt.textAlign = "center";
            this.txt.textColor = 0xFFFFFF;
            this.txt.size = 24;
            this.txt.y = 60;
            this.addChild(this.txt);
            this.touchChildren = false;
            this.touchEnabled = false;
        }
        public position(x:number,y:number):void {
            var msg:string = "XY:\n"+x+","+y+"\n";
            this.txt.text = msg;
        }
        public showScore(value:number):void {
            if(value !=0) {
                var msg:string = "您用了" + value + "秒，将爱传给了她（他），" + "超过了全国" +Math.ceil(100 - value) + "% 的人！";

                this.txt.text = msg;
                this.winner = fighter.createBitmapByName("winner");//胜利图案
                this.winner.x = 60;
                this.winner.y = 110;
                this.addChild(this.winner);

            }else{
                var msg:string = "您没有成功将爱传递到她（他）手中"+"\n再来一次吧";
                this.txt.text = msg;
            }
            //wxData.desc=msg;

        }
    }
}