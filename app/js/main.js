$(function(){
    $("body").queryLoader2({
      barColor: "",
      backgroundColor: "#111",
      percentage: false,
      barHeight: 0,
      minimumTime: 200,
      fadeOutTime: 3000,
      onProgress: function(){
        loader();
      },
      onComplete : function(){
        remove('loader');
        var logo = new TimelineMax();
        loader.add(TweenMax.to('.logo',0.5, {
          opacity:1,
          //backgroundColor:getRandomColor,
          scale:0.5
        }))
      }
    });
});
