let MovementController = function( ) {
    this.rotationAnimationDur = 2700;
    this.positionAnimationDur = 3500;
    this.animationInterval = this.positionAnimationDur + 50;

    // this.onMovement = false;
    // this.counter = 0;
    // this.lenOfPathList = 0;
}

MovementController.prototype = {

    // TODO if there are images => another attribute
    move: function( camera, container, destination, lookAtDestination = true ){
        console.log('move to: ', destination);
        // Rotate the container to 0 0 0
        let modelRotation = container.getAttribute('rotation');
        if (modelRotation.x !== 0 || modelRotation.y !== 0 || modelRotation.z !== 0) {
            let rotStr = modelRotation.x + ' ' + modelRotation.y + ' ' + modelRotation.z;
            container.setAttribute('animation', 'property: rotation; from: ' + rotStr + '; to: 0 0 0; dur: '+this.rotationAnimationDur);
        }
        // Move the camera to the destination
        let originalPos = camera.getAttribute('position');
        let originalPosStr = originalPos.x + ' ' + originalPos.y + ' ' + originalPos.z;
        let posStr = destination.x+ ' ' + destination.y + ' ' + destination.z;


        if (lookAtDestination) {
            document.getElementById('target').setAttribute('position', posStr);
        } else {
            document.getElementById('target').setAttribute('position', '0 0 0');
        }


        keyboard.lookGreenBox();

        setTimeout(() => {camera.setAttribute('animation', 'property: position; from: ' + originalPosStr + '; to: '+ posStr +'; dur: '+this.positionAnimationDur+'; easing: easeInOutSine');}, 500);

    },

    moveThroughPath: function ( camera, container, pathList ) {

        globalData.onMovement = true;

        globalData.mcCounter = 0;
        globalData.mcLenOfPathList = pathList.length - 1;
        let that = this

        if (target === 's4') {
            that.move(camera, container, {x:100,y:250,z:550}, false);
        } else {
            that.move(camera, container, {x:0,y:100,z:200}, false);
        }


        // Right after the click
        globalData.showTrajectory = false;
        document.getElementById('trajectory').setAttribute('visible', ''+globalData.showTrajectory);
        let pathEntity = this.generatePath(pathList);
        let pathThinEntity = this.generateThinPath(pathList);

        container.appendChild(pathEntity);

        // This line can be deleted
        controlPanel.gui.close();

        document.getElementById('animationProgressBar').style.width = '0%';
        document.getElementById('animationProgressContainer').style.visibility = 'visible';


        let timer = setInterval(function (){

            // TODO
            if (globalData.stopMoveBtn) {
                globalData.onMovement = false;
                clearInterval(timer);
                document.getElementById('animationProgressContainer').style.visibility = 'hidden';

                try {
                    pathEntity.remove();
                } catch (e) {
                    console.log('has been removed');
                }

                try {
                    pathThinEntity.remove();
                } catch (e) {
                    console.log('has been removed');
                }

                $('#liveToast').toast('show');
            }

            if (globalData.mcCounter >= globalData.mcLenOfPathList) {
                globalData.onMovement = false;

                clearInterval(timer);
                document.getElementById('animationProgressContainer').style.visibility = 'hidden';

                // After the travel
                try {
                    pathThinEntity.remove();
                } catch (e) {
                    console.log('has been removed');
                }


                globalData.showTrajectory = true;
                document.getElementById('trajectory').setAttribute('visible', ''+globalData.showTrajectory);

                controlPanel.gui.open();


                $('#liveToast').toast('show');

            }
            // 4 secs after the click
            console.log('debug: ', pathList, ' || ', globalData.mcCounter);

            that.move(camera, container, that.getPosStr(pathList[globalData.mcCounter]));

            if (globalData.mcCounter === 1) {
                try {
                    pathEntity.remove();
                } catch (e) {
                    console.log('has been removed');
                }
                container.appendChild(pathThinEntity);
            }

            document.getElementById('animationProgressBar').style.width = Math.round(globalData.mcCounter/globalData.mcLenOfPathList*100)+ '%';
            globalData.mcCounter = globalData.mcCounter + 1;
        }, this.animationInterval)
    },

    getObjectFromID : function( data, id, key ) {
        let result = {}
        data.forEach(element => {
            if (element[key] === id) {
                result = element;
            }
        })
        return result
    },

    getPosStr: function ( id ) {
        let pointLoc = {};

        let ori = this.getObjectFromID(globalData.trajectoryData, id, globalData.idStrTra);
        pointLoc.x = ori.x * globalData.scaleUp;
        pointLoc.y = ori.y * globalData.scaleUp;
        pointLoc.z = ori.z * globalData.scaleUp;
        return pointLoc
    },

    generatePath: function ( pathList ) {
        let pathContainer = document.createElement('a-entity');
        let prePos = this.getPosStr(pathList[0]);
        for (let i = 1; i < pathList.length; i++) {
            let postPos = this.getPosStr(pathList[i]);
            let startPoint = prePos.x + ' ' + prePos.y + ' ' + prePos.z;
            let endPoint = postPos.x + ' ' + postPos.y + ' ' + postPos.z;
            let pathEntity = document.createElement('a-entity');
            // pathEntity.setAttribute('line', 'start: '+startPoint+'; end: '+endPoint+'; color: #283747');
            pathEntity.setAttribute('meshline', "lineWidth: 14; path: "+startPoint+", "+endPoint+"; color: #5bc0de");
            pathContainer.appendChild(pathEntity);
            prePos = postPos;
        }
        return pathContainer;
    },

    generateThinPath: function ( pathList ) {
        let pathContainer = document.createElement('a-entity');
        let prePos = this.getPosStr(pathList[0]);
        for (let i = 1; i < pathList.length; i++) {
            let postPos = this.getPosStr(pathList[i]);
            let startPoint = prePos.x + ' ' + prePos.y + ' ' + prePos.z;
            let endPoint = postPos.x + ' ' + postPos.y + ' ' + postPos.z;
            let pathEntity = document.createElement('a-entity');
            pathEntity.setAttribute('line', 'start: '+startPoint+'; end: '+endPoint+'; color: #5bc0de');
            pathContainer.appendChild(pathEntity);
            prePos = postPos;
        }
        return pathContainer;
    },

}
