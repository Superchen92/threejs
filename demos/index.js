import * as THREE from 'three'
import { TTFLoader } from 'three/addons/loaders/TTFLoader.js';
import { Font } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import {GUI} from 'three/addons/libs/lil-gui.module.min.js';

export function demo1(){
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer()
    
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)
    
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({color: 0x00ff00})
    const cube = new THREE.Mesh(geometry, material)
    
    scene.add(cube)
    
    camera.position.z = 5
    
    function animate() {
        requestAnimationFrame(animate)
        cube.rotation.x += 0.01
        cube.rotation.y += 0.01
        renderer.render(scene, camera)
    }
    
    animate()
}

export function demo2(){
    const scene = new THREE.Scene()
    const renderer = new THREE.WebGLRenderer()

    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500)
    camera.position.set(0, 0, 100)
    camera.lookAt(0, 0, 0)

    const material = new THREE.LineBasicMaterial({color: 0x000ff})
    const points = []
    points.push(new THREE.Vector3(-10, 0, 0))
    points.push(new THREE.Vector3(0, 10, 0))
    points.push(new THREE.Vector3(10, 0, 0))

    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const line = new THREE.Line(geometry, material)

    scene.add(line)
    renderer.render(scene, camera)
}

export function demo3(){
    const canvas = document.querySelector('#helloworld')
    const renderer = new THREE.WebGLRenderer({antialias: true, canvas})
    const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 5)
    camera.position.z = 2
    const scene = new THREE.Scene()
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshPhongMaterial({color: 0x44aa88})
    const cube = new THREE.Mesh(geometry, material)
    scene.add(cube)
    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(-1, 2, 4)
    scene.add(light)

    function makeInstance(geometry, color, x){
        const meterial = new THREE.MeshPhongMaterial({color})
        const cube = new THREE.Mesh(geometry, meterial)
        scene.add(cube)
        cube.position.x = x
        return cube
    }

    const cubes = [
        makeInstance(geometry, 0x44aa88,  0),
        makeInstance(geometry, 0x8844aa, -2),
        makeInstance(geometry, 0xaa8844,  2),
    ];

    function render(time){
        time *= 0.001
        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement
            camera.aspect = canvas.clientWidth / canvas.clientHeight
            camera.updateProjectionMatrix()
        }
        cube.rotation.x = time
        cube.rotation.y = time
        cubes.forEach((cube, index) => {
            const speed = 1 + index * .1
            const rot = time * speed
            cube.rotation.x = rot
            cube.rotation.y = rot
        })
        renderer.render(scene, camera)
        requestAnimationFrame(render)
    }
    requestAnimationFrame(render)
}

export function demo4(){
    const gui = new GUI();
    //定义一个旋转对象集
    const objects = []

    //定义一个空间
    const solarSystem = new THREE.Object3D()
    objects.push(solarSystem)

    //定义场景
    const scene = new THREE.Scene()
    scene.add(solarSystem)

    //定义一个渲染器
    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

    //定义一个相机
    const camera = new THREE.PerspectiveCamera(45, 2, 0.1, 1000)
    camera.position.set(0, 50, 0);
    camera.up.set(0, 0, 1);
    camera.lookAt(0, 0, 0);

    //定义一个球
    const radius = 1
    const widthSegments = 6
    const heightSegments = 6
    const spherGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments)

    //定义太阳
    const sunMaterial = new THREE.MeshPhongMaterial({emissive: 0xFFFF00})
    const sunMesh = new THREE.Mesh(spherGeometry, sunMaterial)
    sunMesh.scale.set(5, 5, 5)
    objects.push(sunMesh)
    solarSystem.add(sunMesh)
    
    //定义光束
    {
        const color = 0xFFFFFF;
        const intensity = 3;
        const light = new THREE.PointLight(color, intensity);
        scene.add(light);
    }
    
    //定义一个地球旋转系
    const earthSystem = new THREE.Object3D()
    earthSystem.position.x = 10
    solarSystem.add(earthSystem)
    objects.push(earthSystem)
    
    //定义一个地球
    const earthMaterial = new THREE.MeshPhongMaterial({color: 0x2233ff, emissive: 0x112244})
    const earthMesh = new THREE.Mesh(spherGeometry, earthMaterial)
    earthSystem.add(earthMesh)
    objects.push(earthMesh)
    
    //定义一个月球
    const moonOrbit = new THREE.Object3D();
    moonOrbit.position.x = 2;
    earthSystem.add(moonOrbit);
    
    const moonMaterial = new THREE.MeshPhongMaterial({color: 0x888888, emissive: 0x222222});
    const moonMesh = new THREE.Mesh(spherGeometry, moonMaterial);
    moonMesh.scale.set(.5, .5, .5);
    moonOrbit.add(moonMesh);
    objects.push(moonMesh);

    class AxisGridHelper {
        constructor(node, units = 10) {
          const axes = new THREE.AxesHelper();
          axes.material.depthTest = false;
          axes.renderOrder = 2;  // after the grid
          node.add(axes);
    
          const grid = new THREE.GridHelper(units, units);
          grid.material.depthTest = false;
          grid.renderOrder = 1;
          node.add(grid);
    
          this.grid = grid;
          this.axes = axes;
          this.visible = false;
        }
        get visible() {
          return this._visible;
        }
        set visible(v) {
          this._visible = v;
          this.grid.visible = v;
          this.axes.visible = v;
        }
    }

    function makeAxisGrid(node, label, units) {
        const helper = new AxisGridHelper(node, units);
        gui.add(helper, 'visible').name(label);
    }
    
    makeAxisGrid(solarSystem, 'solarSystem', 25);
    makeAxisGrid(sunMesh, 'sunMesh');
    makeAxisGrid(earthSystem, 'earthOrbit');
    makeAxisGrid(earthMesh, 'earthMesh');
    makeAxisGrid(moonOrbit, 'moonOrbit');
    makeAxisGrid(moonMesh, 'moonMesh');

    function render(time) {
        time *= 0.001;

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        objects.forEach((obj) => {
            obj.rotation.y = time;
        });

        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  } 
