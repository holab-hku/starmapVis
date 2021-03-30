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

