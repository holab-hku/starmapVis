let ControlPanelLU = function( ) {
    this.guiLU = new dat.gui.GUI({width: 280, closeOnTop: true, name: 'Control Panel LU'});
}

ControlPanelLU.prototype = {
    init: function ( ) {

        this.guiLU.add(globalData, 'showData' ).name( "ShowData" ).listen( ).onChange( function ( ) {
            console.log('show Data: ', globalData.showData);
            document.getElementById('cellData').setAttribute('visible', ''+globalData.showData);
        });

        this.guiLU.add(globalData, 'showImg' ).name( "ShowImg" ).listen( ).onChange( function ( ) {
            console.log('show image: ', globalData.showImg);
            document.getElementById('sliceImg').setAttribute('visible', ''+globalData.showImg);
            // document.getElementById('sliceImg').setAttribute('animation', 'property: visible;  to: '+ globalData.showImg+'; dur: 1000; easing: linear')
        });

        this.guiLU.add(globalData, 'showCompass' ).name( "ShowCompass" ).listen( ).onChange( function ( ) {
            console.log('show compass & axis: ', globalData.showCompass);
            compass.showCompass(globalData.showCompass);
            axis.showAxis(globalData.showCompass);
        });

        this.guiLU.add(globalData, 'showColormap' ).name( "ColomapInfo" ).listen( ).onChange( function ( ) {
            console.log('show colormap: ', globalData.showColormap);
            if (globalData.showColormap) {
                $('#colormapToast').toast('show');
            } else {
                $('#colormapToast').toast('hide');
            }
        });

        let geneMarkerFolder = this.guiLU.addFolder('MarkerGene', '#FFFFFF');

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

        let animationWithPath = {
            animationWithPath: function () {
            },
        };
        if (globalData.hasAnimationPath) {
            let defaultPathFolder = this.guiLU.addFolder('Flyover', '#FFFFFF');
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

                camera.setAttribute('position', '100 50 250');
                container.setAttribute('rotation', '0 0 0');

                camera.components["look-controls"].pitchObject.rotation.x = 0;
                camera.components["look-controls"].yawObject.rotation.y = 0;


            }
        };


        let liftUp = {
            liftUp: function () {

                // document.getElementById('theSpinner').style.height = '100%';
                // document.getElementById('theSpinner').style.visibility = 'visible';


                if (globalData.liftUp2D) {
                    console.log('From 2D to 3D');

                    globalData.liftUp2D = false;

                    globalData.cellData.forEach(element => {
                        let origin = document.getElementById(element[globalData.idStr]);
                        let originalPos = origin.getAttribute('position');
                        let originalPosStr = originalPos.x + ' ' + originalPos.y + ' ' + originalPos.z;
                        let target = loader.getObjectFromID(globalData.cellData3D, element[globalData.idStr]);
                        let targetStr = target.x*globalData.scaleUp+ ' ' + target.y*globalData.scaleUp + ' ' + target.z*globalData.scaleUp;
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

                    // let targetImg = document.getElementById('sliceImg');
                    // let originalImgPos = targetImg.getAttribute('position');
                    // let originalImgPosStr = originalImgPos.x + ' ' + originalImgPos.y + ' ' + originalImgPos.z;
                    // let posImgStr = originalImgPos.x+ ' ' + originalImgPos.y + ' ' + (Number(originalImgPos.z) - 30);
                    // targetImg.setAttribute('animation', 'property: position; from: ' + originalImgPosStr + '; to: '+ posImgStr +'; dur: 1500; easing: easeInOutSine')

                } else {
                    console.log('From 3D to 2D');

                    globalData.liftUp2D = true;

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

                    // let targetImg = document.getElementById('sliceImg');
                    // let originalImgPos = targetImg.getAttribute('position');
                    // let originalImgPosStr = originalImgPos.x + ' ' + originalImgPos.y + ' ' + originalImgPos.z;
                    // let posImgStr = originalImgPos.x+ ' ' + originalImgPos.y+ ' ' + (Number(originalImgPos.z) + 30);
                    // targetImg.setAttribute('animation', 'property: position; from: ' + originalImgPosStr + '; to: '+ posImgStr +'; dur: 1500; easing: easeInOutSine')

                }

                // document.getElementById('theSpinner').style.height = '0';
                // document.getElementById('theSpinner').style.visibility = 'hidden';

            }
        };

        let exit = {
            exit: function () {
                location.href = "index.html";
            }
        };

        this.guiLU.add(reset, 'reset').name("Reset Camera");
        this.guiLU.add(liftUp, 'liftUp').name("Lift Up");
        this.guiLU.add(exit, 'exit').name('Exit');
    },

}
