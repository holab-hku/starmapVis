let MovementController = function( ) {
}

MovementController.prototype = {

    move: function( camera, container, destination ){

        console.log('move to: ', destination);

        // Rotate the container to 0 0 0
        let modelRotation = container.getAttribute('rotation');
        if (modelRotation.x !== 0 || modelRotation.y !== 0 || modelRotation.z !== 0) {
            let rotStr = modelRotation.x + ' ' + modelRotation.y + ' ' + modelRotation.z;
            container.setAttribute('animation', 'property: rotation; from: ' + rotStr + '; to: 0 0 0; dur: 3000');
        }

        // Move the camera to the destination
        let originalPos = camera.getAttribute('position');
        let originalPosStr = originalPos.x + ' ' + originalPos.y + ' ' + originalPos.z;
        let posStr = destination.x+ ' ' + destination.y + ' ' + destination.z;
        camera.setAttribute('animation', 'property: position; from: ' + originalPosStr + '; to: '+ posStr +'; dur: 4000; easing: easeInOutSine');
    }
}
