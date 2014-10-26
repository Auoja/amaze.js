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

        function randomInterval(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        }

        function Door(x, y, direction) {
            this._x = x;
            this._y = y;
            this._w = direction === 'horizontal' ? 1 : 0;
            this._h = direction === 'vertical' ? 1 : 0;
        }

        Door.prototype.isChamberDoor = function(chamber) {
            if (this._x === chamber._x || this._x === chamber._x + chamber._w) {
                if (this._y <= chamber._y + chamber._h - 1 && this._y >= chamber._y) {
                    return true;
                }
            } else if (this._y === chamber._y || this._y === chamber._y + chamber._h) {
                if (this._x <= chamber._x + chamber._w - 1 && this._x >= chamber._x) {
                    return true;
                }
            }
            return false;
        };

        function Chamber(x, y, w, h, doors) {
            this._x = x;
            this._y = y;
            this._w = w;
            this._h = h;

            this._doors = [];

            this._chambers = [];
        }

        Chamber.prototype.addDoor = function(door) {
            this._doors.push(door);
        };

        Chamber.prototype.getHorizontalWall = function() {
            return randomInterval(1, this._w - 1);
        };

        Chamber.prototype.getVerticalWall = function() {
            return randomInterval(1, this._h - 1);
        };

        Chamber.prototype.getDoors = function(splitWidth, splitHeight) {
            var doorList = [];

            var topDoor = randomInterval(0, splitHeight - 1);
            var bottomDoor = randomInterval(splitHeight, this._h - 1);
            var leftDoor = randomInterval(0, splitWidth - 1);
            var rightDoor = randomInterval(splitWidth, this._w - 1);

            doorList[0] = new Door(this._x + splitWidth, this._y + topDoor, 'vertical');
            doorList[1] = new Door(this._x + splitWidth, this._y + bottomDoor, 'vertical');
            doorList[2] = new Door(this._x + leftDoor, this._y + splitHeight, 'horizontal');
            doorList[3] = new Door(this._x + rightDoor, this._y + splitHeight, 'horizontal');

            var noDoor = Math.floor(Math.random() * 3);

            doorList.splice(noDoor, 1);

            return doorList;
        };

        Chamber.prototype.divide = function(chambers, doors) {
            if (this._w === 1 || this._h === 1) {
                chambers.push(this);
                return;
            }

            var splitWidth = this.getHorizontalWall();
            var splitHeight = this.getVerticalWall();

            this._doors = this._doors.concat(this.getDoors(splitWidth, splitHeight));

            this._chambers[TOP_LEFT_CHAMBER] = new Chamber(this._x, this._y, splitWidth, splitHeight); //.divide(chambers, doors);
            this._chambers[TOP_RIGHT_CHAMBER] = new Chamber(splitWidth + this._x, this._y, this._w - splitWidth, splitHeight); //.divide(chambers, doors);
            this._chambers[BOTTOM_LEFT_CHAMBER] = new Chamber(this._x, this._y + splitHeight, splitWidth, this._h - splitHeight); //.divide(chambers, doors);
            this._chambers[BOTTOM_RIGHT_CHAMBER] = new Chamber(splitWidth + this._x, this._y + splitHeight, this._w - splitWidth, this._h - splitHeight); //.divide(chambers, doors);

            this._chambers.forEach(function(chamber) {
                this._doors.forEach(function(door) {
                    if (door.isChamberDoor(chamber)) {
                        chamber.addDoor(door);
                    }
                }, this);
                chamber.divide(chambers);
            }, this);

        }

        function Maze(settings) {
            settings = extend(defaultSettings, settings);

            var _root = new Chamber(0, 0, settings.width, settings.height, null);
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