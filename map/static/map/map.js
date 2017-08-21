var map
var zoom = 11
var kcmo = {lat: 39.1, lng: -94.6};
var meetups 

$(function() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: zoom,
        center: kcmo
    });

    populate_map()

    /*
    google.maps.event.addListenerOnce(map, 'idle', function(){
        populate_map()
    });
    */
});

function add_marker(title, desc, lat, lng){
    var marker = new google.maps.Marker({
        position: {lat: lat, lng: lng},
        title: title
    });
    var infowindow = new google.maps.InfoWindow({
        content: desc
    })
    marker.setMap(map);
    marker.addListener('click', function(){
        infowindow.open(map, marker)
    });
}

function populate_map(){

    //Setup the ajax request and send it off - handled by urls.py
    $.ajax({
        url: 'meetups_data/',
        data: {
        },
        dataType: 'json',
        success: function (data) {
            meetups = data
            var offset = 100; 
            meetups.forEach(meetup =>{
                setTimeout(_=>{add_marker(meetup['title'], meetup['desc'] + " | " + meetup['date'], meetup['lat'], meetup['lng']);}, offset);
                offset += 100;

                // $("#meetup").append("<p>" + meetup['desc'] + " | " + meetup['date'] + "</p>")
            });
            
        }
    });
}