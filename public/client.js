 
import * as THREE  from './build/three.module.js' ;
import { GLTFLoader } from './jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from './jsm/loaders/DRACOLoader.js'
import { OrbitControls } from './jsm/controls/OrbitControls.js';
import Stats from './jsm/libs/stats.module.js';
import { GUI } from './jsm/libs/lil-gui.module.min.js';
import { Water } from './jsm/objects/Water2.js';
import { TWEEN } from '/jsm/libs/tween.module.min.js';
import * as SkeletonUtils from '/jsm/utils/SkeletonUtils.js';
import * as YUKA from '/yuka/build/yuka.module.js';
import { EntityManager } from '/yuka/build/yuka.module.js';
import { MeshoptDecoder } from '/jsm/libs/meshopt_decoder.module.js';
import { PointerLockControls } from './jsm/controls/PointerLockControls.js'


var scene = new THREE.Scene();


var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 ); 
camera.position.x = 0;
camera.position.y = 5;
camera.position.z = 10;
var renderer = new THREE.WebGLRenderer();

const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 1;
	renderer.outputEncoding = THREE.sRGBEncoding;
	
renderer.shadowMap.enabled = true; 
renderer.shadowMap.type = THREE.PCFHardShadowMap;
renderer.gammaOutput = false;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const loader = new GLTFLoader();
loader.setMeshoptDecoder(MeshoptDecoder);
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
var controls = new OrbitControls( camera, renderer.domElement );
camera.position.set( 0, 20, 100 );
controls.update();
loader.setDRACOLoader(dracoLoader); 
let example = new THREE.InstancedMesh();
let example3 = new  THREE.InstancedMesh();
let example2 = new  THREE.InstancedMesh();
let example4 = new  THREE.InstancedMesh();
let example5 = new  THREE.InstancedMesh();
let wintertree = new THREE.InstancedMesh();
let wintertree2 = new  THREE.InstancedMesh();
let wintertree3 = new  THREE.InstancedMesh();
let wintertree4 = new  THREE.InstancedMesh();
let wintertree5 = new  THREE.InstancedMesh();
let springtree = new THREE.InstancedMesh();
let springtree2 = new  THREE.InstancedMesh();
let springtree3 = new  THREE.InstancedMesh();
let springtree4 = new  THREE.InstancedMesh();
let springtree5 = new  THREE.InstancedMesh();
const tloader = new THREE.TextureLoader();
var geometry = new THREE.PlaneGeometry( 70, 70 );
var mixer;
var mixer2;
var mixer4;
var mixer5;
var mixer6;
var autumntree = new  THREE.InstancedMesh();
var autumntree2 = new  THREE.InstancedMesh();
var autumntree3 = new  THREE.InstancedMesh();
var autumntree4 = new  THREE.InstancedMesh();
var autumntree5 = new  THREE.InstancedMesh();

const time = new YUKA.Time(); 
const entityManager = new YUKA.EntityManager();
const material = new THREE.MeshPhongMaterial( {color: 0x808080, side: THREE.DoubleSide} );
const plane = new THREE.Mesh( geometry, material );


plane.rotation.x = 3.14/2;
plane.position.y= 0;

const audioListener = new THREE.AudioListener();
const oceanAmbientSound = new THREE.Audio( audioListener )
scene.add( oceanAmbientSound );
camera.add(audioListener)
const aloader = new THREE.AudioLoader();
aloader.load(
	// resource URL
	'out.mp3',

	// onLoad callback
	function ( audioBuffer ) {
		// set the audio object buffer to the loaded object
		oceanAmbientSound.setBuffer( audioBuffer );

		// play the audio
    oceanAmbientSound.setLoop(true);

	});



const flowMap = tloader.load('./Water/flowmap3.png');
const watergeo = new THREE.PlaneBufferGeometry(10,70);
const water = new Water(watergeo,{
    scale :2 ,
    textureWidth: 1024,
    textureHeight: 1024,
    flowSpeed:0.09,
    reflectivity:0.35,
    flowMap: flowMap
});
water.position.y = 0.1;
water.rotation.x = -Math.PI/2;





const winterwater = new Water(watergeo,{
  scale :2 ,
  textureWidth: 1024,
  textureHeight: 1024,
  flowSpeed:0,
  reflectivity:1,
  flowMap: null
});
winterwater.position.y = 0.3;
winterwater.rotation.x = -Math.PI/2;






tloader.load(
    // Resource URL
    './textures/Grass004_1K_Color.jpg',
    // Function when resource is loaded
    function ( texture ) {
        // Do something with the texture
        var material = new THREE.MeshStandardMaterial( {
            map: texture,
            normalMap: new THREE.TextureLoader().load('./textures/Grass004_1K_NormalDX.jpg'),
            displacementMap: new THREE.TextureLoader().load('./textures/Grass004_1K_Displacement.jpg'),
            roughnessMap: new THREE.TextureLoader().load('./textures/Grass004_1K_Roughness.jpg'),
            aoMap: new THREE.TextureLoader().load('./textures/Grass004_1K_AmbientOcclusion.jpg')
         });
       
         geometry.attributes.position.needsUpdate = true;
         var plane2 = new THREE.Mesh(geometry, material);
         plane2.material.side = THREE.DoubleSide;     
      
         scene.add(plane2);
         plane2.rotation.x = 3.14/2;
        plane2.position.y= 0;
        plane2.castShadow = false;
        plane2.receiveShadow= true;

    }
);

const clock = new THREE.Clock();

const vertexShader = `
  varying vec2 vUv;
  uniform float time;
  
	void main() {

    vUv = uv;
    
    // VERTEX POSITION
    
    vec4 mvPosition = vec4( position, 1.0 );
    #ifdef USE_INSTANCING
    	mvPosition = instanceMatrix * mvPosition;
    #endif
    
    // DISPLACEMENT
    
    // here the displacement is made stronger on the blades tips.
    float dispPower = 1.0 - cos( uv.y * 3.1416 / 2.0 );
    
    float displacement = sin( mvPosition.z + time * 10.0 ) * ( 0.1 * dispPower );
    mvPosition.z += displacement;
    
    //
    
    vec4 modelViewPosition = modelViewMatrix * mvPosition;
    gl_Position = projectionMatrix * modelViewPosition;

	}
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform float color;
  void main() {
  	vec3 baseColor = vec3( color, 1.0, 0.5) ;
    float clarity = ( vUv.y * 0.5 ) + 0.5;
    gl_FragColor = vec4( baseColor * clarity, 1 );
  }
`;

const uniforms = {
	time: {
  	value: 0
  },
  color: {
  	value: 0.41
  }
}

const leavesMaterial = new THREE.ShaderMaterial({
	
  vertexShader,
  fragmentShader,
  uniforms,
  side: THREE.DoubleSide
});


var instanceNumber = 1000;
const dummy = new THREE.Object3D();

const geometry2 = new THREE.PlaneGeometry( 0.1, 1, 1, 4 );
geometry2.translate( 0, 0.5, 0 ); // move grass blade geometry lowest point at 0.

