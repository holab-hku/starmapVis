AFRAME.registerComponent('spheregroup', {
    schema: {
        positionList: {type: 'array', default: []},
        idList: {type: 'array', default: []},
        colorList: {type: 'array', default: []},
    },

    // schema: {
    //     geometryList: {type: 'array', default: []}
    // },

    multiple: true,

    /**
     * Initial creation and setting of the mesh.
     */
    init: function () {
        let data = this.data;
        let el = this.el;




        // console.log('debug2:', data.geometryList);
        //
        // let mergedGeometry = THREE.BufferGeometryUtils.mergeBufferGeometries(data.geometryList, false);
        // let material = new THREE.MeshBasicMaterial({
        //     vertexColors: true,
        // });
        //
        // this.mesh = new THREE.Mesh(mergedGeometry, material);






        const sprite = new THREE.TextureLoader().load( 'image/disc.png' );

        // Create geometry.
        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(data.positionList, 3)
        );
        this.geometry.setAttribute('color', new THREE.Float32BufferAttribute(data.colorList, 3));

        this.geometry.setAttribute('id', new THREE.Int32BufferAttribute(data.idList, 1));

        // this.geometry.computeBoundingSphere();

        // Create material.
        this.material = new THREE.PointsMaterial({
            size: 2,
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