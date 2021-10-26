let ControlPanel = function( ) {
    this.gui = new dat.gui.GUI({width: 280, closeOnTop: true, name: 'Control Panel'});
}

ControlPanel.prototype = {
    init: function ( ) {

        this.gui.add(globalData, 'showData' ).name( "ShowData" ).listen( ).onChange( function ( ) {
            console.log('show Data: ', globalData.showData);
            document.getElementById('cellData').setAttribute('visible', ''+globalData.showData);
        });

        this.gui.add(globalData, 'showCompass' ).name( "ShowCompass" ).listen( ).onChange( function ( ) {
            console.log('show compass & axis: ', globalData.showCompass);
            compass.showCompass(globalData.showCompass);
            axis.showAxis(globalData.showCompass);

            // minimap will only occur when there is a trajectory
            if (globalData.inputFile2 && target !== 's4') {
                minimap.showMinimap(globalData.showCompass);
            }
        });

        if (globalData.inputSlice) {
            this.gui.add(globalData, 'showImg' ).name( "ShowImg" ).listen( ).onChange( function ( ) {
                console.log('show image: ', globalData.showImg);
                // document.getElementById('sliceImg').setAttribute('visible', ''+globalData.showImg);
                // document.getElementById('sliceImg').setAttribute('animation', 'property: visible;  to: '+ globalData.showImg+'; dur: 1000; easing: linear')
                for (let i = 1; i < 3; i++) {
                    const idTemp = 'slice' + i
                    document.getElementById(idTemp).setAttribute('visible', ''+globalData.showImg);
                }
            });
        }



        this.gui.add(globalData, 'showColormap' ).name( "ColomapInfo" ).listen( ).onChange( function ( ) {
            console.log('show colormap: ', globalData.showColormap);
            if (globalData.showColormap) {
                $('#colormapToast').toast('show');
            } else {
                $('#colormapToast').toast('hide');
            }
        });

        let geneMarkerFolder = this.gui.addFolder('MarkerGene', '#FFFFFF');

        const changeGeneMarker = geneMarkerFolder.add( globalData.curMarkerGene, 'MarkerGene' ).options( globalData.markerGeneList );

        changeGeneMarker.onChange( function () {

            console.log('gene marker: ', globalData.curMarkerGene);
            document.getElementById('theSpinner').style.height = '100%';
            document.getElementById('theSpinner').style.visibility = 'visible';

            setTimeout(function (){
                loader.renderPoints(globalData.cellData, true);
            }, 1);

        } );

        geneMarkerFolder.open();


        if (globalData.inputFile2) {
            let trajectoryFolder = this.gui.addFolder('Trajectory', '#FFFFFF');
            trajectoryFolder.add(globalData, 'showTrajectory' ).name( "ShowTrajectory" ).listen( ).onChange( function ( ) {
                console.log('show the trajectory: ', globalData.showTrajectory);
                document.getElementById('trajectory').setAttribute('visible', ''+globalData.showTrajectory);
            });

            let trajMove = {
                trajMove: function () {
                    loader2.traObjectsContainer.setAttribute('visible', 'false');
                    setTimeout(function (){
                        loader2.traObjectsContainer.setAttribute('visible', 'true');

                        // TODO set the checkpoint
                        loader.getObjectFromID(globalData.trajectoryData, globalData.destinationCheckpoint.id, globalData.idStrTra).then(target => {

                            let childrenList
                            try {
                                childrenList = target.children.split(",")
                            } catch (e) {
                                alert('Reached the end')
                                childrenList = [globalData.trajRootId];
                            }


                            if (childrenList.length === 1) {
                                console.log("Only one child");
                                loader.getObjectFromID(globalData.trajectoryData, childrenList[0], globalData.idStrTra).then(target2 => {
                                    console.log('feat: ', target2);
                                    globalData.destinationCheckpoint = {id: target2[globalData.idStrTra], x: target2.x*globalData.scaleUp, y: target2.y*globalData.scaleUp, z: target2.z*globalData.scaleUp}
                                })
                            }
                        })


                    }, movementController.positionAnimationDur)
                    movementController.move(camera, container, globalData.destinationCheckpoint);
                },
            };

            trajectoryFolder.add(trajMove, 'trajMove' ).name( "Continue");

            trajectoryFolder.open();
        }



        let animationWithPath = {
            animationWithPath: function () {
            },
        };
        if (globalData.inputPath) {
            let defaultPathFolder = this.gui.addFolder('Flyover', '#FFFFFF');
            Object.keys(globalData.curAnimationPath).forEach(function(key) {
                defaultPathFolder.add(animationWithPath, 'animationWithPath').name( key ).listen( ).onChange( function ( ) {
                    let pathList = globalData.curAnimationPath[key].split(' ');

                    console.log('path list: ', pathList);

                    try {
                        movementController.moveThroughPath(camera, container, pathList);
                    } catch (error) {
                        console.log(error);
                        alert('This input path is not applicable');
                    }


                });
            });
        }

        let reset = {
            reset: function () {

                if (globalData.onMovement) {
                    window.location.href = window.location.href;
                }

                if (target === 's1') {
                    camera.setAttribute("position", "0 0 250");
                } else {
                    camera.setAttribute('position', '75 75 350');
                }
                container.setAttribute('rotation', '0 0 0');

                camera.components["look-controls"].pitchObject.rotation.x = 0;
                camera.components["look-controls"].yawObject.rotation.y = 0;


            }
        };

        let screenShot =  {
            screenShot: function(){
                document.getElementById('scene').components.screenshot.capture('perspective');
            }
        };

        let help = {
            help: function () {
                console.log('show the help modal');
                $('#theModal').modal('toggle');
            }
        };

        let exit = {
            exit: function () {
                location.href = "index.html";
            }
        };



        let liftUp = {

            liftUp1: function () {
                transform(globalData.cellData3D);
            },

            liftUp2: function () {
                transform(globalData.cellData3D2);
            },

        };

        function transform(dataObj) {

            if (globalData.startFrom2D) {
                console.log('From 2D to 3D');
                globalData.startFrom2D = false;
                globalData.cellData.forEach(element => {
                    let origin = document.getElementById(element[globalData.idStr]);
                    let originalPos = origin.getAttribute('position');
                    let originalPosStr = originalPos.x + ' ' + originalPos.y + ' ' + originalPos.z;
                    loader.getObjectFromID(dataObj, element[globalData.idStr], globalData.idStr).then(
                        target => {
                            let targetStr = target.x*globalData.scaleUp+ ' ' + target.y*globalData.scaleUp + ' ' + target.z*globalData.scaleUp;
                            origin.setAttribute('animation', 'property: position; from: ' + originalPosStr + '; to: '+ targetStr +'; dur: 1500; easing: easeInOutSine');
                        },
                        reject => {
                            let targetStr = originalPos.x + ' ' + (Number(originalPos.y) - 200) + ' ' + (Number(originalPos.z) - 30);
                            origin.setAttribute('animation', 'property: position; from: ' + originalPosStr + '; to: '+ targetStr +'; dur: 1000; easing: easeInOutSine');
                        }
                    )
                });
                if (globalData.inputSlice) {
                    for (let i = 1; i < 3; i++) {
                        const idTemp = 'slice' + i
                        let targetImg = document.getElementById(idTemp);
                        let originalImgPos = targetImg.getAttribute('position');
                        let originalImgPosStr = originalImgPos.x + ' ' + originalImgPos.y + ' ' + originalImgPos.z;
                        let posImgStr = originalImgPos.x+ ' ' + (Number(originalImgPos.y) - 200) + ' ' + (Number(originalImgPos.z) - 30);
                        targetImg.setAttribute('animation', 'property: position; from: ' + originalImgPosStr + '; to: '+ posImgStr +'; dur: 1000; easing: easeInOutSine')
                    }
                }

            } else {
                console.log('From 3D to 2D');
                globalData.startFrom2D = true;
                globalData.cellData.forEach(element => {
                    let origin = document.getElementById(element[globalData.idStr]);
                    let originalPos = origin.getAttribute('position');
                    let originalPosStr = originalPos.x + ' ' + originalPos.y + ' ' + originalPos.z;
                    loader.getObjectFromID(globalData.cellData, element[globalData.idStr], globalData.idStr).then(
                        target => {
                            let targetStr = target.x*globalData.scaleUp+ ' ' + target.y*globalData.scaleUp + ' ' + target.z*globalData.scaleUp;
                            origin.setAttribute('animation', 'property: position; from: ' + originalPosStr + '; to: '+ targetStr +'; dur: 1500; easing: easeInOutSine');
                        }
                    )
                });
                if (globalData.inputSlice) {
                    for (let i = 1; i < 3; i++) {
                        const idTemp = 'slice' + i
                        let targetImg = document.getElementById(idTemp);
                        let originalImgPos = targetImg.getAttribute('position');
                        let originalImgPosStr = originalImgPos.x + ' ' + originalImgPos.y + ' ' + originalImgPos.z;
                        let posImgStr = originalImgPos.x+ ' ' + (Number(originalImgPos.y) + 200) + ' ' + (Number(originalImgPos.z) + 30);
                        targetImg.setAttribute('animation', 'property: position; from: ' + originalImgPosStr + '; to: '+ posImgStr +'; dur: 2000; easing: easeInOutSine')
                    }
                }

            }

        }




        if (globalData.inputFile1Trans) {
            let transFolder = this.gui.addFolder('Transformation', '#FFFFFF');
            transFolder.add(liftUp, 'liftUp1').name("Transform_1");
            if (globalData.inputFile1Trans2) {
                transFolder.add(liftUp,'liftUp2').name("Transform_2");
            }
            transFolder.open();
        }

        this.gui.add(reset, 'reset').name("Reset Camera");
        this.gui.add(help, 'help').name("Help");
        this.gui.add(exit, 'exit').name('Exit');
    },

}
