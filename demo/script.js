function startDemo() {

    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    var width = 20;
    var height = 20;
    var unit_x = canvas.width / width;
    var unit_y = canvas.height / height;

    var maze = new Maze();
    maze.generate();

    var chambers = maze.getChambers();
    var doors = maze.getDoors();

    function render() {

        chambers.forEach(function(chamber) {
            ctx.beginPath();
            ctx.strokeStyle = 'black';
            ctx.rect(chamber._x * unit_x, chamber._y * unit_y, chamber._w * unit_x, chamber._h * unit_y);
            ctx.closePath();
            ctx.stroke();
        });

        doors.forEach(function(door) {
            ctx.beginPath();
            ctx.strokeStyle = 'white';
            ctx.lineCap = 'square';
            ctx.lineWidth = 2;
            ctx.moveTo(door._x * unit_x, door._y * unit_y);
            ctx.lineTo((door._x + door._w) * unit_x, (door._y + door._h) * unit_y);
            ctx.closePath();
            ctx.stroke();
        });

    }

    render();

}