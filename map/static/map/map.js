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
    };
    $scope.changedEnd = function () {
        from_unix = moment($scope.end['_d']).unix();
    };

    //Updating the list
    var markers = []
    $scope.$watch('visible_meetups', function() {
        show_filtered_meetups();
    });
    function show_filtered_meetups(){
        if (markers.len = 0){
            for (var i = 0; i < markers.length; i++) {
                markers[i]['marker'].setMap(null);
            }
            for (var i = 0; i < $scope.visible_meetups.length; i++) {
                markers[$scope.visible_meetups[i]['index']]['marker'].setMap(map);
            }
        }
    }
    

    //Load Map upon page - defaults to next 24 hours
    populate_map_and_list()
    var map
    var zoom = 11
    var kcmo = {lat: 39.1, lng: -94.6};
    var meetups 
    
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: zoom,
        center: kcmo
    });
    var infowindow = new google.maps.InfoWindow({})

    $scope.populate = function(){
        populate_map_and_list()
    }

    function populate_map_and_list(){
        if (markers.len = 0){
            for (var i = 0; i < markers.length; i++) {
                markers[i]['marker'].setMap(null);
            }
        }
        markers = [];
        load_data(to_unix, from_unix);
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

                $scope.$apply( _=> {
                    $scope.meetups = meetups;

                    for (var i = 0; i < meetups.length; i++) {
                        meetup = meetups[i]
                        add_marker(meetup['index'], meetup['title'], meetup['desc'], meetup['lat'], meetup['lng'])
                    }
                    show_filtered_meetups();
                });
            }
        });
    }
    
});
