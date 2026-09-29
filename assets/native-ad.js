(function () {
    'use strict';

    var containerId = 'container-a3d1be22613c0ecbd6b30d1432efb7f0';
    var container = document.getElementById(containerId);
    if (!container) return;

    var slot = container.closest('[data-native-ad]');
    if (!slot) return;

    var revealTimer;
    var visible = false;

    function hasAdContent() {
        if (container.querySelector('iframe, object, embed, video')) return true;

        var images = container.querySelectorAll('img');
        for (var i = 0; i < images.length; i += 1) {
            if (images[i].getAttribute('src')) return true;
        }

        var links = container.querySelectorAll('a');
        for (var j = 0; j < links.length; j += 1) {
            if (links[j].getAttribute('href')) return true;
        }

        return container.textContent.trim().length > 0;
    }

    function updateVisibility() {
        var ready = hasAdContent();
        if (ready === visible) return;
        visible = ready;

        if (ready) {
            slot.hidden = false;
            slot.setAttribute('data-ad-state', 'ready');
        } else {
            slot.hidden = true;
            slot.removeAttribute('data-ad-state');
        }
    }

    function scheduleCheck() {
        window.clearTimeout(revealTimer);
        revealTimer = window.setTimeout(updateVisibility, 250);
    }

    slot.hidden = true;
    new MutationObserver(scheduleCheck).observe(container, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true
    });

    var providerScript = slot.querySelector('script[src*="bauval.org/21/a3d1be22613c0ecbd6b30d1432efb7f0"]');
    if (providerScript) {
        providerScript.addEventListener('load', scheduleCheck);
        providerScript.addEventListener('error', updateVisibility);
    }

    scheduleCheck();
    window.setTimeout(updateVisibility, 3000);
    window.setTimeout(updateVisibility, 10000);
}());
