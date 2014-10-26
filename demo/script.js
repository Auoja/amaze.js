function startDemo() {

    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext('2d');
    // Fix for anti-aliasing
    ctx.translate(0.5, 0.5);
    ctx.lineWidth = 0.5;

    var width = 20;
    var height = 20;
    var unit_x = canvas.width / width;
    var unit_y = canvas.height / height;

    var maze = new Maze();
    maze.generate();

    var chambers = maze.getChambers();

    function render() {

        chambers.forEach(function(chamber) {
            ctx.beginPath();
            ctx.strokeStyle = "black";
            ctx.rect(chamber._x * unit_x, chamber._y * unit_y, chamber._w * unit_x, chamber._h * unit_y);
            ctx.closePath();
            ctx.stroke();
        });

    }

    render();

}