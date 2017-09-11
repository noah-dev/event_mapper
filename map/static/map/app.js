const DATA_URL = "meetups_data/";
app = angular.module('map', ["ngSanitize",'g1b.datetime-range'])

app.controller('list', function($scope, $http) {

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


    $scope.populate = function(){
        populate_map_and_list()
    }

    var local_map 
    var local_makers = []
    initMap(local_makers, local_map);

    function initMap(markers, map){
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 11,
            center: {lat: 39.1, lng: -94.6},
        });
        var infowindow = new google.maps.InfoWindow({})
        populate_map_and_list(markers, infowindow, map, to_unix, from_unix)
    }

    function reset_map(markers){
        if (markers.length = 0){
            for (var i = 0; i < markers.length; i++) {
                markers[i]['marker'].setMap(null);
            }
            markers = [];
            return true;
        } else{
            return false;
        }

    }

    function populate_map_and_list(markers, infowindow, map, to, from){
        reset_map(markers);
        data_req = $http({
            url: DATA_URL,
            method: "GET",
            params: {
                'to_time': to,
                'from_time': from
            }
        });
        data_req.then(data=>{
            var events = data.data
            for (var i = 0; i < events.length; i++) {
                event = events[i]
                add_marker(markers, map, event['index'], event['title'], event['desc'], event['lat'], event['lng'])
                if (i-1 == events.length ){show_filtered_meetups(markers, infowindow, map);}
            }
        });
    }

    function add_marker(markers, map, index, title, desc, lat, lng){
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

    //Updating the list
    /*
    $scope.$watch('visible_meetups', function() {
        show_filtered_meetups();
    });
    */
    function show_filtered_meetups(markers, map){
        if (reset_map(markers)){
            for (var i = 0; i < $scope.visible_meetups.length; i++) {
                markers[$scope.visible_meetups[i]['index']]['marker'].setMap(map);
            }
        }
    }

});

