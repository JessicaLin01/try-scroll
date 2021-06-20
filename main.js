/** 
 * 这里只实现垂直滚动 
 */  
var parent = document.getElementById('parent');  
var content = document.getElementById('content')  
var startY = 0; // 初始位置  
var lastY = 0; // 上一次位置  
  
/** 
 * 用于缓动的变量 
 */  
var lastMoveTime = 0;  
var lastMoveStart = 0;  
var stopInertiaMove = false; // 是否停止缓动  
  
parent.addEventListener('touchstart', function(e) {  
    lastY = startY = e.touches[0].pageY;  
  
    /** 
     * 缓动代码 
     */  
    lastMoveStart = lastY;  
    lastMoveTime = e.timeStamp || Date.now();  
    stopInertiaMove = true;  
});  
parent.addEventListener('touchmove', function(e) {  
    var nowY = e.touches[0].pageY;  
    var moveY = nowY - lastY;  
    var contentTop = content.style.top.replace('px', '');  
    // 设置top值移动content  
    content.style.top = (parseInt(contentTop) + moveY) + 'px';  
    lastY = nowY;  
  
    /** 
     * 缓动代码 
     */  
    var nowTime = e.timeStamp || Date.now();  
    stopInertiaMove = true;  
    if(nowTime - lastMoveTime > 300) {  
        lastMoveTime = nowTime;  
        lastMoveStart = nowY;  
    }  
});  
parent.addEventListener('touchend', function(e) {  
    // do touchend  
    var nowY = e.touches[0].pageY;  
    var moveY = nowY - lastY;  
    var contentTop = content.style.top.replace('px', '');  
    var contentY = (parseInt(contentTop) + moveY);  
    // 设置top值移动content  
    content.style.top =  contentY + 'px';  
    lastY = nowY;  
  
    /** 
     * 缓动代码 
     */  
    var nowTime = e.timeStamp || Date.now();  
    var v = (nowY - lastMoveStart) / (nowTime - lastMoveTime); //最后一段时间手指划动速度  
    stopInertiaMove = false;  
    (function(v, startTime, contentY) {  
        var dir = v > 0 ? -1 : 1; //加速度方向  
        var deceleration = dir*0.0006;  
        var duration = v / deceleration; // 速度消减至0所需时间  
        var dist = v * duration / 2; //最终移动多少  
        function inertiaMove() {  
            if(stopInertiaMove) return;  
            var nowTime = e.timeStamp || Date.now();  
            var t = nowTime-startTime;  
            var nowV = v + t*deceleration;  
            // 速度方向变化表示速度达到0了  
            if(dir*nowV < 0) {  
                return;  
            }  
            var moveY = (v + nowV)/2 * t;  
            content.style.top = (contentY + moveY) + "px";  
            setTimeout(inertiaMove, 10);  
        }  
        inertiaMove();  
    })(v, nowTime, contentY);  
});  
