var particles = 10;
var container = document.createElement('div');

var width = $(window).innerWidth() - 100;
var height = $(window).innerHeight() - 100;
var current = 0;
var count = 0;

var length = ($('.slide').length-1);

var dots = $('.slide').length;
var slide = $('.slide');
var slideWidth = width;
var slideHeight = height;

var wrapper;
var container;
var width;
var height;
var scene, camera, light, renderer;
var geometry, cube, mesh, material;
var data, texture, points;
var controls;
var fboParticles, rtTexturePos, rtTexturePos2, simulationShader;
var planeMat, planeGeo, plane;
var R, G, B;
var timer = 0;
var activeSlide = 0;

function initWebglBackground () {
  var sl = new ShaderLoader();
      sl.loadShaders({
          vertex_simulation_shader : "",
          fragment_simulation_shader : "",
          fragment_simulation_shader_s2 : "",
          vs_particles : "",
          fs_particles : ""
      }, "./glsl/base/", initWebgl );
}

function initWebgl() {
  javascript:(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//rawgit.com/mrdoob/stats.js/master/build/stats.min.js';document.head.appendChild(script);})()
  container = document.createElement( 'div' );
  //document.body.appendChild( container );
  $(".bdy").append( container );

  width = window.innerWidth;
  height = window.innerHeight;


  console.log("width: "+ width);
  renderer = new THREE.WebGLRenderer({alpha:true});
  container.appendChild( renderer.domElement );
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 50, width / height, 1, 1000 );
  scene.add( camera );

  controls = new THREE.OrbitControls2( camera );
  controls.radius = 300;
  controls.speed = 4;

  //
  if ( ! renderer.context.getExtension( 'OES_texture_float' ) ) {
    alert( 'OES_texture_float is not :(' );
  }

  // Start Creation of DataTexture
  // Could it be simplified with THREE.FBOUtils.createTextureFromData(textureWidth, textureWidth, data); ?

  data = new Float32Array( width * height * 3 );

  texture = new THREE.DataTexture( data, width, height, THREE.RGBFormat, THREE.FloatType );
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.needsUpdate = true;


  // zz85 - fbo init

  rtTexturePos = new THREE.WebGLRenderTarget(width, height, {
    wrapS:THREE.RepeatWrapping,
    wrapT:THREE.RepeatWrapping,
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBFormat,
    type:THREE.FloatType,
    stencilBuffer: false
  });

  rtTexturePos2 = rtTexturePos.clone();

  simulationShader = new THREE.ShaderMaterial({

    uniforms: {
      tPositions: { type: "t", value: texture },
      origin: { type: "v3", value: new THREE.Vector3() },
      timer: { type: "f", value: 0 }
    },

    /*vertexShader: document.getElementById('texture_vertex_simulation_shader').textContent,
    fragmentShader:  document.getElementById('texture_fragment_simulation_shader').textContent*/

    vertexShader: ShaderLoader.get( "vertex_simulation_shader" ),
    fragmentShader:  ShaderLoader.get( "fragment_simulation_shader" )

  });

  fboParticles = new THREE.FBOUtils( width, renderer, simulationShader );
  fboParticles.renderToTexture(rtTexturePos, rtTexturePos2);
  fboParticles.in = rtTexturePos;
  fboParticles.out = rtTexturePos2;


  geometry = new THREE.Geometry();

  for ( var i = 0, l = width * height; i < l; i ++ ) {
    var vertex = new THREE.Vector3();
    vertex.x = ( i % width ) / width ;
    vertex.y = Math.floor( i / width ) / height;
    geometry.vertices.push( vertex );
  }

  material = new THREE.ShaderMaterial( {
    uniforms: {
      "map": { type: "t", value: rtTexturePos },
      "width": { type: "f", value: width },
      "height": { type: "f", value: height },
      "pointColor": { type: "v4", value: new THREE.Vector4( 0.75, 0.20, 0.80, 0.06 ) },
      "pointSize": { type: "f", value: 1 }
    },
    vertexShader: ShaderLoader.get( "vs_particles" ),
    fragmentShader:  ShaderLoader.get( "fs_particles" ),
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: false,
    transparent: true
  } );

  mesh = new THREE.ParticleSystem( geometry, material );
  scene.add( mesh );
  renderer.setSize( width, height );
  animate();
  onWindowResize();
  window.addEventListener( 'resize', onWindowResize, false );
}

