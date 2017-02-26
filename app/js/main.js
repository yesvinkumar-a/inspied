$(function(){
    $("body").queryLoader2({
      barColor: "",
      backgroundColor: "#111",
      percentage: false,
      barHeight: 0,
      minimumTime: 200,
      fadeOutTime: 1000,
      onProgress: function(){
        loader();
      },
      onComplete : function(){
        remove('loader');
        addSlides();
        var tl = new TimelineMax();
        tl.to('#wrapper',0.5, {opacity:1,ease: Power2.easeOut});
        tl.to('.logo',0.2, {opacity:1,ease: Power2.easeOut});
        tl.to('#frame',0.5, {opacity:1,ease: Power2.easeOut});
        /*console.log("activeSlide: "+activeSlide);*/
        initWebglBackground();
        setInterval(function(){
          tl.to('.bdy',3, {backgroundColor:getRandomColor(), ease: Power2.easeOut});
        },1000)
      }
    });
});
