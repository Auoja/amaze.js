function startDemo() {

    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    var mazeWidth = 80;
    var mazeHeight = 60;
    var unit_x = canvas.width / mazeWidth;
    var unit_y = canvas.height / mazeHeight;

    var maze = new Maze({
        width: mazeWidth,
        height: mazeHeight
    });
    maze.generate();

    var chambers = maze.getChambers();

    function render() {
        ctx.lineCap = 'square';
        ctx.strokeStyle = 'black';

        chambers.forEach(function(chamber) {
            chamber.getLines().forEach(function(line) {
                ctx.beginPath();
                ctx.moveTo(line.x1 * unit_x, line.y1 * unit_y);
                ctx.lineTo(line.x2 * unit_x, line.y2 * unit_y);
                ctx.closePath();
                ctx.stroke();
            });
        });
    }

    render();

}