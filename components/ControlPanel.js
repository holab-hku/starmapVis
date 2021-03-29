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

            // TODO if current position is not equal to the config.nextPoint.coordinates
            //  move to there
            //  if is equal, than update the config.nextPoint and move to the next
            //  until a choice is required to be made <== recursive ???

            flyover: function () {  },

        };

        flyoverFolder.add(flyover, 'flyover' ).name( "Continue / Pause");

        flyoverFolder.open();

        if (globalData.hasInputPath) {
            let defaultPathFolder = this.gui.addFolder('Default Path', '#FFFFFF');
        }

        let reset = {
            reset: function () {
                camera.setAttribute('position', '0 0 250');
                container.setAttribute('rotation', '0 0 0');

                // TODO here is a bug
                // camera.setAttribute('look-at', new THREE.Vector3(0, 0, 0));

                let degRotation = camera.getAttribute('rotation');
                let cameraRotation = { x: THREE.Math.degToRad(degRotation.x), y: THREE.Math.degToRad(degRotation.y), z: THREE.Math.degToRad(degRotation.z) };
                console.log(cameraRotation);
                camera.setAttribute('rotation', {x:0, y: 0, z:0})
                console.log(camera.getAttribute('rotation'));

            }
        };

        let help = {
            help: function () {
                // TODO show a modal?
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
        this.gui.add(help, 'help').name("Help");
        this.gui.add(exit, 'exit').name('Exit');
    },

}
