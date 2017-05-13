require('../scss/style.scss');

document.addEventListener('DOMContentLoaded', function(){
    
    'use strict';
    
    var draggedEl,
        onDragStart,
        onDrag,
        onDragEnd,
        grabPointX,
        grabPointY,
        createNote,
        addNoteBtnEl,
        init,
        testLocalStorage,
        saveNote,
        deleteNote,
        loadNotes,
        getNoteObject,
        onAddNoteBtnClick;
    
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
    
    getNoteObject = function(el) {
        var textarea = el.querySelector('textarea');
        return {
            content: textarea.value,
            id: el.id,
            transformCSSValue: el.style.transform,
            textarea: {
                width: textarea.style.width,
                height: textarea.style.height
            }
        }
    }
    
    createNote = function(options) {
        var stickerEl = document.createElement('div'),
            barEl = document.createElement('div'),
            textareaEl = document.createElement('textarea'),
            saveBtnEl = document.createElement('button'),
            deleteBtnEl = document.createElement('button'),
            onSave,
            onDelete,
            BOUNDARIES = 100,
            noteConfig = options || {
                content: '',
                id: "sticker_" + new Date().getTime(),
                transformCSSValue: "translateX(" + Math.random() * BOUNDARIES + "px) translateY(" + Math.random() * BOUNDARIES + "px)"
            }
        
        onSave = function() {
            saveNote(getNoteObject(stickerEl));
        }
        
        if (noteConfig.textarea) {
            textareaEl.style.width = noteConfig.textarea.width;
            textareaEl.style.height = noteConfig.textarea.height;
//            textareaEl.style.resize = 'none';
        }
        
        stickerEl.id = noteConfig.id;
        textareaEl.value = noteConfig.content;
        
        onDelete = function() {
            deleteNote(getNoteObject(stickerEl));
            document.body.removeChild(stickerEl);
        }
        
        saveBtnEl.addEventListener('click', onSave);
        deleteBtnEl.addEventListener('click', onDelete);
        
        saveBtnEl.classList.add('saveButton');
        deleteBtnEl.classList.add('deleteButton');
        
        stickerEl.style.transform = noteConfig.transformCSSValue;
        
        barEl.classList.add('bar');
        stickerEl.classList.add('sticker');
        
        barEl.appendChild(saveBtnEl);
        barEl.appendChild(deleteBtnEl);
        
        stickerEl.appendChild(barEl);
        stickerEl.appendChild(textareaEl);
        
        stickerEl.addEventListener('mousedown', onDragStart, false);
        
        document.body.appendChild(stickerEl);
    }
    
    testLocalStorage = function() {
        var foo = 'foo';
        try {
            localStorage.setItem(foo, foo);
            localStorage.removeItem(foo);
            return true;
        } catch (e) {
            return false;
        }
    }
    
    onAddNoteBtnClick = function() {
        createNote();
    }
    
    init = function() {
        
        if(!testLocalStorage) {
            var message = "Cannot use localStorage";
            
            saveNote = function() {
                console.warn(message);
            }
            
            deleteNote = function() {
                console.warn(message);
            }
            
        } else {
            saveNote = function(note) {
                localStorage.setItem(note.id, JSON.stringify(note));
            }
            
            deleteNote = function(note) {
                localStorage.removeItem(note.id);
            }
            
            loadNotes = function() {
                for(var i = 0; i < localStorage.length; i++) {
                    var noteObject = JSON.parse(localStorage.getItem(localStorage.key(i)));
                    createNote(noteObject);
                }
            }
            
            loadNotes();
        }
        
        addNoteBtnEl = document.querySelector('.addNoteBtn');
        addNoteBtnEl.addEventListener('click', onAddNoteBtnClick, false);
        document.addEventListener('mousemove', onDrag, false);
        document.addEventListener('mouseup', onDragEnd, false);
    }
    
    init();
    
    
});