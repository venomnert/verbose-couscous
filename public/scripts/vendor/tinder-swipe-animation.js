'use strict';

var $VIEW = document.querySelector('.view');
function whichTransitionEvent() {
    var t;
    var el = document.createElement('fakeelement');
    var transitions = {
        'animation': 'animationend',
        'OAnimation': 'oAnimationEnd',
        'MozAnimation': 'mozAnimationEnd',
        'WebkitAnimation': 'webkitAnimationEnd'
    };
    for (t in transitions) {
        if (el.style[t] !== undefined) {
            return transitions[t];
        }
    }
}
/* Listen for a transition! */
var transitionEvent = whichTransitionEvent();
$VIEW.addEventListener(transitionEvent, function (e) {
    e.target.remove();
    getPerson();
});
function add(name) {
    $VIEW.children[0].className += ' ' + name;
}