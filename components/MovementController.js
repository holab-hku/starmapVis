let MovementController = function( ) {
}

MovementController.prototype = {

    move: function( camera, container, destination ){


        // TODO here's a bug ...

        console.log('move to: ', destination);
        console.log(document.getElementById('theCamera'));

        // Rotate the container to 0 0 0
        let modelRotation = container.getAttribute('rotation');
        if (modelRotation.x !== 0 || modelRotation.y !== 0 || modelRotation.z !== 0) {
            console.log('current model rotation: ', modelRotation);
            container.setAttribute('animation', 'property: rotation; to: 0 0 0; dur: 3000');
            // let animationRo = document.createElement('a-entity');
            // animationRo.setAttribute('animation', 'property: rotation; to: 0 0 0; dur: 3000');
            // container.appendChild(animationRo);
        }

        // Move the camera to the destination
        let posStr = destination.x+ ' ' + destination.y + ' ' + destination.z;
        camera.setAttribute('animation', 'property: position; to: '+ posStr +'; dur: 4000; easing: easeInOutSine');
        // let animation = document.createElement('a-entity');
        // animation.setAttribute('animation', 'property: position; to: '+ posStr +'; dur: 4000; easing: easeInOutSine');
        // camera.appendChild(animation);

    }
}
