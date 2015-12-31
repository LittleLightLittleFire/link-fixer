// A port of the Firefox extension
// https://github.com/palant/searchlinkfix/blob/master/data/content.js
var actualCode = '(' + function() {
    'use strict';

    var found = null;
    var restore = function() {
        try {
            if (found && ('getAttribute' in found.element) && found.element.getAttribute('href') !== found.href) {
                found.element.href = found.href;
            }
        } catch(e) {
            // ignored
        }
    };

    // Fix the links by adding a pair of mousedown handlers
    window.addEventListener('mousedown', function(e) {
        // Find the <a> tag
        var curr = null;
        for (curr = e.target;
             curr && curr.localName && curr.localName.toLowerCase() !== 'a';
             curr = curr.parentNode) {
        }

        // Verify it is in the search container, break out if the encrypted.google iframe if necessary
        var checked = false;
        if (curr) {
            var par = curr.parentNode;
            if (window.frameElement) {
                par = window.frameElement.parentNode;
            }

            for (; par && par.parentNode; par = par.parentNode) {
                if (('getAttribute' in par) && par.getAttribute('id') === 'search') {
                    checked = true;
                    break;
                }
            }
        }

        if (!checked) {
            curr = null;
        }

        // Didn't find it
        if (!curr) {
            found = null;
            return;
        }

        // Save the link location
        found = {
            'href': curr.href,
            'element': curr
        };

        // Restore even if event was cancelled
        setTimeout(restore, 0);
    }, true);

    window.addEventListener('mousedown', restore, false);

} + ')();';

// Inject code into the page to access the underlying JavaScript objects
// https://stackoverflow.com/questions/9515704/building-a-chrome-extension-inject-code-in-a-page-using-a-content-script
var script = document.createElement('script');
script.textContent = actualCode;
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
