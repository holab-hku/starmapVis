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

                if (globalData.liftUp2D) {
                    console.log('From 2D to 3D');

                    globalData.liftUp2D = false;

                    globalData.cellData.forEach(element => {
                        let target = document.getElementById(element[""]);
                        let originalPos = target.getAttribute('position');
                        let originalPosStr = originalPos.x + ' ' + originalPos.y + ' ' + originalPos.z;
                        let posStr = originalPos.x+ ' ' + element.y*globalData.scaleUp + ' ' + originalPos.z;
                        target.setAttribute('animation', 'property: position; from: ' + originalPosStr + '; to: '+ posStr +'; dur: 1500; easing: easeInOutSine')
                    });

                    let targetImg = document.getElementById('sliceImg');
                    let originalImgPos = targetImg.getAttribute('position');
                    let originalImgPosStr = originalImgPos.x + ' ' + originalImgPos.y + ' ' + originalImgPos.z;
                    let posImgStr = originalImgPos.x+ ' ' + (Number(originalImgPos.y) - 8) + ' ' + originalImgPos.z;
                    targetImg.setAttribute('animation', 'property: position; from: ' + originalImgPosStr + '; to: '+ posImgStr +'; dur: 1500; easing: easeInOutSine')

                } else {
                    console.log('From 3D to 2D');

                    globalData.liftUp2D = true;

                    globalData.cellData.forEach(element => {
                        let target = document.getElementById(element[""]);
                        let originalPos = target.getAttribute('position');
                        let originalPosStr = originalPos.x + ' ' + originalPos.y + ' ' + originalPos.z;
                        let posStr = originalPos.x+ ' ' + 10 + ' ' + originalPos.z;
                        target.setAttribute('animation', 'property: position; from: ' + originalPosStr + '; to: '+ posStr +'; dur: 1500; easing: easeInOutSine')
                    });

                    let targetImg = document.getElementById('sliceImg');
                    let originalImgPos = targetImg.getAttribute('position');
                    let originalImgPosStr = originalImgPos.x + ' ' + originalImgPos.y + ' ' + originalImgPos.z;
                    let posImgStr = originalImgPos.x+ ' ' + (Number(originalImgPos.y) + 8) + ' ' + originalImgPos.z;
                    targetImg.setAttribute('animation', 'property: position; from: ' + originalImgPosStr + '; to: '+ posImgStr +'; dur: 1500; easing: easeInOutSine')

                }

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
