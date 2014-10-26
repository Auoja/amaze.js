'use strict';

(function(window) {

    var Maze = (function() {

        var TOP_LEFT_CHAMBER = 0;
        var TOP_RIGHT_CHAMBER = 1;
        var BOTTOM_LEFT_CHAMBER = 2;
        var BOTTOM_RIGHT_CHAMBER = 3;

        var defaultSettings = {
            width: 20,
            height: 20
        };

        function extend(defaults, options) {
            var extended = {};
            var prop;
            for (prop in defaults) {
                if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
                    extended[prop] = defaults[prop];
                }
            }
            for (prop in options) {
                if (Object.prototype.hasOwnProperty.call(options, prop)) {
                    extended[prop] = options[prop];
                }
            }
            return extended;
        }

        function Chamber(x, y, w, h) {
            this._x = x;
            this._y = y;
            this._w = w;
            this._h = h;

            this._chambers = [];
        }

        Chamber.prototype.getHorizontalWall = function() {
            return Math.floor(Math.random() * (this._w - 1) + 1);
        };

        Chamber.prototype.getVerticalWall = function() {
            return Math.floor(Math.random() * (this._h - 1) + 1);
        };

        Chamber.prototype.divide = function(chambers) {
            if (this._w === 1 || this._h === 1) {
                chambers.push(this);
                return;
            }

            var splitWidth = this.getHorizontalWall();
            var splitHeight = this.getVerticalWall();

            this._chambers[TOP_LEFT_CHAMBER] = new Chamber(this._x, this._y, splitWidth, splitHeight).divide(chambers);
            this._chambers[TOP_RIGHT_CHAMBER] = new Chamber(splitWidth + this._x, this._y, this._w - splitWidth, splitHeight).divide(chambers);
            this._chambers[BOTTOM_LEFT_CHAMBER] = new Chamber(this._x, this._y + splitHeight, splitWidth, this._h - splitHeight).divide(chambers);
            this._chambers[BOTTOM_RIGHT_CHAMBER] = new Chamber(splitWidth + this._x, this._y + splitHeight, this._w - splitWidth, this._h - splitHeight).divide(chambers);
        }

        function Maze(settings) {
            settings = extend(defaultSettings, settings);

            var _root = new Chamber(0, 0, settings.width, settings.height);
            var _chamberList = [];

            this.generate = function() {
                _root.divide(_chamberList);
            };

            this.getChambers = function() {
                return _chamberList;
            };
        }

        return Maze;

    })();

    if (typeof module === 'object' && module && typeof module.exports === 'object') {
        module.exports = Maze;
    } else {
        window.Maze = Maze;
    }

})(this);