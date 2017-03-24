// This example adds a user-editable rectangle to the map.
// When the user changes the bounds of the rectangle,
// an info window pops up displaying the new bounds.

var rectangle;
var map;
var index = 0;
var rectangleArray = [];
// Made so it's actually 2x3 meters.
var hardCodedBounds = {
    north: 50.82172634708248,
    south: 50.821711139454614,
    east: 4.39410772259771,
    west: 4.394067100813345
};





function initMap() {
    map = new google.maps.Map(document.getElementById('map'),
        {
            // This coordinates are for university of Brussels (at the moment of development UCLL google maps had no floor plans)
            center: { lat: 50.8215461, lng: 4.3947481 },
            zoom: 20,
            zoomControl: true,
            scaleControl: true,
            mapTypeControl: true,
            rotateControl: true,
            fullScreenControl: true,
            streetViewControl: true
        });


}

function createRectangle() {
    // Define the rectangle and set its editable property to true.
    rectangle = new google.maps.Rectangle({
        bounds: hardCodedBounds,
        editable: false,
        draggable: true,
        clickable: true

    });
    rectangle.name = "UCLL";
    rectangle.id = index;
    index = index + 1;
    rectangle.available = true;
    rectangle.setMap(map);
    rectangle.setAvailable = function (available) {
        var color = "Green";
        if (!available) {
            color = "Red";
            this.available = false;
            document.getElementById("btnBook").style.visibility = "hidden";

        }
        this.setOptions({ fillColor: color });
        this.setOptions({ strokeColor: color });


    }
    // Define an info window on the map.
    var infoWindow;

    infoWindow = new google.maps.InfoWindow();


    // Add an event listener on the rectangle.
    rectangle.setAvailable(true);
    rectangle.addListener('bounds_changed', function () {
        infoWindow.close();
    });
    rectangle.addListener('click', function () {
        if (this.available === true) {
            infoWindow.setContent("<b>Company name:" + this.name + " " + this.id + " </b><br>" +
                "<input type='button' id='btnBook' value='Register' onclick='registerCompany(" + this.id + ")'/> ");
        }
        else {
            infoWindow.setContent("<b>Company name:" + this.id + " </b><br>");
        }
        infoWindow.setPosition(this.getBounds().getNorthEast());
        infoWindow.open(map, rectangle);

    });

    // assuming you also want to hide the infowindow when user mouses-out


    rectangleArray.push(rectangle);
}

function registerCompany(ID) {

    var myRectangle = rectangleArray[ID];

    myRectangle.setAvailable(false);

}





// function moveInfoWindow(event)
// {
//     infoWindow.setPosition(rectangle.getBounds().getNorthEast());
// }


function getRectangleCoords(rectangle) {
    var coords = [
        { lat: rectangle.getBounds().getNorthEast().lat(), lng: rectangle.getBounds().getNorthEast().lng() },
        //{ lat: rectangle.getBounds().getNorthEast().lat(), lng: rectangle.getBounds().getSouthWest().lng() },
        { lat: rectangle.getBounds().getSouthWest().lat(), lng: rectangle.getBounds().getSouthWest().lng() }
        //{ lat: rectangle.getBounds().getSouthWest().lat(), lng: rectangle.getBounds().getNorthEast().lng() }
    ];
    var coordsText = "Coords: " + rectangle.getBounds().getNorthEast().lat() + ' ' + rectangle.getBounds().getNorthEast().lng() + ' ' + rectangle.getBounds().getSouthWest().lat() + ' ' + rectangle.getBounds().getSouthWest().lng();
    return coordsText;
}

function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}

function buildString() {
    var stringBuilder = "";


    console.log(getRectangleCoords(rectangleArray[0]));

    for (var index = 0; index < rectangleArray.length; index++) {
        stringBuilder += "Rectangle number: " + index + " " + getRectangleCoords(rectangleArray[index])
            + " ; " + rectangleArray[index].available + "\r\n";
    }
    console.log(stringBuilder);
    return stringBuilder;
}

