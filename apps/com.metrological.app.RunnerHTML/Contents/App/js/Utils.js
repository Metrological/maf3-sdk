var Utils = (function(){

    var colideDist = 40;

    var canColide = function(obj1, obj2){
        return (Math.max(obj1.x,obj2.x) - Math.min(obj1.x,obj2.x)) <= colideDist;
    };

    var isInRange = function(val, min, max ){
        return val >= Math.min(min,max) && val <= Math.max(min,max);
    };

    var rangeIntersect = function(min0, max0, min1, max1){
        return Math.max(min0, max0) >= Math.min(min1, max1) &&
            Math.min(min0, max0) <= Math.max(min1, max1);
    };
    var rectColide = function(r0,r1){
        return rangeIntersect(r0.x + r0.animation[r0.frame].cx, r0.x + r0.width, r1.x, r1.x + r1.width) &&
            rangeIntersect(r0.y + r0.animation[r0.frame].cy, r0.y + r0.height + r0.animation[r0.frame].ch, r1.y, r1.y + r1.height);
    };

    return {
        canColide: canColide,
        isInrange: isInRange,
        rangeIntersect: rangeIntersect,
        rectColide: rectColide
    };

}());