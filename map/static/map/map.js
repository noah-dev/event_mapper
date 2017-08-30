var map
var zoom = 11
var kcmo = {lat: 39.1, lng: -94.6};
var meetups 
var meetups_loaded = 0

$(function() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: zoom,
        center: kcmo
    });
    get_data()
    populate_map()
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
};

function get_data(){
    $.ajax({
        url: 'meetups_data/',
        data: {
        },
        dataType: 'json',
        success: function (data) {
            meetups = data; 
        }
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
            var offset = 50; 
            meetups.forEach(meetup =>{
                setTimeout(_=>{add_marker(meetup['title'], meetup['desc'], meetup['lat'], meetup['lng']);}, offset);
                offset += 50;
            });
            
        }
    });
}

/*
function make_info_window(){
    
}
*/