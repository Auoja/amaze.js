'use strict';

(function(window) {

    var Maze = (function() {

        var TOP_LEFT_CHAMBER = 0;
        var TOP_RIGHT_CHAMBER = 1;
        var BOTTOM_LEFT_CHAMBER = 2;
        var BOTTOM_RIGHT_CHAMBER = 3;

        var TOP = 0;
        var BOTTOM = 1;
        var LEFT = 2;
        var RIGHT = 3;

        var HORIZONTAL = 0;
        var VERTICAL = 1;

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

        function Line(x1, y1, x2, y2) {
            this.x1 = x1;
            this.y1 = y1;
            this.x2 = x2;
            this.y2 = y2;
        }

        Line.prototype.subdivide = function() {
            var lines = [];
            if (this.x1 - this.x2 === 0) {
                var y = this.y1;
                while (y !== this.y2) {
                    lines.push(new Line(this.x1, y, this.x2, y + 1));
                    y++;
                }
            } else {
                var x = this.x1;
                while (x !== this.x2) {
                    lines.push(new Line(x, this.y1, x + 1, this.y2));
                    x++;
                }
            }
            return lines;
        };

        Line.prototype.compareLines = function(line) {
            return ((this.x1 === line.x1) &&
                (this.x2 === line.x2) &&
                (this.y1 === line.y1) &&
                (this.y2 === line.y2));
        };

        function Door(x, y, type) {
            this._x = x;
            this._y = y;
            this._w = type === HORIZONTAL ? 1 : 0;
            this._h = type === VERTICAL ? 1 : 0;
            this._type = type;
        }

        Door.prototype.isChamberDoor = function(chamber) {
            if (this._x === chamber._x || this._x === chamber._x + chamber._w) {
                if (this._y <= chamber._y + chamber._h && this._y >= chamber._y) {
                    return true;
                }
            } else if (this._y === chamber._y || this._y === chamber._y + chamber._h) {
                if (this._x <= chamber._x + chamber._w && this._x >= chamber._x) {
                    return true;
                }
            }
            return false;
        };

        Door.prototype.convertToLine = function() {
            return new Line(this._x, this._y, this._x + this._w, this._y + this._h);
        };

        function Chamber(x, y, w, h, doors) {
            this._x = x;
            this._y = y;
            this._w = w;
            this._h = h;

            this._doors = doors || [];
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

        Chamber.prototype.createDoors = function(splitWidth, splitHeight) {
            var doorList = [];

            var topDoor = randomInterval(0, splitHeight - 1);
            var bottomDoor = randomInterval(splitHeight, this._h - 1);
            var leftDoor = randomInterval(0, splitWidth - 1);
            var rightDoor = randomInterval(splitWidth, this._w - 1);

            doorList[0] = new Door(this._x + splitWidth, this._y + topDoor, VERTICAL);
            doorList[1] = new Door(this._x + splitWidth, this._y + bottomDoor, VERTICAL);
            doorList[2] = new Door(this._x + leftDoor, this._y + splitHeight, HORIZONTAL);
            doorList[3] = new Door(this._x + rightDoor, this._y + splitHeight, HORIZONTAL);

            var noDoor = Math.floor(Math.random() * 3);

            doorList.splice(noDoor, 1);

            return doorList;
        };

        Chamber.prototype.divide = function(chambers, doors) {
            if (this._w === 1 || this._h === 1) {
                chambers.push(this);
                return;
            }

            var splitChambers = [];
            var splitWidth = this.getHorizontalWall();
            var splitHeight = this.getVerticalWall();

            this._doors = this._doors.concat(this.createDoors(splitWidth, splitHeight));

            splitChambers[TOP_LEFT_CHAMBER] = new Chamber(this._x, this._y, splitWidth, splitHeight);
            splitChambers[TOP_RIGHT_CHAMBER] = new Chamber(splitWidth + this._x, this._y, this._w - splitWidth, splitHeight);
            splitChambers[BOTTOM_LEFT_CHAMBER] = new Chamber(this._x, this._y + splitHeight, splitWidth, this._h - splitHeight);
            splitChambers[BOTTOM_RIGHT_CHAMBER] = new Chamber(splitWidth + this._x, this._y + splitHeight, this._w - splitWidth, this._h - splitHeight);

            splitChambers.forEach(function(chamber) {
                this._doors.forEach(function(door) {
                    if (door.isChamberDoor(chamber)) {
                        chamber.addDoor(door);
                    }
                }, this);
                chamber.divide(chambers);
            }, this);

        };

        Chamber.prototype.getHorizontalDoors = function() {
            var result = result = this._doors.filter(function(door) {
                return door._type === HORIZONTAL;
            });

            function compare(a, b) {
                return a.x - b.x;
            }

            result = result.sort(compare);

            return result;
        };

        Chamber.prototype.getVerticalDoors = function() {
            var result = result = this._doors.filter(function(door) {
                return door._type === VERTICAL;
            });

            function compare(a, b) {
                return a.y - b.y;
            }

            result = result.sort(compare);

            return result;
        };

        Chamber.prototype.getDoorSegments = function() {

            var result = [];

            result[TOP] = [];
            result[BOTTOM] = [];
            result[LEFT] = [];
            result[RIGHT] = [];

            var horizontalDoors = this.getHorizontalDoors();
            var verticalDoors = this.getVerticalDoors();

            if (horizontalDoors) {
                horizontalDoors.forEach(function(door) {
                    if (door._y === this._y) {
                        result[TOP].push(door.convertToLine());
                    } else {
                        result[BOTTOM].push(door.convertToLine());
                    }
                }, this);
            }

            if (verticalDoors) {
                verticalDoors.forEach(function(door) {
                    if (door._x === this._x) {
                        result[LEFT].push(door.convertToLine());
                    } else {
                        result[RIGHT].push(door.convertToLine());
                    }
                }, this);
            }

            return result;
        };

        Chamber.prototype.getWallSegments = function() {
            var result = [];

            result[TOP] = new Line(this._x, this._y, this._x + this._w, this._y).subdivide();
            result[LEFT] = new Line(this._x, this._y, this._x, this._y + this._h).subdivide();
            result[RIGHT] = new Line(this._x + this._w, this._y, this._x + this._w, this._y + this._h).subdivide();
            result[BOTTOM] = new Line(this._x, this._y + this._h, this._x + this._w, this._y + this._h).subdivide();

            return result;
     };

        Chamber.prototype.getLines = function() {
            var lines = [];

            var doors = this.getDoorSegments();
            var walls = this.getWallSegments();

            function getLines(sublines, doorList, result) {
                result = sublines.filter(function(sub) {
                    var found = false;
                    doorList.forEach(function(door) {
                        if (door.compareLines(sub)) {
                            found = true;
                        }
                    });
                    return !found;
                });
                return result;
            }

            for (var direction = 0; direction < 4; direction++) {
                lines = lines.concat(getLines(walls[direction], doors[direction], lines));
            };


            return lines;
        }

        function Maze(settings) {
            settings = extend(defaultSettings, settings);

            var entry = new Door(0, 0, VERTICAL);
            var exit = new Door(settings.width, settings.height - 1, VERTICAL);

            var _root = new Chamber(0, 0, settings.width, settings.height, [entry, exit]);
            var _chamberList = [];

            this.generate = function() {
                _root.divide(_chamberList);
            };

            this.getChambers = function() {
                return _chamberList;
            };

            this.getLines = function() {
                var lines = [];
                _chamberList.forEach(function(chamber) {
                    lines = lines.concat(chamber.getLines());
                });
                return lines;
            };

            return this;
        }

        return Maze;

    })();

    if (typeof module === 'object' && module && typeof module.exports === 'object') {
        module.exports = Maze;
    } else {
        window.Maze = Maze;
    }

})(this);