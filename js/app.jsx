require('../scss/style.scss');

document.addEventListener('DOMContentLoaded', function(){
    
    var draggedEl,
        onDragStart,
        onDrag,
        onDragEnd,
        grabPointX,
        grabPointY;
    
    onDragStart = function (e) {
        var boundingClientRect;
        if(e.target.className.indexOf('bar') === -1) {
            return;
        }
        
        draggedEl = this;
        
        boundingClientRect = draggedEl.getBoundingClientRect();
        
        grabPointX = boundingClientRect.left - e.clientX;
        grabPointY = boundingClientRect.top - e.clientY;
    }
    
    onDrag = function(e) {
        if(!draggedEl) {
            return;
        }
        
        var posX = e.clientX + grabPointX;
        var posY = e.clientY + grabPointY;
        
        if(posX < 0) {
            posX = 0;
        }
        
        if(posY < 0) {
            posY = 0;
        }
        
        draggedEl.style.transform = "translateX(" + posX + "px) translateY(" + posY + "px)";
    }
    
    onDragEnd = function() {
        draggedEl = null;
        grabPointX = null;
        grabPointX = null;
    }
    
    document.addEventListener('mousemove', onDrag, false);
    document.addEventListener('mouseup', onDragEnd, false);
    document.querySelector('.sticker').addEventListener('mousedown', onDragStart, false);
    
});