var instancedMesh = new THREE.InstancedMesh( geometry2, leavesMaterial, instanceNumber );
instancedMesh.position.x = 10;
const instancedMesh2 = new THREE.InstancedMesh( geometry2, leavesMaterial, instanceNumber );
instancedMesh2.position.x = 20;
const instancedMesh3 = new THREE.InstancedMesh( geometry2, leavesMaterial, instanceNumber );
instancedMesh3.position.x = 30;
const instancedMesh4 = new THREE.InstancedMesh( geometry2, leavesMaterial, instanceNumber );
instancedMesh4.position.z = 10;
instancedMesh4.position.x = 10;
const instancedMesh5 = new THREE.InstancedMesh( geometry2, leavesMaterial, instanceNumber );
instancedMesh5.position.z = 10;
instancedMesh5.position.x = 20;
const instancedMesh6 = new THREE.InstancedMesh( geometry2, leavesMaterial, instanceNumber );
instancedMesh6.position.z = 10;
instancedMesh6.position.x = 30;
const instancedMesh7 = new THREE.InstancedMesh( geometry2, leavesMaterial, instanceNumber );
instancedMesh7.position.z = 20;
instancedMesh7.position.x = 10;
const instancedMesh8 = new THREE.InstancedMesh( geometry2, leavesMaterial, instanceNumber );
instancedMesh8.position.z = 20;
instancedMesh8.position.x = 20;
const instancedMesh9 = new THREE.InstancedMesh( geometry2, leavesMaterial, instanceNumber );
instancedMesh9.position.z = 20;
instancedMesh9.position.x = 30;
scene.add( instancedMesh, instancedMesh2,instancedMesh3,instancedMesh4,instancedMesh5,instancedMesh6,instancedMesh7,instancedMesh8,instancedMesh9 );
const instancedMesh10 = new THREE.InstancedMesh( geometry2, leavesMaterial, instanceNumber );
instancedMesh10.position.z = 30;
instancedMesh10.position.x = 10;
const instancedMesh11 = new THREE.InstancedMesh( geometry2, leavesMaterial, instanceNumber );
instancedMesh11.position.z = 30;
instancedMesh11.position.x = 20;
const instancedMesh12 = new THREE.InstancedMesh( geometry2, leavesMaterial, instanceNumber );
instancedMesh12.position.z = 30;
instancedMesh12.position.x = 30;
scene.add(instancedMesh10, instancedMesh11,instancedMesh12)

const instancedMesh13 = new THREE.InstancedMesh( geometry2, leavesMaterial, instanceNumber );
instancedMesh13.position.z = -10;
instancedMesh13.position.x = 10;
const instancedMesh14 = new THREE.InstancedMesh( geometry2, leavesMaterial, instanceNumber );
instancedMesh14.position.z = -10;
instancedMesh14.position.x = 20;
const instancedMesh15 = new THREE.InstancedMesh( geometry2, leavesMaterial, instanceNumber );
instancedMesh15.position.z = -10;
instancedMesh15.position.x = 30;
scene.add(instancedMesh13, instancedMesh14,instancedMesh15)

const instancedMesh16 = new THREE.InstancedMesh( geometry2, leavesMaterial, instanceNumber );
instancedMesh16.position.z = -20;
instancedMesh16.position.x = 10;
const instancedMesh17 = new THREE.InstancedMesh( geometry2, leavesMaterial, instanceNumber );
instancedMesh17.position.z = -20;
instancedMesh17.position.x = 20;
const instancedMesh18 = new THREE.InstancedMesh( geometry2, leavesMaterial, instanceNumber );
instancedMesh18.position.z = -20;
instancedMesh18.position.x = 30;
scene.add(instancedMesh16, instancedMesh17,instancedMesh18)


const instancedMesh19 = new THREE.InstancedMesh( geometry2, leavesMaterial, instanceNumber );
instancedMesh19.position.z = -30;
instancedMesh19.position.x = 10;
const instancedMesh20 = new THREE.InstancedMesh( geometry2, leavesMaterial, instanceNumber );
instancedMesh20.position.z = -30;
instancedMesh20.position.x = 20;
const instancedMesh21 = new THREE.InstancedMesh( geometry2, leavesMaterial, instanceNumber );
instancedMesh21.position.z = -30;
instancedMesh21.position.x = 30;
scene.add(instancedMesh19, instancedMesh20,instancedMesh21)


const instancedMesh22 = new THREE.InstancedMesh( geometry2, leavesMaterial, instanceNumber );
instancedMesh22.position.x = -10;

const instancedMesh23 = new THREE.InstancedMesh( geometry2, leavesMaterial, instanceNumber );
instancedMesh23.position.x = -20;

const instancedMesh24 = new THREE.InstancedMesh( geometry2, leavesMaterial, instanceNumber );
instancedMesh24.position.x = -30;

scene.add(instancedMesh22, instancedMesh23,instancedMesh24)


const instancedMesh25 = new THREE.InstancedMesh( geometry2, leavesMaterial, instanceNumber );
instancedMesh25.position.x = -10;
instancedMesh25.position.z = 10;
const instancedMesh26 = new THREE.InstancedMesh( geometry2, leavesMaterial, instanceNumber );
instancedMesh26.position.x = -20;
instancedMesh26.position.z = 10;
const instancedMesh27 = new THREE.InstancedMesh( geometry2, leavesMaterial, instanceNumber );
instancedMesh27.position.x = -30;
instancedMesh27.position.z = 10;
scene.add(instancedMesh25, instancedMesh26,instancedMesh27)


const instancedMesh28 = new THREE.InstancedMesh( geometry2, leavesMaterial, instanceNumber );
instancedMesh28.position.x = -10;
instancedMesh28.position.z = 20;
const instancedMesh29 = new THREE.InstancedMesh( geometry2, leavesMaterial, instanceNumber );
instancedMesh29.position.x = -20;
instancedMesh29.position.z = 20;
const instancedMesh30 = new THREE.InstancedMesh( geometry2, leavesMaterial, instanceNumber );
instancedMesh30.position.x = -30;
instancedMesh30.position.z = 20;
scene.add(instancedMesh28, instancedMesh29,instancedMesh30)


const instancedMesh31 = new THREE.InstancedMesh( geometry2, leavesMaterial, instanceNumber );
instancedMesh31.position.x = -10;
instancedMesh31.position.z = 30;
const instancedMesh32 = new THREE.InstancedMesh( geometry2, leavesMaterial, instanceNumber );
instancedMesh32.position.x = -20;
instancedMesh32.position.z = 30;
const instancedMesh33 = new THREE.InstancedMesh( geometry2, leavesMaterial, instanceNumber );
instancedMesh33.position.x = -30;
instancedMesh33.position.z = 30;
scene.add(instancedMesh31, instancedMesh32,instancedMesh33)

const instancedMesh34 = new THREE.InstancedMesh( geometry2, leavesMaterial, instanceNumber );
instancedMesh34.position.x = -10;
instancedMesh34.position.z = -10;
const instancedMesh35 = new THREE.InstancedMesh( geometry2, leavesMaterial, instanceNumber );
instancedMesh35.position.x = -20;
instancedMesh35.position.z = -10;
const instancedMesh36= new THREE.InstancedMesh( geometry2, leavesMaterial, instanceNumber );
instancedMesh36.position.x = -30;
instancedMesh36.position.z = -10;
scene.add(instancedMesh34, instancedMesh35,instancedMesh36)

const instancedMesh37 = new THREE.InstancedMesh( geometry2, leavesMaterial, instanceNumber );
instancedMesh37.position.x = -10;
instancedMesh37.position.z = -20;
const instancedMesh38 = new THREE.InstancedMesh( geometry2, leavesMaterial, instanceNumber );
instancedMesh38.position.x = -20;
instancedMesh38.position.z = -20;
const instancedMesh39= new THREE.InstancedMesh( geometry2, leavesMaterial, instanceNumber );
instancedMesh39.position.x = -30;
instancedMesh39.position.z = -20;
scene.add(instancedMesh37, instancedMesh38,instancedMesh39)

const instancedMesh40 = new THREE.InstancedMesh( geometry2, leavesMaterial, instanceNumber );
instancedMesh40.position.x = -10;
instancedMesh40.position.z = -30;
const instancedMesh41 = new THREE.InstancedMesh( geometry2, leavesMaterial, instanceNumber );
instancedMesh41.position.x = -20;
instancedMesh41.position.z = -30;
const instancedMesh42= new THREE.InstancedMesh( geometry2, leavesMaterial, instanceNumber );
instancedMesh42.position.x = -30;
instancedMesh42.position.z = -30;
scene.add(instancedMesh40, instancedMesh41,instancedMesh42)
// Position and scale the grass blade instances randomly.

