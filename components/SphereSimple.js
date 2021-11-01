AFRAME.registerComponent('spheresimple', {
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

        const sprite = new THREE.TextureLoader().load( 'image/WhiteBall.png' );

        // Create geometry.
        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(data.position, 3)
        );
        this.geometry.setAttribute('color', new THREE.Float32BufferAttribute(data.color, 3));


        // this.geometry.computeBoundingSphere();

        // Create material.
        this.material = new THREE.PointsMaterial({
            size: 1.3,
            vertexColors: THREE.VertexColors,
            alphaTest: 0.5,
            transparent: true,
            map: sprite,
        });



        // Create mesh.
        this.mesh = new THREE.Points(this.geometry, this.material);



        // Set mesh on entity.
        el.setObject3D('mesh', this.mesh);
    }
});