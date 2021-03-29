let Compass = function(cameraEl, container){

    let compassWrapperEl = document.createElement('a-entity');
    compassWrapperEl.setAttribute('id','compassWrapper');

    const rad = 1.571;
    compassWrapperEl.setAttribute('position','-4.2 -2.2 -6');

    let coordinateRotation = {x:0,y:0,z:0};
    let cameraRotation = {x:0,y:0,z:0};

    let cameraLookatEl = document.createElement('a-entity');
    cameraLookatEl.setAttribute('id','cameraLookat');

    cameraLookatEl.setAttribute('geometry','primitive: plane; height: 2; width: 2');
    cameraLookatEl.setAttribute('material','side: double;src:image/arrow.png; transparent:true; depthTest:0.8');
    cameraLookatEl.setAttribute('rotation','-90 0 0');

    compassWrapperEl.appendChild(cameraLookatEl);

    // coordinate system element
    let coordinateSystemEl = document.createElement('a-entity');
    coordinateSystemEl.setAttribute('id','compass');
    coordinateSystemEl.setAttribute('position','0 0 0');
    coordinateSystemEl.setAttribute('rotation','0 0 0');

    // xAxis
    let xAxisEl = document.createElement('a-entity');
    xAxisEl.setAttribute('meshline','path: 0.7 0 0,  -0.7 0 0; color: #943126; lineWidth: 7');
    // positive X
    let posXEl= document.createElement("a-entity");
    posXEl.setAttribute( 'points', { positions: [0,0,0] , hasColor : false ,  size:  0.5, textureSrc:'image/posX.png', sizeAttenuation: true, color: '#943126'} );
    posXEl.setAttribute('position','0.85 0 0');
    // negative x
    let negXEl= document.createElement("a-entity");
    negXEl.setAttribute( 'points', { positions: [0,0,0] , hasColor : false ,  size: 0.5, textureSrc:'image/negX.png', sizeAttenuation: true, color: '#943126'} );
    negXEl.setAttribute('position','-0.85 0 0');
    xAxisEl.appendChild(posXEl);
    xAxisEl.appendChild(negXEl);

    // yAxis
    let yAxisEl = document.createElement('a-entity');
    yAxisEl.setAttribute('meshline','path: 0 0.7 0, 0 -0.7 0; color: #0E6655; lineWidth: 7');
    // positive y
    let posYEl= document.createElement("a-entity");
    posYEl.setAttribute( 'points', { positions: [0,0,0] , hasColor : false ,  size: 0.5, textureSrc:'image/posY.png', sizeAttenuation: true,  color: '#0E6655'} );
    posYEl.setAttribute('position','0 0.85 0');
    // negative y
    let negYEl= document.createElement("a-entity");
    negYEl.setAttribute( 'points', { positions: [0,0,0] , hasColor : false ,  size: 0.5, textureSrc:'image/negY.png', sizeAttenuation: true,  color: '#0E6655'} );
    negYEl.setAttribute('position','0 -0.85 0');
    yAxisEl.appendChild(posYEl);
    yAxisEl.appendChild(negYEl);

    // zAxis
    let zAxisEl = document.createElement('a-entity');
    zAxisEl.setAttribute('meshline','path: 0 0 0.7, 0 0 -0.7; color: #21618C; lineWidth: 7');
    // positive z
    let posZEl= document.createElement("a-entity");
    posZEl.setAttribute( 'points', { positions: [0,0,0] , hasColor : false , size: 0.5, textureSrc:'image/posZ.png', sizeAttenuation: true, color: '#21618C'} );
    posZEl.setAttribute('position','0 0 0.85');
    // negative z
    let negZEl= document.createElement("a-entity");
    negZEl.setAttribute( 'points', { positions: [0,0,0] , hasColor : false , size: 0.5, textureSrc:'image/negZ.png', sizeAttenuation: true, color: '#21618C'} );
    negZEl.setAttribute('position','0 0 -0.85');
    zAxisEl.appendChild(posZEl);
    zAxisEl.appendChild(negZEl);

    coordinateSystemEl.appendChild(xAxisEl);
    coordinateSystemEl.appendChild(yAxisEl);
    coordinateSystemEl.appendChild(zAxisEl);

    let locLabel = document.createElement("a-entity");
    locLabel.setAttribute( 'text', "value: Your Position: [ X: 00, Y: 00, Z: 00 ] ; color: #1B2631");
    locLabel.setAttribute('position','1 -0.8 0.85');
    locLabel.setAttribute('scale','3 3 3');

    compassWrapperEl.appendChild(coordinateSystemEl);
    compassWrapperEl.appendChild(locLabel);

    cameraEl.appendChild(compassWrapperEl);
    cameraEl.setAttribute('camerael');

    AFRAME.registerComponent('camerael', {
        tick: function () {
            let degRotation = cameraEl.getAttribute('rotation');
            cameraRotation = { x: THREE.Math.degToRad(degRotation.x), y: THREE.Math.degToRad(degRotation.y), z: THREE.Math.degToRad(degRotation.z) };
            cameraLookatEl.object3D.rotation.set( cameraRotation.x-rad, 0, 0 );
            coordinateSystemEl.object3D.rotation.set( coordinateRotation.x, coordinateRotation.y-cameraRotation.y, coordinateRotation.z-cameraRotation.z  );

            let position = cameraEl.getAttribute('position');

            let x = Math.round(position.x);
            let y = Math.round(position.y);
            let z = Math.round(position.z);

            locLabel.setAttribute( 'text', "value: Your Position: [ X: "+x+' Y: '+y+' Z: '+z+" ] ; color: #1B2631");

            // console.log(cameraEl.getAttribute('rotation'));

        }
    });

    container.setAttribute('container');
    AFRAME.registerComponent('container', {
        tick: function () {
            let newRotation = container.getAttribute('rotation');
            coordinateRotation = {
                x:THREE.Math.degToRad(newRotation.x),
                y:THREE.Math.degToRad(newRotation.y),
                z:THREE.Math.degToRad(newRotation.z)
            }
            coordinateSystemEl.object3D.rotation.set( coordinateRotation.x, coordinateRotation.y-cameraRotation.y, coordinateRotation.z-cameraRotation.z  );
        }
    });

    compassWrapperEl.setAttribute( 'scale', '0.85 0.85 0.85' );
    compassWrapperEl.setAttribute( 'visible', 'true' );
}