function animate() {
  R = G = B = Math.random().toFixed(1);
  requestAnimationFrame( animate );
  render();
}

function render() {
  timer += 0.01;
  simulationShader.uniforms.timer.value = timer;
  simulationShader.uniforms.origin.value.x = Math.cos( timer * 2.3 ) * 0.5 + 0.5;
  simulationShader.uniforms.origin.value.y = Math.sin( timer * 2.5 ) * 0.5 + 0.5;
  simulationShader.uniforms.origin.value.z = Math.cos( timer * 2.7 ) * 0.5 + 0.5;

  // swap
  var tmp = fboParticles.in;
  fboParticles.in = fboParticles.out;
  fboParticles.out = tmp;

  simulationShader.uniforms.tPositions.value = fboParticles.in;
  fboParticles.simulate(fboParticles.out);
  material.uniforms.map.value = fboParticles.out;

  /*var clrVal = 0.1;

  var x = 0.1;
  for (var i = (x+0.1); i < 1; i += 0.1) {
      console.log('i', i.toFixed(1));
      x = i.toFixed(1);
  }*/

  material.uniforms.pointColor.value.x = 0.80;
	material.uniforms.pointColor.value.y = 0.30;
	material.uniforms.pointColor.value.z = 0.10;
	material.uniforms.pointColor.value.w = 0.06;
  material.uniforms.pointSize = 0;

  controls.update();

  renderer.render( scene, camera );
}

function onWindowResize( event ) {
  renderer.setSize( window.innerWidth, window.innerHeight );
}

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

function addSlides() {


    controlPanel = $('<div/>', {
      'class': 'slider-nav'
    })

    $('#wrapper').append(controlPanel);

    var links = [];
    for (var i = 0; dots > i; i++) {
      var active = (current === i) ? 'is-active' : '';
      links.push('<a class="slider-nav-control ' + active + '" name="'+i+'"></a>');
    }
    controlPanel.html(links.join(''));
    navControl = controlPanel.find('.slider-nav-control');

    navControl.on('click', function(e) {
      if ($(this).hasClass('is-active')) return;
      e.preventDefault();
      //alert("Slide: " + slide);
      var slide = this.name;;
      show(slide);
    });

    function show(slide){
      $('.slide').hide();
      $('.slider-nav-control').removeClass('is-active');
      var divname = slide;
      current = divname;
      count = current;
      $("#"+divname).show();
      var TweenObject = $("#"+divname);
      var Tween = TweenMax.to(TweenObject, 1.5, {/*backgroundColor:getRandomColor(), ease:Power2. easeOut*/}) ;
      var bgTween = TweenMax.to('.bdy', 1.5, {backgroundColor:getRandomColor(), ease:Power2. easeOut}) ;
      $('a[name='+slide+']').addClass('is-active');
      console.log($("#"+divname).attr('id'));
      activeSlide = $("#"+divname).attr('id');
    }

    function initSlide() {
      $('a.slider-nav-control').each(function(){
        if($(this).hasClass('is-active')) {
          var initialSlide = this.name;
          show(initialSlide);
        }
      });
    }
    //alert("count: "+count);
    $(window).bind('mousewheel DOMMouseScroll', function(event){
      if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
          if(slide==0){
            //alert("count less than down: "+slide);
            slide=0;
            count=0;
          }
          else {
            slide = --count;
            //alert("count down: "+slide);
            show(slide);
          }
        }
        else {
           if(slide>=length){
            //alert("count less than up: "+slide);
            slide=length;
            count=length;
          }
          else {
            slide = ++count;
            //alert("count up: "+slide);
            show(slide);
          }
        }
    });
    initSlide();
}

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
