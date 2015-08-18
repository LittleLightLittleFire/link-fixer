var actualCode = '(' + function() {
    'use strict';

    // Detect Google search page, same technique used here:
    function googleProduct() {
        var google = window.google;
        return google ? google.sn : null;
    }

    var found = null;

    // Fix the links by adding a pair of mousedown handlers
    window.addEventListener('mousedown', function(e) {
        var product = googleProduct();
        if (!product) {
            return;
        }

        // Find the <a> tag
        var curr = null;
        for (curr = e.target;
                curr && curr.localName && curr.localName.toLowerCase() !== 'a';
                curr = curr.parentNode) {
        }

        // Didn't find it
        if (!curr) {
            found = null;
            return;
        }

        // Stop the propagation if it is images, since Google images stops the propagation
        if (product === 'images') {
            e.stopPropagation();
            return;
        }

        // Save the link location
        found = {
            'href': curr.href,
            'element': curr
        };
    }, true);

    window.addEventListener('mousedown', function() {
        if (found && ('getAttribute' in found.element) && found.element.getAttribute('data-href') === found.href) {
            found.element.href = found.href;
        }
    }, false);

} + ')();';

// Inject code into the page to access the underlying JavaScript objects
// https://stackoverflow.com/questions/9515704/building-a-chrome-extension-inject-code-in-a-page-using-a-content-script
var script = document.createElement('script');
script.textContent = actualCode;
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
