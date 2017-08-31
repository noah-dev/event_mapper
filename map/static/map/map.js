app = angular.module('map', ["ngSanitize",'g1b.datetime-range'])

app.controller('list', function($scope) {

    // Setup the angular-datetime-range element
    $scope.start = moment();
    $scope.end = moment().add(1, 'days').add(0, 'hours');

    // If date changes, update unix variables
    var to_unix = moment($scope.start['_d']).unix();
    var from_unix = moment($scope.end['_d']).unix();
    $scope.changedStart = function () {
        to_unix = moment($scope.start['_d']).unix();
        console.log($scope.start['_d'], to_unix)
    };
    $scope.changedEnd = function () {
        from_unix = moment($scope.end['_d']).unix();
        console.log($scope.start['_d'], from_unix)
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
    var infowindow = new google.maps.InfoWindow({})

    $scope.$watch('filtered_meetups', function(display_meetups) {
        console.log($scope.filtered_meetups)
        console.log(markers)

        for (var i = 0; i < markers.length; i++) {
            markers[i]['marker'].setMap(null);
        }
        for (var i = 0; i < $scope.filtered_meetups.length; i++) {
            markers[$scope.filtered_meetups[i]['index']]['marker'].setMap(map);
        }
    });
    
    $scope.populate_map = function(){
        for (var i = 0; i < markers.length; i++) {
            markers[i]['marker'].setMap(null);
        }
        markers = []
        load_data(to_unix, from_unix)
    }

    function add_marker(index, title, desc, lat, lng){
        var marker = new google.maps.Marker({
            position: {lat: lat, lng: lng},
            title: title
        });
        
        marker.setMap(map);
        marker.addListener('click', function(){
            infowindow.setContent(desc);
            infowindow.open(map, marker);
        });
        markers.push({'index':index, 'marker':marker})
    };

    function load_data(to, from){
        //Setup the ajax request and send it off - handled by urls.py
        $.ajax({
            url: 'meetups_data/',
            data: {
                'to_time': to,
                'from_time': from,
            },
            dataType: 'json',

            success: function (data) {
                meetups = data

                $scope.$apply(_=> {
                    $scope.meetups = meetups;
                });
                meetups.forEach(meetup =>{
                    add_marker(meetup['index'], meetup['title'], meetup['desc'], meetup['lat'], meetup['lng'])
                });
            }
        });
    }


});
