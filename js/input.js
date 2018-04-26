
(function() {
    var pressedKeys = {};

    function setKey(event, status) {
        var code = event.keyCode;
        var key;

        switch(code) {
        case 32:
            key = 'SPACE'; break;
        case 37:
            key = 'LEFT'; break;
        case 38:
            key = 'UP'; break;
        case 39:
            key = 'RIGHT'; break;
        case 40:
            key = 'DOWN'; break;
        default:
            // Convert ASCII codes to letters
            key = String.fromCharCode(code);
        }

        pressedKeys[key] = status;
    }
    
    function setClick(event, status) {
        var buttonCode = event.button;
        var key;
        if(buttonCode == 0) key = 'CLICK';
        else key = String.fromCharCode(buttonCode);
        pressedKeys[key] = status;
    }
    
    function setTouch(event, status) {
        pressedKeys['CLICK'] = status;
    }
    
    document.onmousedown = function(){return false};

    document.addEventListener('keydown', function(e) {
        setKey(e, true);
    });

    document.addEventListener('keyup', function(e) {
        setKey(e, false);
    });
    
    document.addEventListener('mousedown', function(e) {
        setClick(e, true);
    });

    document.addEventListener('mouseup', function(e) {
        setClick(e, false);
    });
    
    document.addEventListener('touchstart', function(e) {
        setTouch(e, true);
    });
    
    document.addEventListener('touchend', function(e) {
        setTouch(e, false);
    });

    window.addEventListener('blur', function() {
        pressedKeys = {};
    });

    window.input = {
        isDown: function(key) {
            return pressedKeys[key.toUpperCase()];
        }
    };
})();