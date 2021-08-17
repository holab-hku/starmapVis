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

        let animationWithPath = {
            animationWithPath: function () {
            },
        };
        if (globalData.hasAnimationPath) {
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

                camera.setAttribute('position', '0 0 250');
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

        this.gui.add(reset, 'reset').name("Reset Camera");
        // this.gui.add(screenShot, 'screenShot').name("Screenshot");
        this.gui.add(help, 'help').name("Help");
        this.gui.add(exit, 'exit').name('Exit');
    },

}
