(function ( $ ) {
    $.fn.redrawAnnot = function(config){
        var svgTag = $(this).find('svg')
        var svgns = "http://www.w3.org/2000/svg"
        var cont=svgTag[0]
        $.each(config, function(index, redrawEl){
                let newNode = document.createElementNS(svgns, redrawEl.type)
                $.each(redrawEl.drawConf, function(key, val){
                    newNode.setAttributeNS(null, key, val)
                })
                newNode.setAttributeNS(null, 'id', redrawEl.id)
                $(newNode).attr('style', redrawEl.style)
                cont.appendChild(newNode)
        })
    }
}( jQuery ));