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

    var l_map;
    var l_markers = [];
    var l_infowindow;
    var l_events = [];
    var l_area = null;

    $scope.$watch('visible_events', function() {
        showFiltered(l_map, l_markers, $scope.visible_events);
    });
    $scope.populate = function(){
        populate();
    }
    initMap();

    function initMap(){
        if (map_center === undefined){
            map_center = {lat: 39.099727, lng: -94.578567};
        }

        l_map = new google.maps.Map(document.getElementById('map'), {
            zoom: 11,
            center: map_center
        });
        l_infowindow = new google.maps.InfoWindow({});
        drawArea(l_map)
        populate();

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

    
    function resetMarkers(markers){
        while (markers.length != 0){ 
            var marker = markers.pop();
            marker['marker'].setMap(null);
        }
    }
    function clearMarkers(markers){
        for (var i = 0; i < markers.length; i++) {
            markers[i]['marker'].setMap(null);
        }
    }

    function plotMarkers(events,map, markers, infowindow){
        for (var i = 0; i < events.length; i++) {
            event = events[i]
            addMarker(map, markers, infowindow, event['index'], event['title'], event['desc'], event['lat'], event['lng'])
        }
    }

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
    function showFiltered(map, markers, filtered_events){
        clearMarkers(markers)
        if (markers.length != 0){
            if( filtered_events ) {
                for (var i = 0; i < filtered_events.length; i++) {
                    markers[filtered_events[i]['index']]['marker'].setMap(map);
                }
            }
        }
    }
});