for ( let i=0 ; i<instanceNumber ; i++ ) {

	dummy.position.set(
  	( Math.random() - 0.5 ) * 10,
    0,
    ( Math.random() - 0.5 ) * 10
  );
  
  
  dummy.scale.setScalar( 0.5 + Math.random() * 0.5 );
  
  dummy.rotation.y = Math.random() * Math.PI;
  
  dummy.updateMatrix();
  instancedMesh.setMatrixAt( i, dummy.matrix );
  instancedMesh2.setMatrixAt( i, dummy.matrix );
  instancedMesh3.setMatrixAt( i, dummy.matrix );
  instancedMesh4.setMatrixAt( i, dummy.matrix );
  instancedMesh5.setMatrixAt( i, dummy.matrix );
  instancedMesh6.setMatrixAt( i, dummy.matrix );
  instancedMesh7.setMatrixAt( i, dummy.matrix );
  instancedMesh8.setMatrixAt( i, dummy.matrix );
  instancedMesh9.setMatrixAt( i, dummy.matrix );
  instancedMesh10.setMatrixAt( i, dummy.matrix );
  instancedMesh11.setMatrixAt( i, dummy.matrix );
  instancedMesh12.setMatrixAt( i, dummy.matrix );
  instancedMesh13.setMatrixAt( i, dummy.matrix );
  instancedMesh14.setMatrixAt( i, dummy.matrix );
  instancedMesh15.setMatrixAt( i, dummy.matrix );
  instancedMesh16.setMatrixAt( i, dummy.matrix );
  instancedMesh17.setMatrixAt( i, dummy.matrix );
  instancedMesh18.setMatrixAt( i, dummy.matrix );
  instancedMesh19.setMatrixAt( i, dummy.matrix );
  instancedMesh20.setMatrixAt( i, dummy.matrix );
  instancedMesh21.setMatrixAt( i, dummy.matrix );
  instancedMesh22.setMatrixAt( i, dummy.matrix );
  instancedMesh23.setMatrixAt( i, dummy.matrix );
  instancedMesh24.setMatrixAt( i, dummy.matrix );
  instancedMesh25.setMatrixAt( i, dummy.matrix );
  instancedMesh26.setMatrixAt( i, dummy.matrix );
  instancedMesh27.setMatrixAt( i, dummy.matrix );
  instancedMesh28.setMatrixAt( i, dummy.matrix );
  instancedMesh29.setMatrixAt( i, dummy.matrix );
  instancedMesh30.setMatrixAt( i, dummy.matrix );
  instancedMesh31.setMatrixAt( i, dummy.matrix );
  instancedMesh32.setMatrixAt( i, dummy.matrix );
  instancedMesh33.setMatrixAt( i, dummy.matrix );
  instancedMesh34.setMatrixAt( i, dummy.matrix );
  instancedMesh35.setMatrixAt( i, dummy.matrix );
  instancedMesh36.setMatrixAt( i, dummy.matrix );
  instancedMesh37.setMatrixAt( i, dummy.matrix );
  instancedMesh38.setMatrixAt( i, dummy.matrix );
  instancedMesh39.setMatrixAt( i, dummy.matrix );
  instancedMesh40.setMatrixAt( i, dummy.matrix );
  instancedMesh41.setMatrixAt( i, dummy.matrix );
  instancedMesh42.setMatrixAt( i, dummy.matrix );
    }

    let particles;
    let positions = [];
    let  velocities = [];
    var numSnowflakes = 15000;
    const maxrange = 350;
    const minrange = maxrange/2;
    const minheight =100;

    const geometry3 = new THREE.BufferGeometry();
    addSnowflakes();

  function addSnowflakes(){
   
   for(let i= 0; i<numSnowflakes; i++){
    positions.push(
      Math.floor(Math.random()*maxrange-minrange),
      Math.floor(Math.random()*maxrange+minheight),
      Math.floor(Math.random()*maxrange-minrange));
      
    velocities.push(
      Math.floor(Math.random()*6-3) *0.1,
      Math.floor(Math.random()*5 + 0.12) *0.18,
      Math.floor(Math.random()*6-3) *0.1);
     
   }
  geometry3.setAttribute('position',new THREE.Float32BufferAttribute(positions, 3));
  geometry3.setAttribute('velocity',new THREE.Float32BufferAttribute(velocities, 3));
  const flakematerial = new THREE.PointsMaterial({
    size: 4,
    map: tloader.load("snowflake2.png"),
    blending: THREE.AdditiveBlending,
    depthTest: false, 
    transparent: false,
    opacity:1
    
  });
  particles = new THREE.Points(geometry3,flakematerial);
  //scene.add(particles);
  //console.log(particles);
}
  


function updateParticles(){
 
    for(let i=0; i<numSnowflakes*3;i+=3){
      particles.geometry.attributes.position.array[i] -= particles.geometry.attributes.velocity.array[i];
      particles.geometry.attributes.position.array[i+1] -= particles.geometry.attributes.velocity.array[i+1];
      particles.geometry.attributes.position.array[i+2] -= particles.geometry.attributes.velocity.array[i+2];
  
      
      
      if(particles.geometry.attributes.position.array[i+1]<-1){
        particles.geometry.attributes.position.array[i] = Math.floor(Math.random()*maxrange-minrange);
        particles.geometry.attributes.position.array[i+1] = Math.floor(Math.random()*maxrange+minheight);
        particles.geometry.attributes.position.array[i+2] = Math.floor(Math.random()*maxrange-minrange);
      }
      
    }
    
    particles.geometry.attributes.position.needsUpdate = true;
    }

var params = {
  switch: false
};
var params2 = {
  switch: false
};
var params3 = {
  switch: false
};
var params4 = {
  switch: false
};
var params5 = {
  switch: false
};
var params6 = {
  switch: false
};
var params7 = {
  switch: true
};
var params8 = {
  switch: false
};
const gui = new GUI;


   var controls2 = new PointerLockControls(camera,renderer.domElement);
let keyboard = [];

  addEventListener('keydown',(e)=>{
    keyboard[e.key] = true;
  });

    addEventListener('keyup',(e)=>{
      keyboard[e.key] = false;
    });

  function processkeyboard(){
    let speed = 0.2;
    if(keyboard['w']){
        controls2.moveForward(speed)
    }
    if(keyboard['s']){
      controls2.moveForward(-speed)
  }
  if(keyboard['a']){
    controls2.moveRight(-speed)
}
if(keyboard['d']){
  controls2.moveRight(speed)
}
  }

const cmera = gui.addFolder("Camera controls");
let rb = cmera.add(params6,"switch").name("FirstpersonControls");
rb.listen();
rb.onChange(function(value){
  if(value == true){
    params7.switch = false;
    PointerLockControls.enabled= true;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableRotate = false;
    //controls = null;
    camera.position.set(0,1,0)
    controls2.lock();
  
    controls2.addEventListener( 'unlock', function () {
      params6.switch = false; 
      params7.switch=true;
      PointerLockControls.enabled = false;
      controls.enableZoom = true;
      controls.enablePan = true;
      controls.enableRotate = true;
      controls2.unlock();
    
    } );
  
    processkeyboard();

      
  }
  if(value==false ){
    params7.switch=true;
    PointerLockControls.enabled = false;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.enableRotate = true;
    controls2.unlock();
  }
})





let tb = cmera.add(params7,"switch").name("ThirdPersonControls");
tb.listen() ;

tb.onChange(function(value){
  if(value == true){
    params6.switch = false;
    PointerLockControls.enabled = false;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.enableRotate = true;
    controls2.unlock();
  }
  if(value==false){
    params6.switch=true;
    params7.switch = false;
    PointerLockControls.enabled= true;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableRotate = false;
    camera.position.set(0,1,0)
    controls2.lock();
  }
    
    
  


});






