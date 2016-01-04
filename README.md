# amaze.js

A maze generator.

## Usage

```javascript

	var maze = new Maze({
		width: 40,
		height: 30
	});
	
	maze.generate();
	
	// Render
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
	var lines = maze.getLines(); // The walls of the maze
	
	lines.forEach(function(line) {
		ctx.beginPath();
		ctx.moveTo(line.x1, line.y1);
		ctx.lineTo(line.x2, line.y2);
		ctx.closePath();
		ctx.stroke();
	});
	
```