let MovementController = function( ) {
    this.rotationAnimationDur = 2700;
    this.positionAnimationDur = 3500;
    this.animationInterval = this.positionAnimationDur + 50;
}

MovementController.prototype = {

    move: function( camera, container, destination ){
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
        camera.setAttribute('animation', 'property: position; from: ' + originalPosStr + '; to: '+ posStr +'; dur: '+this.positionAnimationDur+'; easing: easeInOutSine');
    },

    moveThroughPath: function ( camera, container, pathList ) {
        let counter = 0;
        const lenOfPathList = pathList.length - 1;
        let that = this
        that.move(camera, container, {x:0,y:100,z:200});
        // Right after the click
        globalData.showTrajectory = false;
        document.getElementById('trajectory').setAttribute('visible', ''+globalData.showTrajectory);
        let pathEntity = this.generatePath(pathList);
        container.appendChild(pathEntity);
        controlPanel.gui.close();
        document.getElementById('animationProgressBar').style.width = '0%';
        document.getElementById('animationProgressContainer').style.visibility = 'visible';
        let timer = setInterval(function (){
            if (counter >= lenOfPathList) {
                clearInterval(timer);
                document.getElementById('animationProgressContainer').style.visibility = 'hidden';
                // After the travel
                pathEntity.remove();
                globalData.showTrajectory = true;
                document.getElementById('trajectory').setAttribute('visible', ''+globalData.showTrajectory);
                controlPanel.gui.open();


                $('#liveToast').toast('show');


            }
            // 4 secs after the click
            that.move(camera, container, that.getPosStr(pathList[counter]));
            document.getElementById('animationProgressBar').style.width = Math.round(counter/lenOfPathList*100)+ '%';
            counter = counter + 1;
        }, this.animationInterval)
    },

    getPosStr: function ( id ) {
        const ori = loader.getObjectFromID(globalData.trajectoryData, id);
        let pointLoc = {};
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
}
