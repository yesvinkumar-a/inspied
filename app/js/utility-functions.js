var particles = 10;
var container = document.createElement('div');

function loader() {
  container.id = 'loader';
  container.className = 'loader';
  document.body.appendChild(container);

  for (var i=0; i<particles; i++) {
    var c = document.createElement('div');
    c.className = "circle";
    container.appendChild(c);
  }
  var dots = new TimelineMax({
    yoyo:true,
    delay:0.01,
    repeat:-1
  })

  dots.add(TweenMax.staggerTo('.circle',0, {
    backgroundColor:getRandomColor,
  }))

  dots.add(TweenMax.staggerFrom('.circle', 0.2, {
    ease:Back.easeOut, x:0, cycle:{
      x:curve,
      y:curve,
      rotationX:50,
      backgroundColor:getRandomColor,
    },
    opacity:0,
  }, 0.05));
}
function curve(i) {
  var n = i / particles * 26;
  return (Math.cos(n)) * -40;
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++ ) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function remove(id) {
    var elem = document.getElementById(id);
    return elem.parentNode.removeChild(elem);
}
