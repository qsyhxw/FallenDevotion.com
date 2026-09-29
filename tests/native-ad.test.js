'use strict';

const assert = require('node:assert/strict');
const path = require('node:path');

const state = { iframe: false, text: '' };
const attributes = new Map();
let observerCallback;

const providerScript = {
    addEventListener() {}
};

const slot = {
    hidden: false,
    setAttribute(name, value) { attributes.set(name, value); },
    removeAttribute(name) { attributes.delete(name); },
    querySelector() { return providerScript; }
};

const container = {
    get textContent() { return state.text; },
    closest() { return slot; },
    querySelector() { return state.iframe ? {} : null; },
    querySelectorAll() { return []; }
};

global.document = {
    getElementById(id) {
        return id === 'container-a3d1be22613c0ecbd6b30d1432efb7f0' ? container : null;
    }
};

global.window = {
    clearTimeout() {},
    setTimeout(callback) {
        callback();
        return 1;
    }
};

global.MutationObserver = class MutationObserver {
    constructor(callback) { observerCallback = callback; }
    observe() {}
};

require(path.join(__dirname, '..', 'assets', 'native-ad.js'));

assert.equal(slot.hidden, true, 'empty or blocked ad remains hidden');
assert.equal(attributes.has('data-ad-state'), false, 'hidden ad has no visible-state styling');

state.iframe = true;
observerCallback();
assert.equal(slot.hidden, false, 'delayed iframe insertion reveals the ad');
assert.equal(attributes.get('data-ad-state'), 'ready', 'loaded ad receives visible-state styling');

state.iframe = false;
observerCallback();
assert.equal(slot.hidden, true, 'removed or unfilled ad hides again');
assert.equal(attributes.has('data-ad-state'), false, 'removed ad leaves no visible-state styling');

console.log('native-ad behavior checks passed');
