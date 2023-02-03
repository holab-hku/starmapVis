AFRAME.registerComponent('spheresingle', {
    schema: {
        position: {type: 'array', default: []},
        color: {type: 'array', default: []},
    },

    multiple: true,

    /**
     * Initial creation and setting of the mesh.
     */
    init: function () {
        let data = this.data;
        let el = this.el;

        const sprite = new THREE.TextureLoader().load( 'image/whiteBall.png' );

        // Create geometry.
        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(data.position, 3));
        this.geometry.setAttribute('color', new THREE.Float32BufferAttribute(data.color, 3));

        this.geometry.computeBoundingSphere();

        // Create material.

        let size = 1;
        if (globalData.inputFile1Trans === true || globalData.numOfSlices > 0) {
            size = 2;
        }

        this.material = new THREE.PointsMaterial({
            size: 40,
            vertexColors: THREE.VertexColors,
            alphaTest: 0.5,
            transparent: true,
            map: sprite,
            // sizeAttenuation: false,
        });
        // this.material.color.setHSL( 1.0, 0.3, 0.7 );

        // TODO Merge before mesh




        // Create mesh.
        this.mesh = new THREE.Points(this.geometry, this.material);



        // Set mesh on entity.
        el.setObject3D('mesh', this.mesh);
    }
});