const Weather = gui.addFolder("Weather controls");
let sb = Weather.add(params,"switch" ).name("Snow off");
sb.listen();
sb.onChange( function ( value ) {
    if (value == true){
		numSnowflakes = 0;
    scene.remove(particles);
	}
    else {
		numSnowflakes = 15000;

    for(let i=0; i<numSnowflakes*3;i+=3){
        particles.geometry.attributes.position.array[i] = Math.floor(Math.random()*maxrange-minrange);
        particles.geometry.attributes.position.array[i+1] = Math.floor(Math.random()*maxrange+minheight);
        particles.geometry.attributes.position.array[i+2] = Math.floor(Math.random()*maxrange-minrange);
     
    }
    scene.add(particles);
	}
});

let pb = Weather.add(params8,"switch" ).name("rain off");
pb.listen();
pb.onChange( function ( value ) {
    if (value == true){
      rainCount = 0
    scene.remove(rain);
	}
    else {
		rainCount = 15000;

    for(let i=0; i<rainCount*3;i+=3){
      rainGeo.attributes.position.array[i+1] -= rainGeo.attributes.velocity.array[i+1]*10;
     
      }
    scene.add(rain);
	}
});
const season2 = gui.addFolder("Seasons");
let lb = season2.add(params2,"switch").name("Spring");
lb.listen();
lb.onChange(function(value2){
  if (value2 == true){
    season = 'Spring';
    x = 0;
    params3.switch = false;
    params4.switch =  false;
    params5.switch = false;
    leavesMaterial.uniforms.color.value = 0.41;
    
    
  }
});
let qb = season2.add(params3,"switch").name("Summer");
qb.listen();
qb.onChange(function(value3){
  if (value3 == true){
    season = 'Summer';
    x = 50;
    params2.switch = false;
    params4.switch = false;
    params5.switch = false;
    leavesMaterial.uniforms.color.value = 0.75;

  }
});

let ab = season2.add(params4,"switch").name("Autumn");
ab.listen();
ab.onChange(function(value4){
  if (value4 == true){
    season = 'Autumn';
    x = 100;
    params2.switch = false;
    params3.switch = false;
    params5.switch = false;
    leavesMaterial.uniforms.color.value = 1;

    
  }
});
let cb = season2.add(params5,"switch").name("Winter");
cb.listen();
cb.onChange(function(value5){
  if (value5 == true){
    season = 'Winter';
    x = 200;
    params2.switch = false;
    params3.switch = false;
    params4.switch = false;
    leavesMaterial.uniforms.color.value = 2;

   
  }
});




var iframe; 

var dayamount; 
var THREEx	= THREEx	|| {};

THREEx.DayNight	= {};


THREEx.DayNight.currentPhase	= function(sunAngle){

  if( Math.sin(sunAngle) > Math.sin(0) ){
		return 'day'
	}else if( Math.sin(sunAngle) > Math.sin(-Math.PI/6) ){
		return 'twilight'
	}else{

    return 'night'
    
    
	}
}

var x= 0;
var season;
var r = 0;
var q = 0;
var s = 0;
var a = 0;
//////////////////////////////////////////////////////////////////////////////////
//		starfield								//
//////////////////////////////////////////////////////////////////////////////////

THREEx.DayNight.StarField	= function(){
	// create the mesh

	var material	= new THREE.MeshBasicMaterial({
		map: new  THREE.TextureLoader().load('work.png'),
		side	: THREE.BackSide,
 		color	: 0x808080,
	})
	var geometry	= new THREE.SphereGeometry(100, 100, 32)
	var mesh	= new THREE.Mesh(geometry, material)
	this.object3d	= mesh
 
	this.update	= function(sunAngle){
		var phase	= THREEx.DayNight.currentPhase(sunAngle)
		if( phase === 'day' ){
      x = x+1/16;
      mesh.visible = false;
      if(x<50){
        r = r+1 ;
      season = 'Spring';
      //console.log(season)
      scene.remove(particles);   
      //console.log(r);
      if(r == 1){
      Spring(); 
      }
      q = 0;
      s = 0;
      a = 0; 
      }else if(x >50 && x < 100){
        season = 'Summer';
        s= s+1
        //console.log(season);
        scene.remove(rain);
        scene.remove(particles);
        if(s == 1){
        summer();  
        }
        r = 0;
        q = 0;
        a = 0;
      }else if(x>= 100 && x< 200){
        season = 'Autumn';
          a = a+1;
        //console.log(season);
        if (a == 1){
          autumn();
        }
        scene.remove(rain);
        scene.remove(particles);
        r = 0;
        q = 0;
        s = 0;
      }else if(x>= 200 && x<250){
        q = q +1;
        scene.remove(rain);
        season= 'Winter'  
        if(q == 1 ){
        Winter();
        }
        //console.log(season);
        r=  0;
        s = 0;
        a = 0;
      }else if(x>=250){
        x = 0;
        season= 'Spring'
        //console.log(season);
        scene.remove(particles);
        q=  0;
        r = 0;
        s = 0;
        a = 0;
      }
		}else if( phase === 'twilight' ){
			mesh.visible = false;
      x = x+1/16;
      if(x<50){
        r = r+1 ;
      season = 'Spring';
      //console.log(season)
      scene.remove(particles);   
      //console.log(r);
      if(r == 1){
      Spring(); 
      }
      q = 0;
      s = 0;
      a = 0; 
      }else if(x >50 && x < 100){
        season = 'Summer';
        s= s+1
        //console.log(season);
        scene.remove(particles);
        scene.remove(rain);
        if(s == 1){
        summer();  
        }
        r = 0;
        q = 0;
        a = 0;
      }else if(x>= 100 && x< 200){
        season = 'Autumn';
        a = a+1;
        //console.log(season);
        if (a == 1){
          autumn();
        }
        scene.remove(particles);
        scene.remove(rain);
        r = 0;
        q = 0;
        s = 0;
      }else if(x>= 200 && x<250){
        q = q +1;
        season= 'Winter'
        scene.remove(rain);
        if(q == 1 ){
        Winter();
        }
        //console.log(season);
        r=  0;
        s = 0;
        a = 0;
      }else if(x>=250){
        x = 0;
        season= 'Spring'
        //console.log(season);
        scene.remove(particles);
        q=  0;
        r = 0;
        s = 0;
        a = 0;
      }
		} else if(phase === 'night') {
      x = x+1/16;
      //console.log(x)
			mesh.visible	= true;
			mesh.rotation.y	= sunAngle / 5
	        	var intensity	= Math.abs(Math.sin(sunAngle))
	        	material.color.setRGB(intensity, intensity, intensity)
       
            if(x<50){
              r = r+1 ;
            season = 'Spring';
        //    console.log(season)
            scene.remove(particles);   
            //console.log(r);
            if(r == 1){
            Spring(); 
            }
            q = 0;
            s = 0;
            a = 0; 
            }else if(x >50 && x < 100){
              season = 'Summer';
              s= s+1
          //    console.log(season);
              scene.remove(particles);
              scene.remove(rain);
              if(s == 1){
              summer();  
              }
              r = 0;
              q = 0;
              a = 0;
            }else if(x>= 100 && x< 200){
              season = 'Autumn';
              a = a+1;
            //  console.log(season);
              if (a == 1){
                autumn();
              }
              scene.remove(particles);
              scene.remove(rain);
              r = 0;
              q = 0;
              s = 0;
            }else if(x>= 200 && x<250){
              q = q +1;
              scene.remove(rain);
              season= 'Winter'
              if(q == 1 ){
              Winter();
              }
              //console.log(season);
              r=  0;
              s = 0;
              a = 0;
            }else if(x>=250){
              x = 0;
              season= 'Spring'
              //console.log(season);
              scene.remove(particles);
              q=  0;
              r = 0;
              s = 0;
              a = 0;
            }
		}
	}
}

