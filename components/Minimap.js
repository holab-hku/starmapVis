let Minimap = function( camera ) {
    this.minimap = document.createElement( 'a-entity' );
    this.minimap.setAttribute('id','minimap');
    this.minimap.setAttribute('position','-4.2 2.2 -6');
    camera.appendChild(this.minimap);

    let locMark = this.locMark = document.createElement('a-cone');
    this.locMark.setAttribute('color', '#E67E22');
    this.locMark.setAttribute('radius-top', '0.05');
    this.locMark.setAttribute('radius-bottom', '0.00');
    this.locMark.setAttribute('height', '0.15');
    this.locMark.setAttribute('locmark');
    this.minimap.appendChild(this.locMark);

    AFRAME.registerComponent('locmark', {
        tick: function () {
            const x = camera.getAttribute('position').x/150;
            const y = camera.getAttribute('position').y/150 + 0.08;
            const z = camera.getAttribute('position').z/150;
            locMark.setAttribute('position', x+' '+y+' '+z);
        }
    });
}

Minimap.prototype = {

    renderMinimap: function( ){

        for (let j = 0; j < globalData.trajectoryData.length; j++) {
            // Draw the points
            if (globalData.trajectoryData[j].x && globalData.trajectoryData[j].y && globalData.trajectoryData[j].z) {
                let point = document.createElement('a-sphere');
                point.setAttribute('color', '#0E6655');
                point.setAttribute('radius', '0.015');
                const x = globalData.trajectoryData[j].x*globalData.scaleDown;
                const y = globalData.trajectoryData[j].y*globalData.scaleDown;
                const z = globalData.trajectoryData[j].z*globalData.scaleDown;
                point.setAttribute('position', x+' '+y+' '+z);
                this.minimap.appendChild(point);
                // Draw the lines

                if (globalData.trajectoryData[j].children.constructor !== Number ) {
                    if (globalData.trajectoryData[j].children.split(",").length > 0) {
                        const startPoint = x + ', ' + y + ', ' + z;
                        globalData.trajectoryData[j].children.split(",").forEach(
                            element => {
                                let path = document.createElement('a-entity');
                                const object = loader.getObjectFromID(globalData.trajectoryData, element);

                                const x_e = object.x*globalData.scaleDown;
                                const y_e = object.y*globalData.scaleDown;
                                const z_e = object.z*globalData.scaleDown;
                                const endPoint = x_e + ', ' + y_e + ', ' + z_e;
                                path.setAttribute('line', 'start: '+startPoint+'; end: '+endPoint+'; color: #0E6655');
                                this.minimap.appendChild(path);

                            }
                        )
                    }
                }
            }
        }
    },

    showMinimap: function ( bool ) {
        console.log('show minimap: ', bool);
        this.minimap.setAttribute( 'visible', bool );
    }

}
