app = angular.module('map', ['ngSanitize'])

app.filter('htmlToPlaintext', function() {
    return function(text) {
      return  text ? String(text).replace(/<[^>]+>/gm, '') : '';
    };
  }
);
app.controller('list', function($scope) {
    var map
    var zoom = 11
    var kcmo = {lat: 39.1, lng: -94.6};
    var meetups 
    var markers = []
    
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: zoom,
        center: kcmo
    });
    load_data()

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

    function load_data(){
        //Setup the ajax request and send it off - handled by urls.py
        $.ajax({
            url: 'meetups_data/',
            data: {
            },
            dataType: 'json',
            success: function (data) {
                meetups = data

                $scope.$apply(_=> {
                    $scope.meetups = meetups;
                });
                meetups.forEach(meetup =>{
                    add_marker(meetup['title'], meetup['desc'], meetup['lat'], meetup['lng'])
                });
            }
        });
    }


});
