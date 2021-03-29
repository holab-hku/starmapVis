let Loader = function( container, id ) {

    this.innerContainer = document.createElement( 'a-entity' );
    this.innerContainer.setAttribute('id', id);
    container.appendChild(this.innerContainer);

}

Loader.prototype = {

    loadCSV: function ( path, id) {
        let that = this;
        Papa.parse(path, {
            header: true,
            download: true,
            dynamicTyping: true,
            complete: function(results) {
                let data = results.data;
                if (id === 'cellData') {
                    that.renderPoints(data);
                    globalData.cellData = data;
                } else if (id === 'trajectory') {
                    that.renderTrajectory(data)
                    globalData.trajectoryData = data;
                }
            }
        });
    },

    renderPoints: function( data, flag = false ){

        let attributesList = Object.keys(data[0]);
        const idStr = attributesList[0];
        const featureList = attributesList.splice(4, attributesList.length - 4);
        globalData.geneMarkersList = featureList;
        let curGeneMarker = '';
        if (flag) {

            // TODO Loading starts
            console.log('Reloading starts');

            curGeneMarker = globalData.curGeneMarker.GeneMarker;

            let oldCellData = document.getElementById('cellData');
            oldCellData.innerHTML = '';

        } else {
            curGeneMarker = featureList[0];
            globalData.curGeneMarker.GeneMarker = curGeneMarker;
        }

        console.log(curGeneMarker);
        // globalData.curGeneMarker.GeneMarker = curGeneMarker;

        let edgeValue = 0;
        let featureMax = 0;
        for (let i = 0; i < data.length; i++) {
            if (Math.abs(data[i].x) > edgeValue) {
                edgeValue = Math.abs(data[i].x);
            }
            if (Math.abs(data[i].y) > edgeValue) {
                edgeValue = Math.abs(data[i].y);
            }
            if (Math.abs(data[i].z) > edgeValue) {
                edgeValue = Math.abs(data[i].z);
            }
            if (data[i][curGeneMarker] > featureMax) {
                featureMax = data[i][curGeneMarker];
            }
        }
        globalData.scaleUp = 150/edgeValue;
        globalData.scaleDown = 1/edgeValue;

        const featureNorm = 100/featureMax;
        data.forEach(element => {
            let colorIndex = element[curGeneMarker] * featureNorm;
            if (Math.round(colorIndex) > 99) {colorIndex = 99}
            const colorStr = globalData.batlowColormap[Math.round(colorIndex)];
            let aSphere = document.createElement('a-sphere');
            aSphere.setAttribute('id', element[idStr]);
            if (colorStr) {
                aSphere.setAttribute('color', colorStr);
            }
            aSphere.setAttribute('radius', '0.7');
            aSphere.setAttribute('position', element.x*globalData.scaleUp + ' ' + element.y*globalData.scaleUp + ' ' + element.z*globalData.scaleUp)
            this.innerContainer.appendChild(aSphere);
        });

        // TODO Loading ends
        // console.log('Reloading ends');
        // window.onload = function() {
        //     //After everything is loaded
        //     console.log('Reloading ends');
        // };

        $(document).ready(function() {
            console.log('Reloading ends');
            document.getElementById('theSpinner').style.visibility = 'hidden';
        });

    },

    renderTrajectory: function ( data ) {
        data.forEach(element => {
            let aSphere = document.createElement('a-sphere');
            aSphere.setAttribute('id', element.edges);
            aSphere.setAttribute('color', '#943126');
            aSphere.setAttribute('radius', '0.3');
            const x = element.x*globalData.scaleUp;
            const y = element.y*globalData.scaleUp;
            const z = element.z*globalData.scaleUp;
            aSphere.setAttribute('position', x + ' ' + y+ ' ' + z)
            this.innerContainer.appendChild(aSphere);

            if (element.children) {
                let childrenList = element.children.split(",");
                const startPoint = x + ', ' + y + ', ' + z;
                childrenList.forEach(
                    element2 => {
                        let path = document.createElement('a-entity');
                        const object = this.getObjectFromID(data, element2);
                        const x_e = object.x*globalData.scaleUp;
                        const y_e = object.y*globalData.scaleUp;
                        const z_e = object.z*globalData.scaleUp;
                        const endPoint = x_e + ', ' + y_e + ', ' + z_e;

                        // path.setAttribute('meshline','path: ' + startPoint + ', ' + endPoint + ' ; color: #566573; lineWidth: 7');
                        path.setAttribute('line', 'start: '+startPoint+'; end: '+endPoint+'; color: #943126');

                        this.innerContainer.appendChild(path);

                        if (childrenList.length > 1) {
                            const x_e_half = (x+x_e)/2;
                            const y_e_half = (y+y_e)/2;
                            const z_e_half = (z+z_e)/2;
                            let directionChoice = this.addDirection((x+x_e_half)/2,(y+y_e_half)/2,(z+z_e_half)/2,  new THREE.Vector3(x_e, y_e, z_e), element.edges+'-'+element2);
                            this.innerContainer.appendChild(directionChoice);
                        }

                    }
                )
            }
        })
    },

    getObjectFromID : function( data, id ) {
        let result = null;
        data.forEach(element => {
            const idStr = Object.keys(data[0])[0];
            if (element[idStr] === id) {
                result = element
            }
        });
        return result
    },

    addDirection : function(x, y, z, destination, name) {
        let objectWrapper = document.createElement('a-entity');
        let object = document.createElement('a-cone');
        object.setAttribute('color', '#943126');
        object.setAttribute('radius-bottom', '0.3');
        object.setAttribute('radius-top', '0');
        object.setAttribute('height', '1.2');
        objectWrapper.setAttribute('position', x+' '+y+' '+z);
        object.setAttribute('rotation', '90 0 0');

        object.setAttribute('clickhandler', "txt:"+name);
        object.setAttribute('data-raycastable');

        objectWrapper.appendChild(object);
        objectWrapper.setAttribute('look-at', destination);
        return objectWrapper
    },

    registerComp : function () {
        AFRAME.registerComponent('clickhandler', {
            schema: {
                txt: {default:'default'}
            },
            init: function () {
                var data = this.data;
                var el = this.el;
                el.addEventListener('click', function () {
                    console.log(data.txt);
                });
            }
        });
    },
}