function Winter(data){
  data = season;
  scene.remove(instancedMeshs);
  waterupdater();
  scene.remove(rain);
  if(oceanAmbientSound.isPlaying == true){
    oceanAmbientSound.stop();
  }
  leavesMaterial.uniforms.color.value = 2;
  if (data === 'Winter' && params.switch == false){
    scene.add(particles);
   
   
    
  }if(data=== 'Winter'){
    scene.remove(example,example2,example3,example4,example5,springtree,springtree2,springtree3,springtree4,springtree5,autumntree,autumntree2,autumntree3,autumntree4,autumntree5);
  }
  const loadedData =  loader.load('wintertree2.glb',function(gltf2){
    wintertree = gltf2.scene;
    wintertree2.add(gltf2.scene.clone());   
    wintertree3.add(gltf2.scene.clone());   
    wintertree4.add(gltf2.scene.clone());   
    wintertree5.add(gltf2.scene.clone()); 
    wintertree.position.z = zpos -15;  



     wintertree2.position.z = zpos2 -10;
     wintertree3.position.z = zpos3 -5;
     wintertree5.position.z = zpos4 ;
     wintertree4.position.z = zpos5 +5;

    wintertree.position.x = xpos -6;
    wintertree.position.y =0;
    wintertree2.position.x = xpos2 -6;
    wintertree2.position.y =0;
    wintertree3.position.x = xpos3-6;
    wintertree3.position.y =0;
    wintertree4.position.x = xpos4-6;
    wintertree4.position.y =0;
    wintertree5.position.x = xpos5-6;
    wintertree5.position.y =0;
    wintertree.castShadow = true;
    wintertree.receiveShadow= true;
    
    scene.add(wintertree,wintertree2,wintertree3,wintertree4,wintertree5);

});
}
//THREE.MathUtils.randFloat(30, -30);
let zpos =0 ,zpos2 = 0 ,zpos3 = 0 ,zpos4=0,zpos5=0;
let xpos=0,xpos2=0,xpos3=0,xpos4=0,xpos5=0;
var x = 0;
function Spring(data3){
  waterupdater();
  data3 = season;
  leavesMaterial.uniforms.color.value = 0.41;
  scene.add(instancedMeshs);
  if(oceanAmbientSound.isPlaying == true){
    oceanAmbientSound.stop();
  }
  scene.remove(example,example2,example3,example4,example5,wintertree,wintertree2,wintertree3,wintertree4,wintertree5,autumntree,autumntree2,autumntree3,autumntree4,autumntree5);
  if (data3 === 'Spring' && params8.switch == false){
    
  scene.add(rain);
  }

  const loadedData =  loader.load('springtree.glb',function(gltf3){
    springtree = gltf3.scene;
    springtree2.add(gltf3.scene.clone());   
    springtree3.add(gltf3.scene.clone());   
    springtree4.add(gltf3.scene.clone());   
    springtree5.add(gltf3.scene.clone()); 
    springtree.position.z = zpos -15 ;  



     springtree2.position.z = zpos2 -10;
     springtree3.position.z =  zpos3 -5;
     springtree5.position.z =  zpos4 ;
     springtree4.position.z = zpos5  +5;

    springtree.position.x =  xpos -6;
    springtree.position.y =0;
    springtree2.position.x = xpos2 -6;
    springtree2.position.y =0;
    springtree3.position.x = xpos3-6;
    springtree3.position.y =0;
    springtree4.position.x = xpos4-6;
    springtree4.position.y =0;
    springtree5.position.x = xpos5-6;
    springtree5.position.y =0;
    springtree.castShadow = true;
    springtree.receiveShadow= true;

    scene.add(springtree,springtree2,springtree3,springtree4,springtree5);    

});
}


function summer (data4){
  waterupdater();
  data4 = season;
  oceanAmbientSound.play()
  leavesMaterial.uniforms.color.value = 0.75;
  scene.remove(instancedMeshs);
  scene.remove(rain);
  scene.remove(springtree,springtree2,springtree3,springtree4,springtree5,wintertree,wintertree2,wintertree3,wintertree4,wintertree5,autumntree,autumntree2,autumntree3,autumntree4,autumntree5);
  const loadedData =  loader.load('Newesttree.gltf',function(gltf){
    example = gltf.scene;
    example2.add(gltf.scene.clone());   
    example3.add(gltf.scene.clone());   
    example4.add(gltf.scene.clone());   
    example5.add(gltf.scene.clone()); 
    example.position.z = zpos -15;  



     example2.position.z = zpos2 -10;
     example3.position.z = zpos3 -5;
     example5.position.z = zpos4;
     example4.position.z = zpos5 +5;
    
    example.position.x = xpos-6;
    example.position.y =0;
    example2.position.x = xpos2-6;
    example2.position.y =0;
    example3.position.x = xpos3-6;
    example3.position.y =0;
    example4.position.x = xpos4-6;
    example4.position.y =0;
    example5.position.x = xpos5-6;
    example5.position.y =0;
    example.castShadow = true;
    example.receiveShadow= true;
    scene.add(example,example2,example3,example4,example5);

});
};


function autumn(data5){
 waterupdater();
  data5 = season;
  if(oceanAmbientSound.isPlaying == true){
    oceanAmbientSound.stop();
  }
  scene.remove(instancedMeshs);
  scene.remove(rain);
  leavesMaterial.uniforms.color.value = 1;
  scene.remove(example,example2,example3,example4,example5,wintertree,wintertree2,wintertree3,wintertree4,wintertree5,springtree,springtree2,springtree3,springtree4,springtree5);
  const loadedData =  loader.load('autumntree3.glb',function(gltf8){
 
    gltf8.scene.scale.set(0.4,0.4,0.4)
    autumntree = gltf8.scene;

    autumntree2 = SkeletonUtils.clone(autumntree);
    autumntree3 = SkeletonUtils.clone(autumntree);
    autumntree4 = SkeletonUtils.clone(autumntree);  
    autumntree5 = SkeletonUtils.clone(autumntree);

 autumntree.position.z = zpos -15;  



  autumntree2.position.z = zpos2 -10;
  autumntree3.position.z = zpos3 -5;
  autumntree5.position.z = zpos4 ;
  autumntree4.position.z = zpos5 +5;

 autumntree.position.x = xpos-6;
 autumntree.position.y =1;
 autumntree2.position.x = xpos2-6;
 autumntree2.position.y =1;
 autumntree3.position.x =xpos3 -6;
 autumntree3.position.y =1;
 autumntree4.position.x = xpos4-6;
 autumntree4.position.y =1;
 autumntree5.position.x = xpos5-6;
 autumntree5.position.y =1;
 autumntree.castShadow = true;
 autumntree.receiveShadow= true;

 
 
    mixer = new THREE.AnimationMixer( autumntree);
    
    mixer2 = new THREE.AnimationMixer(autumntree2);

    mixer4 = new THREE.AnimationMixer( autumntree3);
    
    mixer5 = new THREE.AnimationMixer(autumntree4);
    mixer6 = new THREE.AnimationMixer(autumntree5);
    gltf8.animations.forEach( ( clip ) => {
      
        mixer.clipAction( clip ).play();
        mixer2.clipAction( clip ).play();
        mixer4.clipAction( clip ).play();
        mixer5.clipAction( clip ).play();
        mixer6.clipAction( clip ).play();
});
/* gltf8.animations.forEach( ( clip ) => {
      
  mixer2.clipAction( clip ).play();
  
});
gltf8.animations.forEach( ( clip ) => {
      
  mixer4.clipAction( clip ).play();
  
});
gltf8.animations.forEach( ( clip ) => {
      
  mixer5.clipAction( clip ).play();
  
});
gltf8.animations.forEach( ( clip ) => {
      
  mixer6.clipAction( clip ).play();
  
}); */
scene.add(autumntree, autumntree2,autumntree3,autumntree4,autumntree5);
}) ;

};

