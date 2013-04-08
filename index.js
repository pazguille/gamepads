(function(e){'use strict';function t(){this.collection={};this.maxListeners=10}t.prototype.addListener=function(e,t,n){if(e===undefined){throw new Error('jvent - "addListener(event, listener)": It should receive an event.')}if(t===undefined){throw new Error('jvent - "addListener(event, listener)": It should receive a listener function.')}var r=this.collection;t.once=n||false;if(r[e]===undefined){r[e]=[]}if(r[e].length+1>this.maxListeners&&this.maxListeners!==0){throw new Error("Warning: So many listeners for an event.")}r[e].push(t);this.emit("newListener");return this};t.prototype.on=t.prototype.addListener;t.prototype.once=function(e,t){this.on(e,t,true);return this};t.prototype.removeListener=function(e,t){if(e===undefined){throw new Error('jvent - "removeListener(event, listener)": It should receive an event.')}if(t===undefined){throw new Error('jvent - "removeListener(event, listener)": It should receive a listener function.')}var n=this.collection[e],r=0,i;if(n!==undefined){i=n.length;for(r;r<i;r+=1){if(n[r]===t){n.splice(r,1);break}}}return this};t.prototype.off=t.prototype.removeListener;t.prototype.removeAllListeners=function(e){if(e===undefined){throw new Error('jvent - "removeAllListeners(event)": It should receive an event.')}delete this.collection[e];return this};t.prototype.setMaxListeners=function(e){if(isNaN(e)){throw new Error('jvent - "setMaxListeners(n)": It should receive a number.')}this.maxListeners=e;return this};t.prototype.listeners=function(e){if(e===undefined){throw new Error('jvent - "listeners(event)": It should receive an event.')}return this.collection[e]};t.prototype.emit=function(){var e=Array.prototype.slice.call(arguments,0),t=e.shift(),n,r=0,i;if(t===undefined){throw new Error('jvent - "emit(event)": It should receive an event.')}if(typeof t==="string"){t={type:t}}if(!t.target){t.target=this}if(this.collection[t.type]!==undefined){n=this.collection[t.type];i=n.length;for(r;r<i;r+=1){n[r].apply(this,e);if(n[r].once){this.off(t.type,n[r]);i-=1;r-=1}}}return this};if(typeof e.define==="function"&&e.define.amd!==undefined){e.define("Jvent",[],function(){return t})}else if(typeof module!=="undefined"&&module.exports!==undefined){module.exports=t}else{e.Jvent=e.EventEmitter=t}})(this);
(function (window) {
    'use strict';

    window.requestAnimationFrame = window.webkitRequestAnimationFrame;

    var PS3 = {
        'buttons': [
            'CROSS',
            'CIRCLE',
            'SQUARE',
            'TIRANGLE',
            'L1',
            'R1',
            'L2',
            'R2',
            'SELECT',
            'START',
            'L3',
            'R3',
            'UP',
            'DOWN',
            'LEFT',
            'RIGHT',
            'PS'
        ],
        'sticks': [
            'LEFT_STICK_X',
            'LEFT_STICK_Y',
            'RIGHT_STICK_X',
            'RIGHT_STICK_Y'
        ]
    };

    function Gamepads() {
        this.ports = [];
        this.updateStatus();

        return this;
    }

    Gamepads.prototype._THRESHOLD = 0.1;

    Gamepads.prototype._getGamepads = function () {
        if (navigator.webkitGetGamepads) {
            return navigator.webkitGetGamepads();
        }
    };

    Gamepads.prototype.updateStatus = function () {

        var that = this,
            gamepads = this._getGamepads(),
            pad,
            key,
            i = 0;

        for (key in gamepads) {

            if (this.ports[key] === undefined) {
                this.ports[key] = new Jvent();
                this.ports[key].pad = gamepads[key];
                this.ports[key].currentButtons = [];
            }

            pad = gamepads[key];

            if (typeof pad === 'object') {

                for (i; i < pad.buttons.length; i += 1) {

                    if (pad.buttons[i] === 1) {
                        this.ports[key].emit('down', PS3.buttons[i]);
                        this.ports[key].currentButtons.push(PS3.buttons[i]);

                    } else if (pad.buttons[i] === 0 && this.ports[key].currentButtons.indexOf(PS3.buttons[i]) !== -1) {
                        this.ports[key].currentButtons.splice(this.ports[key].currentButtons.indexOf(PS3.buttons[i]), 1);
                        this.ports[key].emit('up', PS3.buttons[i]);
                    }

                }

                for (var i = 0; i < pad.axes.length; i += 1) {
                    if (pad.axes[i] > this._THRESHOLD || pad.axes[i] < -this._THRESHOLD) {
                        this.ports[key].emit('stickmove', PS3.sticks[i], pad.axes[i]);
                    }
                }
            }
        }

        window.requestAnimationFrame(function () {
            that.updateStatus();
        });
    };

    window.Gamepads = Gamepads;

}(this));