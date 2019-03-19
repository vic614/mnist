var canvas = document.getElementById("paint");
var ctx = canvas.getContext('2d');
var sketch = document.getElementById("sketch");
var sketch_style = getComputedStyle(sketch);

canvas.width = 280;
canvas.height = 280;

var mouse = {x: 0, y: 0};

/* Mouse Capturing Work */
canvas.addEventListener('mousemove', function (e) {
    mouse.x = e.pageX - this.offsetLeft;
    mouse.y = e.pageY - this.offsetTop;
    var offsetLeft = this.offsetLeft;
    var offsetTop = this.offsetTop;
    document.body.onmousemove = function (e) {
        var test_x = e.clientX - offsetLeft;
        var test_y = e.clientY - offsetTop;
        if (test_x < 0 || test_x > canvas.width || test_y < 0 || test_y > canvas.height) {
            canvas.removeEventListener('mousemove', onPaint, false)
        }
    };

}, false);

/* Drawing on Paint App */
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.lineWidth = 18;
ctx.strokeStyle = "white";


canvas.addEventListener('mousedown', function () {
    ctx.beginPath();
    ctx.moveTo(mouse.x, mouse.y);
    canvas.addEventListener('mousemove', onPaint, false);
}, false);


canvas.addEventListener('mouseup', function () {
    canvas.removeEventListener('mousemove', onPaint, false);
}, false);


var onPaint = function () {
    ctx.lineTo(mouse.x, mouse.y);
    ctx.stroke();
};


function redraw() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clears the canvas
    $("#result").html("<p align=\"center\">Draw a digit</p>");
}

function getdata() {
    var data_array = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var pixels = data_array.data;
    var w = data_array.width;
    var h = data_array.height;

    var l = w * h;
    var array = [];
    for (var i = 0; i < l; i++) {
        // get color of pixel
        var r = pixels[i * 4]; // Red

        // get the position of pixel
        var y = parseInt(i / w, 10);
        if (!array[y]) {
            array.push([y])
        }
        var x = i - y * w;
        array[y][x] = r
    }
    $.ajax({
        url: '/predict',
        type: 'POST',
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            "array": array
        }),
        success: function (data) {
            $("#result").html("<p align=\"center\"> Result is:" + data['digit']+ ". Confidence:" +data['confidence']+" </p>");
            console.log(data)
        }
    })
}

$("#submit").click(function () {
    $("#result").html("<p align=\"center\">Predicting...</p>");
    getdata()
});