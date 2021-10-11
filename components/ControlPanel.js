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
                    movementController.moveThroughPath(camera, container, pathList);
                });
            });
        }

        let reset = {
            reset: function () {

                if (globalData.onMovement) {
                    window.location.href = window.location.href;
                }

                if (target === 's4') {
                    camera.setAttribute("position", "100 100 500");
                } else {
                    camera.setAttribute('position', '0 0 250');
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
            liftUp: function () {

                if (globalData.startFrom2D) {
                    console.log('From 2D to 3D');

                    globalData.startFrom2D = false;

                    globalData.cellData.forEach(element => {
                        let origin = document.getElementById(element[globalData.idStr]);
                        let originalPos = origin.getAttribute('position');
                        let originalPosStr = originalPos.x + ' ' + originalPos.y + ' ' + originalPos.z;
                        let target = loader.getObjectFromID(globalData.cellData3D, element[globalData.idStr]);
                        let targetStr = target.x*globalData.scaleUp*2+ ' ' + target.y*globalData.scaleUp*2 + ' ' + target.z*globalData.scaleUp*2;
                        origin.setAttribute('animation', 'property: position; from: ' + originalPosStr + '; to: '+ targetStr +'; dur: 1500; easing: easeInOutSine')
                    });


                    for (let i = 1; i < 5; i++) {
                        const idTemp = 'slice' + i
                        let targetImg = document.getElementById(idTemp);
                        let originalImgPos = targetImg.getAttribute('position');
                        let originalImgPosStr = originalImgPos.x + ' ' + originalImgPos.y + ' ' + originalImgPos.z;
                        let posImgStr = originalImgPos.x+ ' ' + (Number(originalImgPos.y) - 200) + ' ' + (Number(originalImgPos.z) - 30);
                        targetImg.setAttribute('animation', 'property: position; from: ' + originalImgPosStr + '; to: '+ posImgStr +'; dur: 1500; easing: easeInOutSine')
                    }

                } else {
                    console.log('From 3D to 2D');

                    globalData.startFrom2D = true;

                    globalData.cellData.forEach(element => {
                        let origin = document.getElementById(element[globalData.idStr]);
                        let originalPos = origin.getAttribute('position');
                        let originalPosStr = originalPos.x + ' ' + originalPos.y + ' ' + originalPos.z;
                        let target = loader.getObjectFromID(globalData.cellData, element[globalData.idStr]);
                        let targetStr = target.x*globalData.scaleUp+ ' ' + target.y*globalData.scaleUp + ' ' + target.z/2;
                        origin.setAttribute('animation', 'property: position; from: ' + originalPosStr + '; to: '+ targetStr +'; dur: 1500; easing: easeInOutSine')
                    });

                    for (let i = 1; i < 5; i++) {
                        const idTemp = 'slice' + i
                        let targetImg = document.getElementById(idTemp);
                        let originalImgPos = targetImg.getAttribute('position');
                        let originalImgPosStr = originalImgPos.x + ' ' + originalImgPos.y + ' ' + originalImgPos.z;
                        let posImgStr = originalImgPos.x+ ' ' + (Number(originalImgPos.y) + 200) + ' ' + (Number(originalImgPos.z) + 30);
                        targetImg.setAttribute('animation', 'property: position; from: ' + originalImgPosStr + '; to: '+ posImgStr +'; dur: 1500; easing: easeInOutSine')
                    }

                }

            }
        };




        if (globalData.inputFile1Trans) {
            this.gui.add(liftUp, 'liftUp').name("Lift Up");
        }

        this.gui.add(reset, 'reset').name("Reset Camera");
        this.gui.add(help, 'help').name("Help");
        this.gui.add(exit, 'exit').name('Exit');
    },

}
