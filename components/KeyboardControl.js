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
            if(map[37]){
                e.stopImmediatePropagation();
                let rotate = container.getAttribute('rotation');
                const originStr = rotate.x + ' ' + rotate.y + ' ' + rotate.z;
                rotate.y -= this.ROTATESPEED;
                // container.setAttribute('rotation', rotate.x+' '+rotate.y+ ' '+rotate.z);
                container.setAttribute('animation', "property: rotation; from: "+originStr+"; to: "+ rotate.x+' '+rotate.y+ ' '+rotate.z +"; dur: 150; easing: linear");
                map = {};
            }
            // ROTATE RIGHT
            else if(map[39]){
                e.stopImmediatePropagation();
                let rotate = container.getAttribute('rotation');
                const originStr = rotate.x + ' ' + rotate.y + ' ' + rotate.z;
                rotate.y += this.ROTATESPEED;
                // container.setAttribute('rotation', rotate.x+' '+rotate.y+ ' '+rotate.z);
                container.setAttribute('animation', "property: rotation; from: "+originStr+"; to: "+ rotate.x+' '+rotate.y+ ' '+rotate.z +"; dur: 150; easing: linear");
                map = {};
            }
            // ROTATE UP
            else if(map[38]){
                e.stopImmediatePropagation();
                let rotate = container.getAttribute('rotation');
                const originStr = rotate.x + ' ' + rotate.y + ' ' + rotate.z;
                rotate.x -= this.ROTATESPEED;
                // container.setAttribute('rotation', rotate.x+' '+rotate.y+ ' '+rotate.z);
                container.setAttribute('animation', "property: rotation; from: "+originStr+"; to: "+ rotate.x+' '+rotate.y+ ' '+rotate.z +"; dur: 150; easing: linear");
                map = {};
            }
            // ROTATE DOWN
            else if(map[40]){
                e.stopImmediatePropagation();
                let rotate = container.getAttribute('rotation');
                const originStr = rotate.x + ' ' + rotate.y + ' ' + rotate.z;
                rotate.x += this.ROTATESPEED;
                // container.setAttribute('rotation', rotate.x+' '+rotate.y+ ' '+rotate.z)
                container.setAttribute('animation', "property: rotation; from: "+originStr+"; to: "+ rotate.x+' '+rotate.y+ ' '+rotate.z +"; dur: 150; easing: linear");
                map = {};
            }

            // Test for Rotation only
            else if(map[88]) {
                let camera = document.getElementById('theCamera');

                let cameraPosition = camera.getAttribute("position");
                let originPosition = new THREE.Vector3(0,0,0);
                let dir = new THREE.Vector3();
                dir.subVectors( originPosition, cameraPosition );//.normalize();
                console.log(dir);
                angle1 = Math.atan2(dir.y, dir.z);
                angle2 = Math.atan2(dir.x, dir.z);

                // TODO always look at 0,0,0
                var newX = -(180 + THREE.Math.radToDeg(angle1));
                var newY = 180 + THREE.Math.radToDeg(angle2);
                console.log(newX, ' ||| ', newY);

                let rotate = camera.getAttribute('rotation');
                console.log(rotate);
                const originStr = rotate.x + ' ' + rotate.y + ' ' + rotate.z;
                camera.setAttribute('animation', "property: rotation; from: "+originStr+"; to: "+ newX +' '+ newY + ' '+ 0 +"; dur: 500; easing: easeInOutSine");
                camera.components["look-controls"].pitchObject.rotation.x = THREE.Math.degToRad(newX);
                camera.components["look-controls"].yawObject.rotation.y = THREE.Math.degToRad(newY);
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
    }
}

