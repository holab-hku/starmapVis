let Axis = function( container ) {
    this.axisEl = document.createElement( 'a-entity' );
    this.axisEl.setAttribute('id','axis');
    container.appendChild(this.axisEl);
}

Axis.prototype = {

    renderAxis: function( ){

        const from = -120;
        const end = 120;

        let xLineEl = document.createElement( 'a-entity' );
        xLineEl.setAttribute('line','start: ' + from + ' 0 0; end: ' + end + ' 0 0; color: #943126' );
        let arrowXEl= document.createElement("a-entity");
        arrowXEl.setAttribute( 'points', { positions: [end, 0, 0] , hasColor : false , size:  80, textureSrc:'image/posX.png', sizeAttenuation: false, color: '#943126'} );
        this.axisEl.appendChild(xLineEl);

        let yLineEl = document.createElement( 'a-entity' );
        yLineEl.setAttribute('line','start: 0 '+ from + ' 0; end: 0 ' + end + ' 0; color: #0E6655' );
        let arrowYEl= document.createElement("a-entity");
        arrowYEl.setAttribute( 'points', { positions: [0, end, 0] , hasColor : false , size:  80, textureSrc:'image/posY.png', sizeAttenuation: false , color: '#0E6655'} );
        this.axisEl.appendChild(yLineEl);

        let zLineEl = document.createElement( 'a-entity' );
        zLineEl.setAttribute('line','start: 0 0 '+ from + '; end: 0 0 ' + end + '; color: #21618C' );
        let arrowZEl= document.createElement("a-entity");
        arrowZEl.setAttribute( 'points', { positions: [0, 0, end] , hasColor : false , size:  80, textureSrc:'image/posZ.png', sizeAttenuation: false, color: '#21618C'} );
        this.axisEl.appendChild(zLineEl);

    },

    showAxis: function ( bool ) {
        console.log('show axis: ', bool);
        this.axisEl.setAttribute( 'visible', bool );
    }
}
