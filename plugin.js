(function ( $ ) {
 
    $.fn.annotate = function() {
    // create a parent svg tag
    //Initialize variables
    var parentDiv = $('<div contenteditable=true/>')
    var svgTag=$('<svg width="500" height="400" class="svgContainer"/>');
    var svgns = "http://www.w3.org/2000/svg";
    var currentElement = {};
    // toolId are 0 for none , 1 for line , 2 for rectangle , 3 for circle
    var tool=4,clientX1=0,clientX2=0,clientY1=0,clientY2=0,
    isDragging=false,elementIsActive=false,annotations=[],
    stroke="#000000",strokeWidth="2px",fill="transparent",strPath = '',
    elements=[],val = 'Write your text here'
    dragX1=0,dragX2=0,dragY1=0,dragY2=0;
    svgTag.attr({
                  height:this.height(),
                  width:this.width(),
                })
           .css({
           			position:"absolute",
           			top:0,
                left:0,
                'z-index':0
           			})



           //Emitted events
           svgTag.on('undo', function(){
           	if(elements.length){
           	$("#" + elements[elements.length - 1]).remove()
           	elements.splice(-1, 1)
           }
           })
           svgTag.on('deleteAll', function(){
           	$.each(elements, function(key, value){
           		$("#" + value).remove()
           	})
           	elements = []
           })
		    svgTag.on('changeTool',function(newTool,val){
		      if (tool == val){
		        tool=0;
		      }
		      else{
		        tool = val
		      }
		    })
		    svgTag.on('changeColor', function(e, value){
		    	if(value != null){
		    		stroke = value
		    	}
		    })
		    svgTag.on('delete', function(e, value){
		    	if(value){
		    		$("#" + value).remove()
		    		elements.splice($.inArray(value, elements), 1)
		    	}
		    })
		    svgTag.on('changeWidth', function(e, value){
		    	strokeWidth = value
		    })
    //Ends Here



    parentDiv.append(svgTag)
    this.append(parentDiv)
    $(this).attr('style','cursor:crosshair;')
    var cont=svgTag[0]
    
    this.on('mousedown',function(event){
        strPath = ''
        clientX1 = clientX2 = dragX1 = event.offsetX;
        clientY1 = clientY2 = dragY1 = event.offsetY;
        radius = 0;
        isDragging = true;
        shapeIsDrawn = false
        draw();

    })
    this.on('mousemove',function(event){
      if(isDragging && !elementIsActive){
        shapeIsDrawn=true
        editShape(event.offsetX,event.offsetY)
      }
      else if(elementIsActive){
        element=document.querySelector(".annotationIsSelected");
        if(element.tagName === "circle"){
        element.setAttributeNS(null, 'cx', Number(element.getAttribute('cx'))+(event.offsetX - dragX1));
        element.setAttributeNS(null, 'cy', Number(element.getAttribute('cy'))+(event.offsetY - dragY1));
        
        }
        else if(element.tagName === "line"){
        element.setAttributeNS(null, 'x1', Number(element.getAttribute('x1'))+(event.offsetX - dragX1));
        element.setAttributeNS(null, 'y1', Number(element.getAttribute('y1'))+(event.offsetY - dragY1));
        element.setAttributeNS(null, 'x2', Number(element.getAttribute('x2'))+(event.offsetX - dragX1));
        element.setAttributeNS(null, 'y2', Number(element.getAttribute('y2'))+(event.offsetY - dragY1));
       
        }
        else if(element.tagName === "path"){
          element.removeClass('annotationIsSelected')
        }
        else if(element.tagName === "image"){
          //debugger;
        element.setAttributeNS(null, 'x', Number(element.getAttribute('x'))+(event.offsetX - dragX1));
        element.setAttributeNS(null, 'y', Number(element.getAttribute('y'))+(event.offsetY - dragY1))	
        }
        else{
          //debugger;
        element.setAttributeNS(null, 'x', Number(element.getAttribute('x'))+(event.offsetX - dragX1));
        element.setAttributeNS(null, 'y', Number(element.getAttribute('y'))+(event.offsetY - dragY1));
        }
       dragX1 = event.offsetX;
        dragY1 = event.offsetY;
      }
    })
    this.on('mouseup',function(event){
      elementIsActive = false
        if(!shapeIsDrawn)
        {
          elementIsActive = false;
          $(currentElement).off('mouseup').off('mousedown').off('mousemove').remove
          currentElement.remove();
          return
        }

        elementIsActive = false
        isDragging=false;
        clientX2 = event.offsetX;
        clientY2 = event.offsetY;
        setEventListener();
        })
   var setEventListener = function(){
    $(currentElement).on('mousedown',function(event){

        $(event.target).toggleClass('annotationIsSelected');
        elementIsActive=true;
        });
    $(currentElement).on('mouseup',function(event){

        $(event.target).toggleClass('annotationIsSelected');
        elementIsActive=true;
        });

   };
   var editShape = function(clientX2,clientY2){
    if(tool === 1){
       currentElement.setAttributeNS(null, 'x2', clientX2);
       currentElement.setAttributeNS(null, 'y2', clientY2);
    }
    else if(tool === 2){
      if(clientY2 > clientY1) 
      {
        //bottom quadrant
        if(clientX2 > clientX1){
                  //right bottom quadrant
                 currentElement.setAttributeNS(null, 'width', clientX2 - clientX1);
                 currentElement.setAttributeNS(null, 'height',clientY2 - clientY1);
            }
        else{
                  //left bottom qaudrant
                currentElement.setAttributeNS(null, 'x', clientX2);
                currentElement.setAttributeNS(null, 'y', clientY1);
                currentElement.setAttributeNS(null, 'width', clientX1-clientX2);
                currentElement.setAttributeNS(null, 'height', clientY2-clientY1);  
        }
      }
      
      else {
        // top quadrant
       if(clientX2 > clientX1){
        //top right quadrant
                currentElement.setAttributeNS(null, 'x', clientX1);
                currentElement.setAttributeNS(null, 'y', clientY2);
                currentElement.setAttributeNS(null, 'width', clientX2-clientX1);
                currentElement.setAttributeNS(null, 'height', clientY1-clientY2); 
       }
       else{
        // top left quadrant
          currentElement.setAttributeNS(null, 'x', clientX2);
          currentElement.setAttributeNS(null, 'y', clientY2);
          currentElement.setAttributeNS(null, 'width', clientX1-clientX2);
          currentElement.setAttributeNS(null, 'height', clientY1-clientY2);
       }
      }
    
    }
    else if(tool === 3){
      currentElement.setAttributeNS(null, 'r', Math.sqrt(Math.pow((clientX2-clientX1),2)+Math.pow((clientY2-clientY1),2)));
    }
    else if(tool == 4){
      strPath += " L" + clientX2 + " " + clientY2
      currentElement.setAttributeNS(null, 'd', strPath)
    }
    else if(tool == 5){
      currentElement.setAttributeNS(null, 'x', clientX2);
      currentElement.setAttributeNS(null, 'y', clientY2);
    }
    else if(tool == 6){
      currentElement.setAttributeNS(null, 'x', clientX2);
      currentElement.setAttributeNS(null, 'y', clientY2);
    }
   }; 
   var draw = function(){
      if( tool === 0 ){
        return
      }
      else if( tool === 1 ){
        //tool is line
        drawShape.line(clientX1,clientY1,clientX2,clientY2,stroke,fill,strokeWidth)
      }
      else if( tool === 2 ){
        //tool is rectangle
        drawShape.rectangle(clientX1,clientY1,clientY2-clientY1,clientX2-clientX1,stroke,fill,strokeWidth)
      } 
      else if( tool === 3 ){
        //tool is circle
        drawShape.circle(clientX1,clientY1,radius,stroke,fill,strokeWidth)
      }
      else if( tool === 4 ){
        //tool is circle
        drawShape.path 	(clientX1,clientY1,clientX2,clientY2,stroke,fill,strokeWidth)
      }
      else if( tool === 5 ){
        //tool is circle
        drawShape.emoji(clientX1, clientY1)
      }
      else if( tool === 6 ){
        //tool is circle
        drawShape.text(clientX1, clientY1, val)
      }
   } ;
   
   var drawShape= 
   							{
   										rectangle:function(x,y,height,width,stroke,fill,strokeWidth){
                                 var id = "rect" + Math.floor((Math.random() * 1000) + 1)
                                var rect = currentElement = document.createElementNS(svgns, 'rect');
                                rect.setAttributeNS(null, 'id', id)
                                rect.setAttributeNS(null, 'x', x);
                                rect.setAttributeNS(null, 'y', y);
                                rect.setAttributeNS(null, 'height', height);
                                rect.setAttributeNS(null, 'width', width);
                                rect.setAttributeNS(null, 'style', 'z-index:2;fill:'+fill+'; stroke: '+stroke+';stroke-width:'+strokeWidth );
                                cont.appendChild(rect);
                                elements.push(id)
                                
                      			},

                        circle:function(x,y,radius,stroke,fill,strokeWidth)  {
                        	var id = "circle" + Math.floor((Math.random() * 1000) + 1)
                                var circle = currentElement  = document.createElementNS(svgns, 'circle');
                                circle.setAttributeNS(null, 'id', id)
                                circle.setAttributeNS(null, 'cx', x);
                                circle.setAttributeNS(null, 'cy', y);
                                circle.setAttributeNS(null, 'r', radius);
                                circle.setAttributeNS(null, 'style', 'z-index:2;fill:'+fill+'; stroke: '+stroke+';stroke-width:'+strokeWidth);
                                cont.appendChild(circle);
                                elements.push(id)
                                
                        },
                        line:function(x1,y1,x2,y2,stroke,fill,strokeWidth){
                        	var id = "line" + Math.floor((Math.random() * 1000) + 1)
                                var line = currentElement  = document.createElementNS(svgns,'line');
                                line.setAttributeNS(null, 'id', id)
                                line.setAttributeNS(null, 'x1', x1);
                                line.setAttributeNS(null, 'x2', x2);
                                line.setAttributeNS(null, 'y1', y1);
                                line.setAttributeNS(null, 'y2', y2);
                                line.setAttributeNS(null, 'style', 'z-index:2;fill:'+fill+'; stroke: '+stroke+';stroke-width:'+strokeWidth);
                                cont.appendChild(line)
                                elements.push(id)
                                
                        },
                         path: function(x1,y1,x2,y2,stroke,fill,strokeWidth){
                                var id = "path" + Math.floor((Math.random() * 1000) + 1)
                                var path = currentElement  = document.createElementNS(svgns,'path');
                                strPath = "M" + x1 + " " + y1
                                path.setAttributeNS(null, 'd', strPath)
                                path.setAttributeNS(null, 'id', id)
                                path.setAttributeNS(null, 'style', 'z-index:2;fill:'+fill+'; stroke: '+stroke+';stroke-width:'+strokeWidth);
                                cont.appendChild(path)
                                elements.push(id)
                                
                        },
                        emoji: function(x, y){
                        	var id = "image" + Math.floor((Math.random() * 1000) + 1)
                        	var image = currentElement  = document.createElementNS(svgns, 'image')
                        	image.setAttributeNS(null, 'height', '50px')
                        	image.setAttributeNS(null, 'width', '50px')
                        	image.setAttributeNS('http://www.w3.org/1999/xlink','href', 'https://image.flaticon.com/icons/svg/60/60536.svg');
                        	image.setAttributeNS(null,'x',x);
            							image.setAttributeNS(null,'y',y);
            							image.setAttributeNS(null, 'id', id)
            							image.setAttributeNS(null, 'visibility', 'visible')
            							cont.appendChild(image)
            							elements.push(id)
                        },
                        text: function(x, y, val){
                          var id = "text" + Math.floor((Math.random() * 1000) + 1)
                          var text = currentElement  = document.createElementNS(svgns, 'text')
                          var textNode = document.createTextNode(val)
                          text.appendChild(textNode)
                          text.setAttributeNS(null, 'id', id)
                          text.setAttributeNS(null, "x", x)
                          text.setAttributeNS(null, "y", y)
                          text.setAttributeNS(null, "font-size", "30px")
                          text.setAttributeNS(null, 'style', 'outline:dotted;outline-width:2px;')
                          cont.appendChild(text)
                          elements.push(id)
                        }

   							}
    };
 
}( jQuery ));