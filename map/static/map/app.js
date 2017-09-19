const DATA_URL = "meetups_data/";
app = angular.module('main', ["ngSanitize",'g1b.datetime-range'])

app.controller('maplist', function($scope, $http) {

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

    // Variables for the map and map related objects
    var l_map;
    var l_markers = [];
    var l_infowindow;
    var l_events = [];
    var l_area = null;

    // If user filters out events from the list, do the same for the markers on the map
    $scope.$watch('visible_events', function() {
        showFiltered(l_map, l_markers, $scope.visible_events);
    });
    // If user clicks button, repopulate the map with data
    $scope.populate = function(){
        populate();
    }

    // On load, create the map and render it
    initMap();

    function initMap(){
        // Set the center of the map
        if (map_center === undefined){
            map_center = {lat: 39.099727, lng: -94.578567};
        }
        l_map = new google.maps.Map(document.getElementById('map'), {
            zoom: 11,
            center: map_center
        });
        l_infowindow = new google.maps.InfoWindow({});

        // Draw the selection area and get data from back-end
        drawArea(l_map)
        populate();

        // Get the user's geo location. If user gives permission, move map center and selection area
        if (navigator.geolocation) {
            var map_center;
            navigator.geolocation.getCurrentPosition(function(position){
                map_center = {lat: Number(position.coords.latitude), lng: Number(position.coords.longitude)};
                l_map.setCenter(map_center);
                l_area.setCenter(map_center);
                populate();
            });
        }
    }

    // Draw the selection rea
    function drawArea(map){
        l_area = new google.maps.Circle({
            strokeColor: '#00AAFF',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#00AAFF',
            fillOpacity: 0.35,
            map: map,
            center: map.getCenter(),
            radius: 8046.72, //About 5 miles
            editable: true,
            draggable: true       
        });

        //Max/min sizes
        var maxRadius = 16093.44; // whatever max size you want to dictate
        var minRadius = 1609.34; // whatever max size you want to dictate
        google.maps.event.addListener(l_area,'radius_changed',_=>{
            if (l_area.getRadius() > maxRadius) {
                l_area.setRadius(maxRadius);
            }
            if (l_area.getRadius() < minRadius) {
                l_area.setRadius(minRadius);
            }

        });


    }

    // Retrive data from back-end
    function populate(){
        if($scope.tag_flag === undefined){
            $scope.tag_flag = false
        }
        data_req = $http({
            url: DATA_URL,
            method: "GET",
            params: {
                'lat': l_area.getCenter().lat(),
                'lon': l_area.getCenter().lng(),
                'radius': l_area.getRadius(),
                'to_time': to_unix,
                'from_time': from_unix,
                'tag_flag': $scope.tag_flag
            }
        }).then(res=>{
            l_events = res.data;
            $scope.events = l_events;
            resetMarkers(l_markers);
            plotMarkers(l_events, l_map, l_markers, l_infowindow);
            showFiltered(l_map, l_markers, $scope.visible_events);
        });
    }

    // Remove markers from map and delete them 
    function resetMarkers(markers){
        while (markers.length != 0){ 
            var marker = markers.pop();
            marker['marker'].setMap(null);
        }
    }

    // Remove markers from map but do not delete them
    function clearMarkers(markers){
        for (var i = 0; i < markers.length; i++) {
            markers[i]['marker'].setMap(null);
        }
    }

    // Plot the markers on the map
    function plotMarkers(events,map, markers, infowindow){
        for (var i = 0; i < events.length; i++) {
            event = events[i]
            addMarker(map, markers, infowindow, event['index'], event['title'], event['desc'], event['lat'], event['lng'])
        }
    }

    // Add marker to map, along with stuff like description & click listener
    function addMarker(map, markers, infowindow, index, title, desc, lat, lng){
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

    // First clear the markers off the map, then place the filtered ones on the map
    function showFiltered(map, markers, filtered_events){
        clearMarkers(markers)
        if (markers.length != 0){
            if( filtered_events ) {
                for (var i = 0; i < filtered_events.length; i++) {
                    // There is probably a more elegant solution. For now, each event object
                    // has an index. Each marker also has an index that corresponds with the appropriate
                    // event. So by checking the indexes of the filtered events, the appropriate markers
                    // can be put on the map
                    markers[filtered_events[i]['index']]['marker'].setMap(map);
                }
            }
        }
    }
});