function waterupdater(){
  if(season == "Winter"){
  scene.remove(water)
  scene.add(winterwater)
}if(season !== "Winter"){
  scene.remove(winterwater);
  scene.add(water);
}
}

var obj = { add:function(){ 
  
      xpos = THREE.MathUtils.randFloat(25, -25);
      xpos2 = THREE.MathUtils.randFloat(25, -25);
      xpos3=  THREE.MathUtils.randFloat(25, -25);
      xpos4 =  THREE.MathUtils.randFloat(25, -25);
      xpos5 =  THREE.MathUtils.randFloat(25, -25);
      zpos =  THREE.MathUtils.randFloat(20, -20);
      zpos2 =  THREE.MathUtils.randFloat(20, -20);
      zpos3 =   THREE.MathUtils.randFloat(20, -20);
      zpos4 =   THREE.MathUtils.randFloat(20, -20);
      zpos5 =  THREE.MathUtils.randFloat(20, -20);

 
   
    if(season == "Spring"){
      
      
      updateSpring();
    }
    if(season == "Summer"){
        updateSummer();
    }
    if(season == "Autumn"){
        updateAutumn();
    }
    if(season == "Winter"){

        updateWinter();
    }
   // console.log("clicked") 
  }};
  
  gui.add(obj,'add').name('RandomTreePosition')

  

  var obj2 = { add:function(){ 
    
    xpos = 0;
    xpos2 = 0;
    xpos3 = 0 ;
    xpos4 = 0 ;
    xpos5 = 0 ;
    zpos =  0;
    zpos2 = 0 ;
    zpos3 = 0 ;
    zpos4 = 0 ;
    zpos5 = 0;
                
    if(season == "Spring"){
        updateSpring();
    }
    if(season == "Summer"){

      updateSummer();
    }
    if(season == "Autumn"){

      updateAutumn();
    }
    if(season == "Winter"){
      updateWinter();
    }
  }};

  gui.add(obj2,'add').name("Reset Positions");


  function updateWinter(){
    wintertree.position.z = zpos -15;  



    wintertree2.position.z = zpos2 -10;
    wintertree3.position.z = zpos3 -5;
    wintertree5.position.z = zpos4 ;
    wintertree4.position.z = zpos5 +5;

   wintertree.position.x = xpos -6;
   wintertree.position.y =0;
   wintertree2.position.x = xpos2 -6;
   wintertree2.position.y =0;
   wintertree3.position.x = xpos3-6;
   wintertree3.position.y =0;
   wintertree4.position.x = xpos4-6;
   wintertree4.position.y =0;
   wintertree5.position.x = xpos5-6;
   wintertree5.position.y =0;
   wintertree.castShadow = true;
   wintertree.receiveShadow= true;
   
  }

  function updateSpring(){
    springtree.position.z = zpos -15 ;  



    springtree2.position.z = zpos2 -10;
    springtree3.position.z =  zpos3 -5;
    springtree5.position.z =  zpos4 ;
    springtree4.position.z = zpos5  +5;

   springtree.position.x =  xpos -6;
   springtree.position.y =0;
   springtree2.position.x = xpos2 -6;
   springtree2.position.y =0;
   springtree3.position.x = xpos3-6;
   springtree3.position.y =0;
   springtree4.position.x = xpos4-6;
   springtree4.position.y =0;
   springtree5.position.x = xpos5-6;
   springtree5.position.y =0;
   springtree.castShadow = true;
   springtree.receiveShadow= true;
  }

  function updateSummer(){
    example.position.z = zpos -15;  



    example2.position.z = zpos2 -10;
    example3.position.z = zpos3 -5;
    example5.position.z = zpos4;
    example4.position.z = zpos5 +5;
   
   example.position.x = xpos-6;
   example.position.y =0;
   example2.position.x = xpos2-6;
   example2.position.y =0;
   example3.position.x = xpos3-6;
   example3.position.y =0;
   example4.position.x = xpos4-6;
   example4.position.y =0;
   example5.position.x = xpos5-6;
   example5.position.y =0;
   example.castShadow = true;
   example.receiveShadow= true;
  }

  function updateAutumn(){
    
 autumntree.position.z = zpos -15;  



 autumntree2.position.z = zpos2 -10;
 autumntree3.position.z = zpos3 -5;
 autumntree5.position.z = zpos4 ;
 autumntree4.position.z = zpos5 +5;

autumntree.position.x = xpos-6;
autumntree.position.y =1;
autumntree2.position.x = xpos2-6;
autumntree2.position.y =1;
autumntree3.position.x =xpos3 -6;
autumntree3.position.y =1;
autumntree4.position.x = xpos4-6;
autumntree4.position.y =1;
autumntree5.position.x = xpos5-6;
autumntree5.position.y =1;
autumntree.castShadow = true;
autumntree.receiveShadow= true;

  }
  function sync(entity, renderComponent){
  renderComponent.matrix.copy(entity.worldMatrix);
}
let mixer3;

const param = {
  alignment: 1,
  cohesion: 0.9,
  separation: 0.2
};
const path = new YUKA.Path();

path.add(new YUKA.Vector3(0,0,5));
path.add(new YUKA.Vector3(0,0,15));
path.add(new YUKA.Vector3(0,0,25));

path.add(new YUKA.Vector3(0,0,-5));
path.add(new YUKA.Vector3(0,0,-15));
path.add(new YUKA.Vector3(0,0,-25));

path.loop = true;
const alignmentBehavior = new YUKA.AlignmentBehavior();
			const cohesionBehavior = new YUKA.CohesionBehavior();
			const separationBehavior = new YUKA.SeparationBehavior();

			alignmentBehavior.weight = param.alignment;
			cohesionBehavior.weight = param.cohesion;
			separationBehavior.weight = param.separation;

const fishloader = new GLTFLoader();
fishloader.load('clown_fish.glb',function(glb) {
const model = glb.scene;
const clips = glb.animations;

const fishes = new THREE.AnimationObjectGroup();
 mixer3 = new THREE.AnimationMixer(fishes);
const clip2 =  THREE.AnimationClip.findByName(clips,'Fish_001_animate_preview');
const action = mixer3.clipAction(clip2);
action.play();
for(let i=0;i<30;i++){
  const fishclone = SkeletonUtils.clone(model);

  
  fishclone.matrixAutoUpdate = false;
 
  scene.add(fishclone);
  fishes.add(fishclone);  
  
  const vehicle = new YUKA.Vehicle();
  const followPathBehavior =  new YUKA.FollowPathBehavior(path,0.5);

  vehicle.updateNeighborhood = true;
  vehicle.neighborhoodRadius = 10;
  vehicle.setRenderComponent(fishclone, sync);
  vehicle.steering.add( alignmentBehavior );
  vehicle.steering.add( cohesionBehavior );
  vehicle.steering.add( separationBehavior );
  const wanderBehavior = new YUKA.WanderBehavior();

  vehicle.steering.add(wanderBehavior,0.5);
  vehicle.steering.add(followPathBehavior);
  vehicle.scale.set(0.007,0.007,0.007  );
  vehicle.position.copy(path.current());
  entityManager.add(vehicle);
  
  vehicle.position.x = 2.5 - Math.random()*5;
  vehicle.position.z = 2.5 - Math.random()*5;
  vehicle.rotation.fromEuler(0,2 * Math.random(),0);

}

});



//////////////////////////////////////////////////////////////////////////////////
//		SunLight							//
//////////////////////////////////////////////////////////////////////////////////

