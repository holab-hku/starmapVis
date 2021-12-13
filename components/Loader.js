let Loader = function( container, id ) {

    // texture.minFilter = THREE.LinearFilter;


    this.innerContainer = document.createElement( 'a-entity' );
    this.innerContainer.setAttribute('id', id);
    container.appendChild(this.innerContainer);

    // For trajectory only
    this.traObjectsContainer = document.createElement( 'a-entity' );

}

Loader.prototype = {

    uniteObjects: function ( dataobj1, dataobj2, targetMG) {
        dataobj1.forEach(element => {
            this.getObjectFromID(dataobj2, element[globalData.idStr], globalData.idStr).then(target =>{
                element[targetMG] = target[targetMG];
            }, reject => {console.log('object not found in function getObjectFromID')});
        });
    },

    object3DToBufferArray: function ( dataobj ) {
        let positions = [];
        dataobj.forEach(element => {
            if (element[globalData.idStr] !== null && element[globalData.curMarkerGene.Attribute] !== 'None') {
                positions.push(element.x*globalData.scaleUp, element.y*globalData.scaleUp, element.z*globalData.scaleUp);
            }
        })
        return positions;
    },

    object3DToBufferArrayCluster: function ( dataobj, mg ) {
        let positions = {};
        dataobj.forEach(element => {
            if (element[globalData.idStr] !== null && element[globalData.curMarkerGene.Attribute] !== 'None') {
                if (!positions.hasOwnProperty(element[mg])) {
                    positions[element[mg]] = [];
                }
                positions[element[mg]].push(element.x*globalData.scaleUp, element.y*globalData.scaleUp, element.z*globalData.scaleUp);
            }
        })
        return positions;
    },

    showOrHideDataPoint: function ( obj, mg, key, show ) {
        obj.forEach(element => {
            if (element[mg] === key) {
                document.getElementById(element[globalData.idStr]).setAttribute('visible', show);
            }
        })
    },

    loadCSV: function ( path, id) {
        return new Promise((resolve, reject) => {
            Papa.parse(path, {
                header: true,
                download: true,
                dynamicTyping: true,
                complete: function(results) {
                    resolve(results.data);
                },
                error: function (err) {
                    reject(err)
                }
            })
        }).catch(error => {
            if (id === 'trajectory') {
                console.log('No trajectory data received');
            }
        });
    },

    load3DCSV: function (path) {
        return new Promise((resolve, reject) => {
            Papa.parse(path, {
                header: true,
                download: true,
                dynamicTyping: true,
                complete: function(results) {
                    resolve(results.data)
                },
                error: function (err) {
                    reject(err)
                }
            })
        })
    },







    renderPoints: function( data, flag = false , visMode = 0, changeMG = false){

        let numOfColorCode = globalData.colormapInfo[globalData.curColormap.Colourmap].num;

        globalData.categoricalColorDict = {};
        let attributesList = Object.keys(data[0]);
        globalData.idStr = attributesList[0];
        const featureList = attributesList.splice(4, attributesList.length - 4);
        globalData.markerGeneList = featureList;
        let curMarkerGene = '';
        if (flag) {
            console.log('Reloading starts');
            curMarkerGene = globalData.curMarkerGene.Attribute;
            let oldCellData = document.getElementById('cellData');
            oldCellData.innerHTML = '';
        } else {
            curMarkerGene = featureList[0];
            globalData.curMarkerGene.Attribute = curMarkerGene;
        }
        if (globalData.inputFile1Trans && changeMG && globalData.cellData3D !== null) {
            this.uniteObjects(globalData.cellData3D, globalData.cellData, curMarkerGene)
            if (globalData.inputFile1Trans2 && globalData.cellData3D2 !== null) {
                this.uniteObjects(globalData.cellData3D2, globalData.cellData, curMarkerGene)
            }
        }
        console.log('Current MarkerGene: ', curMarkerGene);
        // deal with non-numerical attributes
        let isStr = false;
        globalData.isStr = false;

        let strSet = [];
        let strToNumDict = {};
        let strToNumIndex = 0;

        globalData.s3Trans2 = false;
        for (let i = 0; i < data.length; i++) {
            if (data[i][curMarkerGene] !== 'None') {
                if (typeof(data[i][curMarkerGene]) === 'string') {
                    console.log('this gene marker contains strings');
                    isStr = true;
                    globalData.isStr = true;
                    document.getElementById('colormapToastBody').setAttribute('style', 'display: none');
                } else {
                    document.getElementById('colormapToastBody').setAttribute('style', 'display: block');
                    document.getElementById('coloPanelImg').setAttribute('src', globalData.colormapInfo[globalData.curColormap.Colourmap].imgPath);
                }
                break;
            } else {
                globalData.s3Trans2 = true;
            }
        }

        let edgeValue = 0;
        let featureMax = 0;
        let featureMin = 0;
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

            if (isStr) {

                const strClass = data[i][curMarkerGene];

                if ( !strSet.includes(strClass) && strClass !== undefined && strClass !== 'None' ){
                    strSet.push(strClass);
                    strToNumDict[strClass] = strToNumIndex;
                    strToNumIndex = strToNumIndex + 1;
                }
                featureMax = strToNumIndex;
            } else {
                if (data[i][curMarkerGene] > featureMax) {
                    featureMax = data[i][curMarkerGene];
                }
                if (data[i][curMarkerGene] < featureMin) {
                    featureMin = data[i][curMarkerGene];
                }
            }
        }
        globalData.featureMAX = featureMax;
        globalData.featureMIN = featureMin;
        document.getElementById('colormapMAX').innerText = "MAX: " + globalData.featureMAX.toFixed(2);
        document.getElementById('colormapMIN').innerText = "MIN: " + globalData.featureMIN.toFixed(2);
        console.log('max value: ', globalData.featureMAX);
        globalData.scaleUp = 150/edgeValue;
        globalData.scaleDown = 1/edgeValue;

        let featureNorm
        if (featureMin < 0) {
            featureNorm = numOfColorCode/(featureMax - featureMin);
        } else {
            featureNorm = numOfColorCode/featureMax;
        }

        if (visMode === 1) {
            // High-Performance Mode
            data.forEach(element => {
                let colorIndex;
                if (isStr) {
                    colorIndex = strToNumDict[element[curMarkerGene]] * featureNorm;
                } else {
                    if (featureMin < 0) {
                        colorIndex = (element[curMarkerGene] - featureMin) * featureNorm;
                    } else {
                        colorIndex = element[curMarkerGene] * featureNorm;
                    }
                }
                if (Math.round(colorIndex) > (numOfColorCode-1)) {colorIndex = (numOfColorCode-1)}
                let colorStr = globalData.curUsingColormap[Math.round(colorIndex)];
                let aSphere = document.createElement('a-sphere');
                aSphere.setAttribute('id', element[globalData.idStr]);
                if (colorStr) {
                    aSphere.setAttribute('color', colorStr);
                    aSphere.setAttribute('roughness', '0.8');
                    if (isStr) {
                        if (element[curMarkerGene] === 'None') {
                            aSphere.setAttribute('visible', 'false');
                        } else {
                            globalData.categoricalColorDict[element[curMarkerGene]] = colorStr;
                        }
                    }
                    aSphere.setAttribute('radius', '0.7');
                } else {
                    aSphere.setAttribute('visible', 'false');
                }

                if (globalData.curStatus === 1) {
                    loader.getObjectFromID(globalData.cellData3D, element[globalData.idStr], globalData.idStr).then(target => {
                        aSphere.setAttribute('position', target.x*globalData.scaleUp + ' ' + target.y*globalData.scaleUp + ' ' + target.z*globalData.scaleUp);
                    }, reject => {console.log(reject)})
                } else if (globalData.curStatus === 2) {
                    loader.getObjectFromID(globalData.cellData3D2, element[globalData.idStr], globalData.idStr).then(target => {
                        aSphere.setAttribute('position', target.x*globalData.scaleUp + ' ' + target.y*globalData.scaleUp + ' ' + target.z*globalData.scaleUp);
                    }, reject => {console.log(reject)})
                } else {
                    aSphere.setAttribute('position', element.x*globalData.scaleUp + ' ' + element.y*globalData.scaleUp + ' ' + element.z*globalData.scaleUp);
                }

                this.innerContainer.appendChild(aSphere);
            });


        } else {
            // Simplified Mode
            let positions;
            let colors;

            if (isStr) {
                positions = {};
                colors = {};
            } else {
                positions = [];
                colors = [];
            }


            data.forEach(element => {
                let colorIndex;
                if (isStr) {

                    colorIndex = strToNumDict[element[curMarkerGene]] * featureNorm;

                } else {
                    if (featureMin < 0) {
                        colorIndex = (element[curMarkerGene] - featureMin) * featureNorm;
                    } else {
                        colorIndex = element[curMarkerGene] * featureNorm;
                    }
                }
                if (Math.round(colorIndex) > (numOfColorCode-1)) {colorIndex = (numOfColorCode-1)}
                let colorStr = globalData.curUsingColormap[Math.round(colorIndex)];
                if (colorStr) {

                    let color = new THREE.Color(Number('0x'+colorStr.slice(-6)));

                    if (isStr) {

                        globalData.categoricalColorDict[element[curMarkerGene]] = colorStr;

                        if (!colors.hasOwnProperty(element[curMarkerGene])) {
                            colors[element[curMarkerGene]] = [];
                        }
                        colors[element[curMarkerGene]].push(color.r, color.g, color.b);

                    } else {
                        colors.push(color.r, color.g, color.b);
                    }

                    if (globalData.curStatus === 1) {
                        loader.getObjectFromID(globalData.cellData3D, element[globalData.idStr], globalData.idStr).then(object => {
                            if (isStr) {
                                if (!positions.hasOwnProperty(element[curMarkerGene])) {
                                    positions[element[curMarkerGene]] = [];
                                }
                                positions[element[curMarkerGene]].push(object.x*globalData.scaleUp, object.y*globalData.scaleUp, object.z*globalData.scaleUp);
                            } else {
                                positions.push(object.x*globalData.scaleUp, object.y*globalData.scaleUp, object.z*globalData.scaleUp);
                            }

                        }, reject => {console.log(reject)})
                    } else if (globalData.curStatus === 2) {
                        loader.getObjectFromID(globalData.cellData3D2, element[globalData.idStr], globalData.idStr).then(object => {
                            if (isStr) {
                                if (!positions.hasOwnProperty(element[curMarkerGene])) {
                                    positions[element[curMarkerGene]] = [];
                                }
                                positions[element[curMarkerGene]].push(object.x*globalData.scaleUp, object.y*globalData.scaleUp, object.z*globalData.scaleUp);
                            } else {
                                positions.push(object.x*globalData.scaleUp, object.y*globalData.scaleUp, object.z*globalData.scaleUp);
                            }
                        }, reject => {console.log(reject)})
                    } else {
                        if (isStr) {
                            if (!positions.hasOwnProperty(element[curMarkerGene])) {
                                positions[element[curMarkerGene]] = [];
                            }
                            positions[element[curMarkerGene]].push(element.x*globalData.scaleUp, element.y*globalData.scaleUp, element.z*globalData.scaleUp);
                        } else {
                            positions.push(element.x*globalData.scaleUp, element.y*globalData.scaleUp, element.z*globalData.scaleUp);
                        }
                    }
                }
            });


            let that = this;
            setTimeout(function (){
                if (isStr) {

                    Object.entries(positions).forEach(element => {
                        const id = element[0];
                        let sphereGroup = document.createElement('a-entity');
                        sphereGroup.setAttribute('id', '3Dcluster_'+id);
                        sphereGroup.setAttribute('spheregroup', {positionList: element[1], colorList: colors[id]});
                        that.innerContainer.appendChild(sphereGroup);
                    })

                } else {
                    let sphereGroup = document.createElement('a-entity');
                    sphereGroup.setAttribute('spheregroup', {positionList: positions, colorList: colors});
                    that.innerContainer.appendChild(sphereGroup);
                }


                globalData.groupRenderColor = colors;
                globalData.groupRenderPos = positions;
            }, 100)

        }















        $(document).ready(function() {
            // After rerendering, hide the spinner
            console.log('Reloading ends');
            document.getElementById('theSpinner').style.height = '0';
            document.getElementById('theSpinner').style.visibility = 'hidden';
            // Change colormap information to category

            if (isStr) {
                let colormapSection = document.getElementById('colormapToastBodyCategory');
                colormapSection.innerHTML = '';
                Object.keys(globalData.categoricalColorDict).forEach(function(key) {
                    let row = document.createElement('p');
                    row.innerHTML = key;
                    row.setAttribute('style', 'color: white; background-color: '+globalData.categoricalColorDict[key]);
                    row.setAttribute('class', 'px-3');


                    let checkBox = document.createElement('input');
                    checkBox.setAttribute('class', 'form-check-input');
                    checkBox.setAttribute('type', 'checkbox');
                    checkBox.setAttribute('id', key);
                    checkBox.setAttribute('checked', true);
                    checkBox.setAttribute('style', 'float: right');
                    checkBox.onchange = function () {
                        console.log('Checkbox Key: ', key, ', Visible: ', checkBox.checked, ', VisMode: ', visMode, ', curMG: ', globalData.curMarkerGene.Attribute);
                        if (visMode === 1) {
                            loader.showOrHideDataPoint(globalData.cellData, globalData.curMarkerGene.Attribute, key, checkBox.checked);
                        } else {
                            document.getElementById('3Dcluster_'+key).setAttribute('visible', checkBox.checked);
                        }

                    };
                    row.appendChild(checkBox);




                    colormapSection.appendChild(row);
                });
                colormapSection.setAttribute('style', 'display: block; max-height: 200px; overflow-y: scroll');
            } else {
                document.getElementById('colormapToastBodyCategory').innerHTML = '';
                document.getElementById('colormapToastBodyCategory').setAttribute('style', 'display: none');
            }


        });
    },


























    renderTrajectory: function ( data ) {
        globalData.idStrTra = Object.keys(data[0])[0];
        data.forEach(element => {
            let color = '#943126';
            let radius = '0.15';
            // Root has distinct color and radius.
            if (element.root) {
                globalData.trajRootId = element[globalData.idStrTra];
                color = '#F39C12'
                radius = '0.4';
                globalData.destinationCheckpoint = {id:element[globalData.idStrTra], x:element.x*globalData.scaleUp, y:element.y*globalData.scaleUp, z:element.z*globalData.scaleUp};

            }
            let aSphere = document.createElement('a-sphere');
            aSphere.setAttribute('id', element.edges);
            aSphere.setAttribute('color', color);
            aSphere.setAttribute('radius', radius);
            const x = element.x*globalData.scaleUp;
            const y = element.y*globalData.scaleUp;
            const z = element.z*globalData.scaleUp;

            aSphere.setAttribute('position', x + ' ' + y+ ' ' + z)
            this.traObjectsContainer.appendChild(aSphere);

            if (element.children) {

                let childrenList = [];

                // Some modification
                if (element.children.constructor === Number ) {
                    childrenList = [element.children];
                } else {
                    childrenList = element.children.split(",");
                }

                const startPoint = x + ', ' + y + ', ' + z;
                childrenList.forEach(
                    element2 => {
                        let path = document.createElement('a-entity');
                        this.getObjectFromID(data, element2, globalData.idStrTra).then(object => {
                            const x_e = object.x*globalData.scaleUp;
                            const y_e = object.y*globalData.scaleUp;
                            const z_e = object.z*globalData.scaleUp;

                            const endPoint = x_e + ', ' + y_e + ', ' + z_e;

                            // path.setAttribute('meshline','path: ' + startPoint + ', ' + endPoint + ' ; color: #566573; lineWidth: 7');
                            path.setAttribute('line', 'start: '+startPoint+'; end: '+endPoint+'; color: #943126');

                            this.innerContainer.appendChild(path);

                            if (childrenList.length > 0) {
                                const x_e_half = (x+x_e)/2;
                                const y_e_half = (y+y_e)/2;
                                const z_e_half = (z+z_e)/2;
                                let directionChoice = this.addDirection((x+x_e_half)/2,(y+y_e_half)/2,(z+z_e_half)/2,  new THREE.Vector3(x_e, y_e, z_e), element.edges+'-'+element2, element2);
                                this.traObjectsContainer.appendChild(directionChoice);
                            }
                        }, reject => {})
                    }
                )
            }

        })

        this.innerContainer.appendChild(this.traObjectsContainer);
    },



    getObjectFromID : function( data, id, key ) {
        return new Promise(((resolve, reject) => {
            data.forEach(element => {
                if (element[key] === id) {
                    resolve(element);
                }
            });
            reject('None');
        }))

    },

    addDirection : function(x, y, z, destination, name, id) {
        let objectWrapper = document.createElement('a-entity');
        let object = document.createElement('a-cone');
        object.setAttribute('color', '#943126');
        object.setAttribute('radius-bottom', '0.15');
        object.setAttribute('radius-top', '0');
        object.setAttribute('height', '1.2');
        objectWrapper.setAttribute('position', x+' '+y+' '+z);
        object.setAttribute('rotation', '90 0 0');

        object.setAttribute('clickhandler', "txt:"+destination.x+' '+destination.y+' '+destination.z+' '+id);
        object.setAttribute('data-raycastable');

        objectWrapper.appendChild(object);
        objectWrapper.setAttribute('look-at', destination);
        return objectWrapper
    },

    registerComp : function () {
        let that = this;
        AFRAME.registerComponent('clickhandler', {
            schema: {
                txt: {default:'default'}
            },
            init: function () {
                let data = this.data;
                let el = this.el;
                el.addEventListener('click', function () {
                    const desList = data.txt.split(' ');
                    globalData.destinationCheckpoint = {id:desList[3], x: desList[0], y: desList[1], z: desList[2]};
                    console.log('new destination: ', globalData.destinationCheckpoint);
                    movementController.move(camera, container, globalData.destinationCheckpoint);

                    // invisualize the spheres and cones in the trajectory system when the movement starts
                    that.traObjectsContainer.setAttribute('visible', 'false');
                    setTimeout(function (){
                        that.traObjectsContainer.setAttribute('visible', 'true');
                    }, movementController.positionAnimationDur)

                });
            }
        });
    },


}
