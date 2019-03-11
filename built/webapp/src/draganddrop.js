"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function setupDragAndDrop(r, filter, dragged) {
    var dragAndDrop = document && document.createElement && 'draggable' in document.createElement('span');
    r.addEventListener('paste', function (e) {
        if (e.clipboardData) {
            // has file?
            var files = pxt.Util.toArray(e.clipboardData.files).filter(filter);
            if (files.length > 0) {
                e.stopPropagation(); // Stops some browsers from redirecting.
                e.preventDefault();
                dragged(files);
            }
            else if (e.clipboardData.items && e.clipboardData.items.length > 0) {
                var f = e.clipboardData.items[0].getAsFile();
                if (f) {
                    e.stopPropagation(); // Stops some browsers from redirecting.
                    e.preventDefault();
                    dragged([f]);
                }
            }
        }
    });
    r.addEventListener('dragover', function (e) {
        var types = e.dataTransfer.types;
        var found = false;
        for (var i = 0; i < types.length; ++i)
            if (types[i] == "Files")
                found = true;
        if (found) {
            if (e.preventDefault)
                e.preventDefault(); // Necessary. Allows us to drop.
            e.dataTransfer.dropEffect = 'copy'; // See the section on the DataTransfer object.
            return false;
        }
        return true;
    }, false);
    r.addEventListener('drop', function (e) {
        var files = pxt.Util.toArray(e.dataTransfer.files);
        if (files.length > 0) {
            e.stopPropagation(); // Stops some browsers from redirecting.
            e.preventDefault();
            dragged(files);
        }
        return false;
    }, false);
    r.addEventListener('dragend', function (e) {
        return false;
    }, false);
}
exports.setupDragAndDrop = setupDragAndDrop;
