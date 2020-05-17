$(document).ready(function() {
            
    console.log('работает');
    //--------------Создаем в дереве DOM элемен для вывода на экран-------
    container = $('div.tree_graf');
    
    if ( WEBGL.isWebGLAvailable() === false ) {
            document.body.appendChild( WEBGL.getWebGLErrorMessage() );
    }
    THREE.Cache.enabled = true;
        
        function createText(text) {
            var materials = [
                            new THREE.MeshPhongMaterial( { color: 0x0000ff, flatShading: true } ), // front
                            new THREE.MeshPhongMaterial( { color: 0x0000ff } ) // side
                        ];                    
        
            var textGeo = new THREE.TextGeometry( text, {
                    font: font,
                    size: size,
                    height: height_font,
                    curveSegments: curveSegments,
                    bevelThickness: bevelThickness,
                    bevelSize: bevelSize,
                    bevelEnabled: bevelEnabled
            } );
            textGeo.computeBoundingBox();
            textGeo.computeVertexNormals();
            // "fix" side normals by removing z-component of normals for side faces
            // (this doesn't work well for beveled geometry as then we lose nice curvature around z-axis)
            if ( ! bevelEnabled ) {
                    var triangleAreaHeuristics = 0.1 * ( height_font * size );
                    for ( var i = 0; i < textGeo.faces.length; i ++ ) {
                            var face = textGeo.faces[ i ];
                            if ( face.materialIndex == 1 ) {
                                    for ( var j = 0; j < face.vertexNormals.length; j ++ ) {
                                            face.vertexNormals[ j ].z = 0;
                                            face.vertexNormals[ j ].normalize();
                                    }
                                    var va = textGeo.vertices[ face.a ];
                                    var vb = textGeo.vertices[ face.b ];
                                    var vc = textGeo.vertices[ face.c ];
                                    var s = THREE.GeometryUtils.triangleArea( va, vb, vc );
                                    if ( s > triangleAreaHeuristics ) {
                                            for ( var j = 0; j < face.vertexNormals.length; j ++ ) {
                                                    face.vertexNormals[ j ].copy( face.normal );
                                            }
                                    }
                            }
                    }
            }
            var centerOffset = - 0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
            textGeo = new THREE.BufferGeometry().fromGeometry( textGeo );
            var textMesh1 = new THREE.Mesh( textGeo, materials );
            textMesh1.position.x = centerOffset;
            textMesh1.position.y = hover;
            textMesh1.position.z = 0;
            textMesh1.rotation.x = 0;
            textMesh1.rotation.y = Math.PI * 2;
            return textMesh1;
            //group.add( textMesh1 );
            /*if ( mirror ) {
                    textMesh2 = new THREE.Mesh( textGeo, materials );
                    textMesh2.position.x = centerOffset;
                    textMesh2.position.y = - hover;
                    textMesh2.position.z = height;
                    textMesh2.rotation.x = Math.PI;
                    textMesh2.rotation.y = Math.PI * 2;
                    group.add( textMesh2 );
            }*/
    }
       
    
    function loadFont() {
            var loader = new THREE.FontLoader();
            loader.load( '/fonts/' + fontName + '_' + fontWeight + '.typeface.json', function ( response ) {
                    font = response;
                    //updatePermalink();                    
            } );
    }
	
        var width=window.innerWidth/1.5,
            height=window.innerHeight/1.5,
            //textGeo,
            //text = "three.js",
            size = 5,
            hover = 10,
            curveSegments = 4,
            bevelThickness = 1,
            bevelSize = 0,
            bevelEnabled = false,
            font = undefined,
            fontName = "Times_New_Roman", // helvetiker, optimer, gentilis, droid sans, droid serif
            fontWeight = "regular",
            /*textMesh1,materials,*/x_group,y_group
            height_font=1; 
            
       var fontMap = {
                "helvetiker": 0,
                "optimer": 1,
                "gentilis": 2,
                "droid/droid_sans": 3,
                "droid/droid_serif": 4
        };
        var weightMap = {
                "regular": 0,
                "bold": 1
        };
        var reverseFontMap = [];
        var reverseWeightMap = [];
        for ( var i in fontMap ) reverseFontMap[ fontMap[ i ] ] = i;
        for ( var i in weightMap ) reverseWeightMap[ weightMap[ i ] ] = i;
            
        var scene = new THREE.Scene();
        scene.background = new THREE.Color(0xe0f9f9); 
	var camera = new THREE.PerspectiveCamera(45 
		, width / height , 0.1, 1000);
	var renderer = new THREE.WebGLRenderer();
	//renderer.setClearColorHex(0xEEEEEE);
	renderer.setSize(width, height);
        
        var dirLight = new THREE.DirectionalLight( 0xffffff, 0.125 );
        dirLight.position.set( 0, 0, 1 ).normalize();
        scene.add( dirLight );
        
        var pointLight = new THREE.PointLight( 0xffffff, 1.5 );
        pointLight.position.set( 0, 100, 90 );
        scene.add( pointLight );
        
	var axes = new THREE.AxisHelper( 100 );
	scene.add(axes);
	/*var planeGeometry = new THREE.PlaneGeometry(200,200,1,1);
	var planeMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
	var plane = new THREE.Mesh(planeGeometry,planeMaterial);
	plane.rotation.x=-0.5*Math.PI;
	plane.position.x = 0;
	plane.position.y = 0;
	plane.position.z = 0;
	scene.add(plane);
	var cubeGeometry = new THREE.CubeGeometry(4,4,4);
	var cubeMaterial = new THREE.MeshBasicMaterial(
		{color: 0xff0000, wireframe: true});
	var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
	cube.position.x = 0;
	cube.position.y = 3;
	cube.position.z = 0;
	scene.add(cube);
	var sphereGeometry = new THREE.SphereGeometry(4,20,20);
	var sphereMaterial = new THREE.MeshBasicMaterial(
		{color: 0x7777ff, wireframe: true});
	var sphere = new THREE.Mesh(sphereGeometry,sphereMaterial);
	sphere.position.x = 20;
	sphere.position.y = 4;
	sphere.position.z = 2;
	scene.add(sphere);*/
        
        var material_x = new THREE.LineBasicMaterial({ color: 0x0000ff,linewidth: 5 });
        var geometry_x = new THREE.Geometry();
        geometry_x.vertices.push(new THREE.Vector3(-80, 0, -80));//xyz
        geometry_x.vertices.push(new THREE.Vector3(-80, 0,80));
        var os_x = new THREE.Line(geometry_x, material_x);
        scene.add(os_x);
        
        var geometry_xk = new THREE.CylinderGeometry( 0, 1, 5, 32 ); // Геометрия (радиус вверху, радиус внизу, длина, число сегментов
        var material_xk = new THREE.MeshBasicMaterial( {color: 0x0000ff} ); // Материал
        var x_konus = new THREE.Mesh( geometry_xk, material_xk ); // Массив
        x_konus.rotation.x=0.5*Math.PI;
        x_konus.position.x = -80;		
        x_konus.position.y = 0;
        x_konus.position.z = 80;
        scene.add(x_konus);
                
        loadFont();
        
        var x_text='Показатели';
        var MyIntervalID_X = setInterval(function(){
            console.log('задержка');
            if (!!font) {
                clearInterval (MyIntervalID_X);
                x_group = new THREE.Group();                
                if (x_text ) {
                    var x_mesh=createText(x_text);
                    x_group.add(x_mesh);
                }            
                x_group.rotation.y=-0.5*Math.PI;
                x_group.position.x = -80;
                x_group.position.y = -17;
                x_group.position.z = 95;
                scene.add(x_group);
            }
        },500);
                                
        var material_y = new THREE.LineBasicMaterial({ color: 0x0000ff,linewidth: 5 });
        var geometry_y = new THREE.Geometry();
        geometry_y.vertices.push(new THREE.Vector3(-80, 0, -80));//xyz
        geometry_y.vertices.push(new THREE.Vector3(80, 0,-80));
        var os_y = new THREE.Line(geometry_y, material_y);
        scene.add(os_y);
        
        var geometry_yk = new THREE.CylinderGeometry( 0, 1, 5, 32 ); // Геометрия (радиус вверху, радиус внизу, длина, число сегментов
        var material_yk = new THREE.MeshBasicMaterial( {color: 0x0000ff} ); // Материал
        var y_konus = new THREE.Mesh( geometry_yk, material_yk ); // Массив
        y_konus.rotation.y=0.5*Math.PI;
        y_konus.position.x = -80;		
        y_konus.position.y = 80;
        y_konus.position.z = -80;
        scene.add(y_konus);
        
        var y_text='Строки';
        var MyIntervalID_Y = setInterval(function(){
            //console.log('задержка');
            if (!!font) {
                clearInterval (MyIntervalID_Y);
                y_group = new THREE.Group();                
                if (y_text ) {
                    var y_mesh=createText(y_text);
                    y_group.add(y_mesh);
                }            
                y_group.rotation.z=0.5*Math.PI;
                y_group.rotation.y=-0.5*Math.PI;
                y_group.position.x = -80;
                y_group.position.y = 80;
                y_group.position.z = -75;
                scene.add(y_group);
            }
        },500); 
        
        var material_z = new THREE.LineBasicMaterial({ color: 0x0000ff,linewidth: 5 });
        var geometry_z = new THREE.Geometry();
        geometry_z.vertices.push(new THREE.Vector3(-80, 0, -80));//xyz
        geometry_z.vertices.push(new THREE.Vector3(-80, 80,-80));
        var os_z = new THREE.Line(geometry_z, material_z);
        scene.add(os_z);
        
        var geometry_zk = new THREE.CylinderGeometry( 0, 1, 5, 32 ); // Геометрия (радиус вверху, радиус внизу, длина, число сегментов
        var material_zk = new THREE.MeshBasicMaterial( {color: 0x0000ff} ); // Материал
        var z_konus = new THREE.Mesh( geometry_zk, material_zk ); // Массив
        z_konus.rotation.z=-0.5*Math.PI;
        z_konus.position.x = 80;		
        z_konus.position.y = 0;
        z_konus.position.z = -80;
        scene.add(z_konus); 
        
        var z_text='Значения';
        var MyIntervalID_Z = setInterval(function(){
            //console.log('задержка');
            if (!!font) {
                clearInterval (MyIntervalID_Z);
                var z_group = new THREE.Group();                
                if (z_text ) {
                    var z_mesh=createText(z_text);
                    z_group.add(z_mesh);
                }            
                z_group.rotation.y=-0.5*Math.PI;
                z_group.position.x = 80;
                z_group.position.y = -17;
                z_group.position.z = -70;
                scene.add(z_group);
            }
        },500); 
        
	camera.position.x = -250;
	camera.position.y = 100;
	camera.position.z = 60;
        
        var controls = new THREE.OrbitControls(camera);        
        controls.update();
        
        function animate() {

                requestAnimationFrame( animate );

                // required if controls.enableDamping or controls.autoRotate are set to true
                controls.update();

                renderer.render( scene, camera );

        }
                
        
	//camera.lookAt(scene.position);
        $(container).append(renderer.domElement);//Добавляем рендер в DOM для вывода на экран
	renderer.render(scene, camera);
        animate();       
});