app = angular.module('map', ["ngSanitize",'g1b.datetime-range'])

app.controller('list', function($scope) {

    // Setup the angular-datetime-range element
    $scope.start = moment();
    $scope.end = moment().add(1, 'days').add(0, 'hours');
    var to 
    var from
    
    $scope.changedStart = function () {
        to_unix = moment($scope.start['d']).format("X");
    };
    $scope.changedEnd = function () {
        from_unix = moment($scope.end['d']).format("X");
    };


    var map
    var zoom = 11
    var kcmo = {lat: 39.1, lng: -94.6};
    var meetups 
    var markers = []
    
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: zoom,
        center: kcmo
    });

    $scope.populate_map = function(){
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
        markers = []
        load_data()
    }

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