THREEx.DayNight.SunLight	= function(){
	var light	= new THREE.DirectionalLight( 0xffffff, 1 );
	this.object3d	= light
	
	this.update	= function(sunAngle){
		light.position.x = 0;
		light.position.y = Math.sin(sunAngle) * 900000;
		light.position.z = Math.cos(sunAngle) * 900000;
//console.log('Phase ', THREEx.DayNight.currentPhase(sunAngle))

		var phase	= THREEx.DayNight.currentPhase(sunAngle)
		if( phase === 'day' ){
			light.color.set("rgb(255,"+ (Math.floor(Math.sin(sunAngle)*200)+55) + "," + (Math.floor(Math.sin(sunAngle)*200)) +")");
		}else if( phase === 'twilight' ){
		        light.intensity = 1;
	        	light.color.set("rgb(" + (255-Math.floor(Math.sin(sunAngle)*510*-1)) + "," + (55-Math.floor(Math.sin(sunAngle)*110*-1)) + ",0)");
		} else {
			light.intensity	= 0;
		}
	}	
}



//////////////////////////////////////////////////////////////////////////////////
//		SunSphere							//
//////////////////////////////////////////////////////////////////////////////////

THREEx.DayNight.SunSphere	= function(){
	var geometry	= new THREE.SphereGeometry( 20, 30, 30 )
	var material	= new THREE.MeshBasicMaterial({
		color		: 0xff0000
	})
	var mesh	= new THREE.Mesh(geometry, material)
	this.object3d	= mesh

	this.update	= function(sunAngle){
		mesh.position.x = 0;
		mesh.position.y = Math.sin(sunAngle) * 400;
		mesh.position.z = Math.cos(sunAngle) * 400;

		var phase	= THREEx.DayNight.currentPhase(sunAngle)
		if( phase === 'day' ){
			mesh.material.color.set("rgb(255,"+ (Math.floor(Math.sin(sunAngle)*200)+55) + "," + (Math.floor(Math.sin(sunAngle)*200)+5) +")");
		}else if( phase === 'twilight' ){
			mesh.material.color.set("rgb(255,55,5)");
		} else {
		}
	}
}


//////////////////////////////////////////////////////////////////////////////////
//		Skydom								//
//////////////////////////////////////////////////////////////////////////////////

THREEx.DayNight.Skydom = function(){
	var geometry	= new THREE.SphereGeometry( 700, 32, 15 );
	var shader	= THREEx.DayNight.Skydom.Shader
	var uniforms	= THREE.UniformsUtils.clone(shader.uniforms)
	var material	= new THREE.ShaderMaterial({
		vertexShader	: shader.vertexShader2,
		fragmentShader	: shader.fragmentShader2,
		uniforms	: uniforms,
		side		: THREE.BackSide
	});

	var mesh	= new THREE.Mesh( geometry, material );
	this.object3d	= mesh
	
	this.update	= function(sunAngle){
		var phase	= THREEx.DayNight.currentPhase(sunAngle)
		if( phase === 'day' ){
			uniforms.topColor.value.set("rgb(0,120,255)");
			uniforms.bottomColor.value.set("rgb(255,"+ (Math.floor(Math.sin(sunAngle)*200)+55) + "," + (Math.floor(Math.sin(sunAngle)*200)) +")");
		} else if( phase === 'twilight' ){
			uniforms.topColor.value.set("rgb(0," + (120-Math.floor(Math.sin(sunAngle)*240*-1)) + "," + (255-Math.floor(Math.sin(sunAngle)*510*-1)) +")");
			uniforms.bottomColor.value.set("rgb(" + (255-Math.floor(Math.sin(sunAngle)*510*-1)) + "," + (55-Math.floor(Math.sin(sunAngle)*110*-1)) + ",0)");
		} else {
			uniforms.topColor.value.set('black')
			uniforms.bottomColor.value.set('black');
		}		
	}
}

THREEx.DayNight.Skydom.Shader	= {
	uniforms	: {
		topColor	: { type: "c", value: new THREE.Color().setHSL( 0.6, 1, 0.75 ) },
		bottomColor	: { type: "c", value: new THREE.Color( 0xffffff ) },
		offset		: { type: "f", value: 400 },
		exponent	: { type: "f", value: 0.6 },
	},
	vertexShader2	: [
		'varying vec3 vWorldPosition;',
		'void main() {',
		'	vec4 worldPosition = modelMatrix * vec4( position, 1.0 );',
		'	vWorldPosition = worldPosition.xyz;',
		'	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
		'}',
	].join('\n'),
	fragmentShader2	: [
		'uniform vec3 topColor;',
		'uniform vec3 bottomColor;',
		'uniform float offset;',
		'uniform float exponent;',

		'varying vec3 vWorldPosition;',

		'void main() {',
		'	float h = normalize( vWorldPosition + offset ).y;',
		'	gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( h, exponent ), 0.0 ) ), 1.0 );',
		'}',
	].join('\n'),
}
var sky;
var onRenderFcts= [];
var cycleDuration = 240;
var sunRotation =-2*Math.PI/6;

onRenderFcts.push(function(delta, now){
  sunRotation += Math.PI / cycleDuration;
})

//////////////////////////////////////////////////////////////////////////////////
//		sunSphere							//
//////////////////////////////////////////////////////////////////////////////////

var sunSphere	= new THREEx.DayNight.SunSphere()
scene.add( sunSphere.object3d )
onRenderFcts.push(function(delta, now){
  sunSphere.update(sunRotation)
})

//////////////////////////////////////////////////////////////////////////////////
//		directionalLight						//
//////////////////////////////////////////////////////////////////////////////////
      

var sunLight	= new THREEx.DayNight.SunLight()
scene.add( sunLight.object3d )
onRenderFcts.push(function(delta, now){
  sunLight.update(sunRotation)
})


var skydom	= new THREEx.DayNight.Skydom()
scene.add( skydom.object3d )
onRenderFcts.push(function(delta, now){
  skydom.update(sunRotation)
})

var starfield	= new THREEx.DayNight.StarField()
scene.add( starfield.object3d )
onRenderFcts.push(function(delta, now){
  starfield.update(sunRotation);
})

