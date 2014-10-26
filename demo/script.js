function startDemo() {

    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    // Fix for anti-aliasing
    ctx.translate(0.5, 0.5);
    ctx.lineWidth = 0.5;

    var mazeWidth = 16;
    var mazeHeight = 12;
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

        chambers.forEach(function(chamber) {
            ctx.beginPath();
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 1;
            ctx.rect(chamber._x * unit_x, chamber._y * unit_y, chamber._w * unit_x, chamber._h * unit_y);
            ctx.closePath();
            ctx.stroke();
            chamber._doors.forEach(function(door) {
                ctx.beginPath();
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 3;
                ctx.moveTo(door._x * unit_x, door._y * unit_y);
                ctx.lineTo((door._x + door._w) * unit_x, (door._y + door._h) * unit_y);
                ctx.closePath();
                ctx.stroke();
            });
        });
    }

    render();

}