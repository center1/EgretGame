var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
* Created by shaorui on 14-6-8.
*/
var fighter;
(function (fighter) {
    /**
    * 成绩显示
    */
    var ScorePanel = (function (_super) {
        __extends(ScorePanel, _super);
        function ScorePanel() {
            _super.call(this);
            var g = this.graphics;
            g.beginFill(0x000000, 0.8);
            g.drawRect(0, 0, 400, 200);
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
        ScorePanel.prototype.position = function (x, y) {
            var msg = "XY:\n" + x + "," + y + "\n";
            this.txt.text = msg;
        };
        ScorePanel.prototype.showScore = function (value) {
            if (value != 0) {
                var msg = "您用了" + value + "秒，将爱传给了她（他），" + "超过了全国" + Math.ceil(100 - value) + "% 的人！";

                this.txt.text = msg;
                this.winner = fighter.createBitmapByName("winner"); //胜利图案
                this.winner.x = 60;
                this.winner.y = 110;
                this.addChild(this.winner);
            } else {
                var msg = "您没有成功将爱传递到她（他）手中" + "\n再来一次吧";
                this.txt.text = msg;
            }
            wxData.desc=msg;
        };
        return ScorePanel;
    })(egret.Sprite);
    fighter.ScorePanel = ScorePanel;
})(fighter || (fighter = {}));
