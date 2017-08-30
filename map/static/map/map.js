
angular.module('map', ['ngSanitize']).controller('list', function($scope) {

    $scope.myText = "My name is: <h1>John Doe</h1>";

    var map
    var zoom = 11
    var kcmo = {lat: 39.1, lng: -94.6};
    var meetups 


    //$scope.$watch('filtered_meetups', _=>{console.log($scope.filtered_meetups)});
    
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: zoom,
        center: kcmo
    });
    load_data()

    function add_marker(title, desc, lat, lng, set_marker){
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
        set_marker(marker)
        markers.push(marker)
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

                    meetup['map_marker'] = new google.maps.Marker({
                        position: {lat: meetup['lat'], lng: meetup['lng']},
                        title: meetup['title']
                    });
                    //meetup['map_marker'].setMap(map);

                    /*
                    var infowindow = new google.maps.InfoWindow({
                        content: meetup['desc']
                    })
                    meetup['map_marker'].addListener('click', function(){
                        infowindow.open(map, meetup['map_marker'])
                    });
                    */
                    
                });
            }
        });
    }


});
