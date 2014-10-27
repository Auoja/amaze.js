function startDemo() {

    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    ctx.lineCap = 'square';
    ctx.strokeStyle = 'black';

    var mazeWidth = 70;
    var mazeHeight = 50;
    var offset = 50;

    var unit_x = (canvas.width - 2 * offset) / mazeWidth;
    var unit_y = (canvas.height - 2 * offset) / mazeHeight;

    var maze = new Maze({
        width: mazeWidth,
        height: mazeHeight
    });

    maze.generate();

    maze.getLines().forEach(function(line) {
        ctx.beginPath();
        ctx.moveTo(offset + line.x1 * unit_x, offset + line.y1 * unit_y);
        ctx.lineTo(offset + line.x2 * unit_x, offset + line.y2 * unit_y);
        ctx.closePath();
        ctx.stroke();
    });

}