var boxVert = `
  	precision highp float;
    varying vec2 vUv; 
    uniform float time;
    uniform float size;
    
  	attribute vec3 instancePosition;
    
  	varying vec3 vPos;
        
    float N (vec2 st) { // https://thebookofshaders.com/10/
        return fract( sin( dot( st.xy, vec2(12.9898,78.233 ) ) ) *  43758.5453123);
    }
    
    float smoothNoise( vec2 ip ){ // https://www.youtube.com/watch?v=zXsWftRdsvU
    	vec2 lv = fract( ip );
      vec2 id = floor( ip );
      
      lv = lv * lv * ( 3. - 2. * lv );
      
      float bl = N( id );
      float br = N( id + vec2( 1, 0 ));
      float b = mix( bl, br, lv.x );
      
      float tl = N( id + vec2( 0, 1 ));
      float tr = N( id + vec2( 1, 1 ));
      float t = mix( tl, tr, lv.x );
      
      return mix( b, t, lv.y );
    }
    
    void main() {
    	vPos = position;
      vec3 iPos = instancePosition * 0.125;
      float y = sin( iPos.x + time ) + sin( iPos.z + time * 0.75 ) * 0.5;
      
      vec2 ip = instancePosition.xz / ( size * 2. + 1. ) * 0.5; // normalizing of instancePosition
      ip.x -= time * 0.1;
      
      float c = smoothNoise( ip * 20. ); // noise for scaling the clouds' cubes
      
      vec3 n = position * step( 0.51, c ) + instancePosition; // scaled by noise
      n.y += y;
      
      vec4 mvPosition = modelViewMatrix * vec4( n, 1.0 );
      gl_Position = projectionMatrix * mvPosition;
    }
  `;


  var boxFrag = `
  	precision highp float;
    varying vec2 vUv;
  	varying vec3 vPos;
    
    float edge ( vec2 uv, float size ) {
    	float d = max( uv.x, uv.y );
      return smoothstep( size, size - 0.0125, d );
    }
    
    void main() {
		
      float edgeWidth = 0.05;
      float size = 0.5 - edgeWidth; // 0.5 is a half of the length of an edge
      vec3 pos = abs( vPos );
      
      // make edges brighter
      float e = edge( pos.xy, size );
      e += edge( pos.xz, size );
      e += edge( pos.yz, size );

      vec3 c = mix( vec3( 1.0 ), vec3( 0.95 ), e);
      
      if ( vPos.y < -0.45 ) c *= vec3(0.85); // fake shading of clouds' bottom side
      
    	vec3 baseColor = vec3( 0.96, 0.96, 0.96 ) ;
      float clarity = ( vUv.y * 0.5 ) + 0.5;
       gl_FragColor = vec4( baseColor * clarity, 1 );

    }
  `;


  Object.assign(THREE.PlaneBufferGeometry.prototype, {
    toGrid: function() {
      let segmentsX = this.parameters.widthSegments || 1;
      let segmentsY = this.parameters.heightSegments || 1;
      let indices = [];
      for (let i = 0; i < segmentsY + 1; i++) {
        let index11 = 0;
        let index12 = 0;
        for (let j = 0; j < segmentsX; j++) {
          index11 = (segmentsX + 1) * i + j;
          index12 = index11 + 1;
          let index21 = index11;
          let index22 = index11 + (segmentsX + 1);
          indices.push(index11, index12);
          if (index22 < ((segmentsX + 1) * (segmentsY + 1) - 1)) {
            indices.push(index21, index22);
          }
        }
        if ((index12 + segmentsX + 1) <= ((segmentsX + 1) * (segmentsY + 1) - 1)) {
          indices.push(index12, index12 + segmentsX + 1);
        }
      }
      this.setIndex(indices);
      return this;
    }
  });


  function createBoxWithRoundedEdges(width, height, depth, radius0, smoothness) {
    let shape = new THREE.Shape();
    let eps = 0.00001;
    let radius = radius0 - eps;
    shape.absarc(eps, eps, eps, -Math.PI / 2, -Math.PI, true);
    shape.absarc(eps, height - radius * 2, eps, Math.PI, Math.PI / 2, true);
    shape.absarc(width - radius * 2, height - radius * 2, eps, Math.PI / 2, 0, true);
    shape.absarc(width - radius * 2, eps, eps, 0, -Math.PI / 2, true);
    let geometry = new THREE.ExtrudeBufferGeometry(shape, {
      depth: depth - radius0 * 2,
      bevelEnabled: true,
      bevelSegments: smoothness * 2,
      steps: 1,
      bevelSize: radius,
      bevelThickness: radius0,
      curveSegments: smoothness
    });

    geometry.center();

    return geometry;
  };


  var geom = createBoxWithRoundedEdges(1, 1, 1, 0.05, 1);
  
  var size = 50;
  
  var positions2 = [];
  for (let i = -size; i <= size; i++) {
    for (let j = -size; j <= size; j++) {
      positions2.push(j, 5, i);
    }
  }
  
  var instancedGeometry = new THREE.InstancedBufferGeometry();
  instancedGeometry.attributes.position = geom.attributes.position;
  instancedGeometry.setAttribute('instancePosition', new THREE.InstancedBufferAttribute(new Float32Array(positions2), 3));
  
  
  var mat = new THREE.ShaderMaterial({
    uniforms: {
      time: {
        value: 0
      },
      size: {
        value: size
      }
    },
    vertexShader: boxVert,
    fragmentShader: boxFrag
  });
  
  var instancedMeshs = new THREE.Mesh(instancedGeometry, mat);
 // scene.add(instancedMeshs);
  instancedMeshs.position.y = 60;
  var local = new THREE.Vector3(instancedMeshs.position);

//////////////////////////////////////////////////////////////////////////////////
//		loop runner							//
//////////////////////////////////////////////////////////////////////////////////
  let rainGeo, rainDrop = [],vel = [] ,rainCount=15000  ,rain;
rainGeo = new THREE.BufferGeometry();
//const maxrange2 = 150;
//const minrange2 = maxrange/2;
//const minheight2 =50;
for(let i=0;i<rainCount;i++) {

    rainDrop.push(
      Math.floor(Math.random()*maxrange-minrange),
      Math.floor(Math.random()*maxrange+minheight),
      Math.floor(Math.random()*maxrange-minrange));
      
    vel.push(
      Math.floor(Math.random()*6-3) *0.1,
      Math.floor(Math.random()*5 + 0.12) *0.18,
      Math.floor(Math.random()*6-3) *0.1);
     
   }
  rainGeo.setAttribute('position',new THREE.Float32BufferAttribute(rainDrop, 3));
  rainGeo.setAttribute('velocity',new THREE.Float32BufferAttribute(vel, 3))

var rainMaterial = new THREE.PointsMaterial({
  color: 0xaaaaaa,
  size: 0.1,
  transparent: true
});
rain = new THREE.Points(rainGeo,rainMaterial);


function updaterain(){
 
  for(let i=0; i<rainCount*3;i+=3){
   //rainGeo.attributes.position.array[i] -= rainGeo.attributes.velocity.array[i];
    rainGeo.attributes.position.array[i+1] -= rainGeo.attributes.velocity.array[i+1]*10;
   // rainGeo.attributes.position.array[i+2] -= rainGeo.attributes.velocity.array[i+2];

    
    
    if(rainGeo.attributes.position.array[i+1]<-1){
     rainGeo.attributes.position.array[i] = Math.floor(Math.random()*maxrange-minrange);
     rainGeo.attributes.position.array[i+1] = Math.floor(Math.random()*maxrange+minheight);
      rainGeo.attributes.position.array[i+2] = Math.floor(Math.random()*maxrange-minrange);
    }
    
  }
  
  rainGeo.attributes.position.needsUpdate = true;
  }


function animate(){
  leavesMaterial.uniforms.time.value = clock.getElapsedTime();
leavesMaterial.uniformsNeedUpdate = true;
updateParticles();
updaterain();
//console.log(local);
const delta2 = time.update().getDelta();
 
mat.uniforms.time.value = clock.getElapsedTime();
entityManager.update(delta2); 
if(controls.enablePan == true){
  controls.update();
}
if(PointerLockControls.enabled == true){
  processkeyboard();
  controls2.addEventListener( 'unlock', function () {
    params6.switch = false; 
    params7.switch=true;
    PointerLockControls.enabled = false;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.enableRotate = true;
    controls2.unlock();
  
  } );
   
}

requestAnimationFrame(animate);
  renderer.render(scene, camera);
//console.log("Scene polycount:", renderer.info.render.triangles);
//console.log("Active Drawcalls:", renderer.info.render.calls);
//onsole.log("Textures in Memory", renderer.info.memory.textures);
//console.log("Geometries in Memory", renderer.info.memory.geometries);        

}

var lastTimeMsec= null


requestAnimationFrame(function animate(nowMsec){
  // keep looping
  requestAnimationFrame( animate );
  // measure time
  const delta = clock.getDelta();

  
  if ( mixer ){ mixer.update( delta ); 
mixer2.update( delta ); 
 mixer4.update( delta ); 
  mixer5.update( delta ); 
mixer6.update( delta ); 
    

  };
  if ( mixer3 ) mixer3.update( delta ); 
  lastTimeMsec	= lastTimeMsec || nowMsec-1000/60;
  var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec);
  lastTimeMsec	= nowMsec;
  
  // call each update function
  onRenderFcts.forEach(function(onRenderFct){
    onRenderFct(deltaMsec/1000, nowMsec/1000)
  })
})

animate();