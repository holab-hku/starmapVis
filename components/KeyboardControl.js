let KeyboardControl = function(container){
    this.ROTATESPEED = 2;
    this.container = container;
};

KeyboardControl.prototype = {
    init: function () {
        let onkeydown = function onkeydown ( e ) {
           e.preventDefault( );
            e = e ||window.event; // to deal with IE
            var map = {};
            map[e.keyCode] = e.type === 'keydown';
            /*
            ROTATE
            */
            // ROTATE LEFT
            if(map[65]){
                e.stopImmediatePropagation();
                let rotate = container.getAttribute('rotation');
                const originStr = rotate.x + ' ' + rotate.y + ' ' + rotate.z;
                rotate.y -= this.ROTATESPEED;
                // container.setAttribute('rotation', rotate.x+' '+rotate.y+ ' '+rotate.z);
                container.setAttribute('animation', "property: rotation; from: "+originStr+"; to: "+ rotate.x+' '+rotate.y+ ' '+rotate.z +"; dur: 150; easing: linear");
                map = {};
            }
            // ROTATE RIGHT
            else if(map[68]){
                e.stopImmediatePropagation();
                let rotate = container.getAttribute('rotation');
                const originStr = rotate.x + ' ' + rotate.y + ' ' + rotate.z;
                rotate.y += this.ROTATESPEED;
                // container.setAttribute('rotation', rotate.x+' '+rotate.y+ ' '+rotate.z);
                container.setAttribute('animation', "property: rotation; from: "+originStr+"; to: "+ rotate.x+' '+rotate.y+ ' '+rotate.z +"; dur: 150; easing: linear");
                map = {};
            }
            // ROTATE UP
            else if(map[87]){
                e.stopImmediatePropagation();
                let rotate = container.getAttribute('rotation');
                const originStr = rotate.x + ' ' + rotate.y + ' ' + rotate.z;
                rotate.x -= this.ROTATESPEED;
                // container.setAttribute('rotation', rotate.x+' '+rotate.y+ ' '+rotate.z);
                container.setAttribute('animation', "property: rotation; from: "+originStr+"; to: "+ rotate.x+' '+rotate.y+ ' '+rotate.z +"; dur: 150; easing: linear");
                map = {};
            }
            // ROTATE DOWN
            else if(map[83]){
                e.stopImmediatePropagation();
                let rotate = container.getAttribute('rotation');
                const originStr = rotate.x + ' ' + rotate.y + ' ' + rotate.z;
                rotate.x += this.ROTATESPEED;
                // container.setAttribute('rotation', rotate.x+' '+rotate.y+ ' '+rotate.z)
                container.setAttribute('animation', "property: rotation; from: "+originStr+"; to: "+ rotate.x+' '+rotate.y+ ' '+rotate.z +"; dur: 150; easing: linear");
                map = {};
            }

            // Test for Rotation only: X
            else if(map[88]) {
                // let camera = document.getElementById('theCamera');

                let originalBox = document.createElement('a-box');
                originalBox.setAttribute('id', 'target');
                originalBox.setAttribute('visible', 'false');
                document.getElementById('scene').appendChild(originalBox);
                this.lookGreenBox();

                console.log(globalData);

            }
        }
        this.onkeydownHandler = onkeydown.bind(this);
    },
    enableKeyboardControl : function (bool) {
        if( bool ) {  document.addEventListener( 'keydown', this.onkeydownHandler, false);
            console.log('keyboardEnabled');
        }
        else{  document.removeEventListener( 'keydown', this.onkeydownHandler, false);
            console.log('keyboardDisabled');
        }
    },

    getVector : function (camera,targetObject) {
        var entityPosition = new THREE.Vector3();
        targetObject.object3D.getWorldPosition(entityPosition);

        var cameraPosition = new THREE.Vector3();
        camera.object3D.getWorldPosition(cameraPosition);

        //Based on:  https://github.com/supermedium/superframe/blob/master/components/look-at/index.js
        var vector = new THREE.Vector3(entityPosition.x, entityPosition.y, entityPosition.z);
        vector.subVectors(cameraPosition, vector).add(cameraPosition);
        return vector;
    },

    centerCamera : function (originStr,camera,vector) {
        //Based on: https://codepen.io/wosevision/pen/JWRMyK
        camera.object3D.lookAt(vector);
        camera.object3D.updateMatrix();

        //Based on: https://stackoverflow.com/questions/36809207/aframe-threejs-camera-manual-rotation
        var rotation = camera.getAttribute('rotation');
        camera.setAttribute('animation', "property: rotation; from: "+originStr+"; to: "+ rotation.x +' '+ rotation.y + ' '+ 0 +"; dur: 500; easing: easeInOutSine");
        // console.log(rotation);
        camera.components['look-controls'].pitchObject.rotation.x = THREE.Math.degToRad(rotation.x);
        camera.components['look-controls'].yawObject.rotation.y = THREE.Math.degToRad(rotation.y);
    },

    lookGreenBox : function () {
        var cameraEl = document.getElementById('theCamera');
        let originalRotation = cameraEl.getAttribute('rotation');
        const originStr = originalRotation.x + ' ' + originalRotation.y + ' ' + originalRotation.z;
        cameraEl.setAttribute("look-controls", {enabled: false});
        let pointTarget = this.getVector(cameraEl, document.getElementById('target'));
        this.centerCamera(originStr, cameraEl, pointTarget);
        cameraEl.setAttribute("look-controls", {enabled: true});
    }
}

