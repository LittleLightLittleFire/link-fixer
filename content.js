// Inject code into the page to access the underlying JavaScript objects
// https://stackoverflow.com/questions/9515704/building-a-chrome-extension-inject-code-in-a-page-using-a-content-script
var actualCode = '(' + function() {
    'use strict';

    // Detect Google search page, same technique used here:
    // https://github.com/palant/searchlinkfix/blob/master/lib/content.js#L72
    function isSearch() {
        var google = window.google;
        return !(google && (google.sn || google.search));
    }

    var found = null;

    // Fix the links by adding a pair of mousedown handlers
    window.addEventListener('mousedown', function(event) {
        if (!isSearch(window)) {
            return;
        }

        // Find the <a> tag
        for (var curr = event.target;
                curr && curr.localName.toLowerCase() !== 'a';
                curr = curr.parentNode) {
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

    }, true);

    window.addEventListener('mousedown', function() {
        if (found) {
            found.element.href = found.href;
        }
    }, false);

} + ')();';
var script = document.createElement('script');
script.textContent = actualCode;
(document.head||document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
