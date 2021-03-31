let ControlPanel = function( ) {
    this.gui = new dat.gui.GUI({width: 280, closeOnTop: true, name: 'Control Panel'});
}

ControlPanel.prototype = {
    init: function ( ) {

        this.gui.add(globalData, 'showData' ).name( "ShowData" ).listen( ).onChange( function ( ) {
            console.log('show Data: ', globalData.showData);
            document.getElementById('cellData').setAttribute('visible', ''+globalData.showData);
        });

        let geneMarkerFolder = this.gui.addFolder('Gene Markers', '#FFFFFF');

        const changeGeneMarker = geneMarkerFolder.add( globalData.curGeneMarker, 'GeneMarker' ).options( globalData.geneMarkersList );

        changeGeneMarker.onChange( function () {

            console.log('gene marker: ', globalData.curGeneMarker);
            document.getElementById('theSpinner').style.height = '100%';
            document.getElementById('theSpinner').style.visibility = 'visible';

            setTimeout(function (){
                loader.renderPoints(globalData.cellData, true);
            }, 1);

        } );

        geneMarkerFolder.open();

        let flyoverFolder = this.gui.addFolder('Flyover', '#FFFFFF');
        flyoverFolder.add(globalData, 'showTrajectory' ).name( "ShowTrajectory" ).listen( ).onChange( function ( ) {
            console.log('show the trajectory: ', globalData.showTrajectory);
            document.getElementById('trajectory').setAttribute('visible', ''+globalData.showTrajectory);
        });

        let flyover = {
            flyover: function () {
                // console.log(globalData.destinationCheckpoint);
                movementController.move(camera, container, globalData.destinationCheckpoint);
            },
        };

        flyoverFolder.add(flyover, 'flyover' ).name( "Continue");

        flyoverFolder.open();

        let animationWithPath = {
            animationWithPath: function () {
            },
        };
        if (globalData.hasAnimationPath) {
            let defaultPathFolder = this.gui.addFolder('Animation Path', '#FFFFFF');
            Object.keys(globalData.curAnimationPath).forEach(function(key) {
                // console.log(key, globalData.curAnimationPath[key]);
                defaultPathFolder.add(animationWithPath, 'animationWithPath').name( key ).listen( ).onChange( function ( ) {
                    // TODO highlight the path, perhaps hidden the control panel ?
                    let pathList = globalData.curAnimationPath[key].split(' ');
                    movementController.moveThroughPath(camera, container, pathList);
                });
            });
        }

        let reset = {
            reset: function () {
                camera.setAttribute('position', '0 0 250');
                container.setAttribute('rotation', '0 0 0');

                let cameraRotation = camera.getAttribute('rotation');
                const originalRotStr = cameraRotation.x + ' ' + cameraRotation.y + ' ' + cameraRotation.z;
                console.log(cameraRotation);
                // TODO set camera rotation, here is a bug ...
                camera.setAttribute('animation', "property: rotation; from: " + originalRotStr + "; to: 0 0 0 ; dur: 150; easing: linear");

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
        this.gui.add(screenShot, 'screenShot').name("Screenshot");
        this.gui.add(help, 'help').name("Help");
        this.gui.add(exit, 'exit').name('Exit');
    },

}
