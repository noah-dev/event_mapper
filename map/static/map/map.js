var map
var zoom = 11
var kcmo = {lat: 39.1, lng: -94.6};

$(function() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: zoom,
        center: kcmo
    });
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
}

function populate_map(){

    //Setup the ajax request and send it off - handled by urls.py
    $.ajax({
        url: 'meetups_data/',
        data: {
        },
        dataType: 'json',
        success: function (data) {
            data.forEach(meetup =>{
                setTimeout(_=>{add_marker(meetup['title'], meetup['desc'] + " | " + meetup['date'], meetup['lat'], meetup['lng']);}, 100);
            });
            
        }
    });
}

$('input[name="item_complete"]').on('change', function () {
    //Get it's item_id, equivalent to item's pk in database
    var item_id = $(".todo_item").get(0).id;
  
    //Retrive the checkbox element
    var checkbox = $('input[name="item_complete"]')
    var complete = checkbox.is(':checked');
  
    //Setup the ajax request and send it off - handled by urls.py
    $.ajax({
      url: 'complete_item/',
      data: {
        'id': item_id,
        'complete': complete
      },
      dataType: 'json',
  
      //When it returns, the database has been updated. Now the frontend
      //neeeds to be updated. Find the item from the right-hand side and
      //assign the appropriate html markup depending on if it is complete
      //or not complete
      success: function (data) {
        var item_complete_element = $("#" + item_id +".complete_info");
        var complete_status = item_complete_element.find("span");
        if (complete){
          complete_status.css("color","#ecececff");
          setTimeout(function(){
            complete_status.text("True");
            complete_status.css("color","green");
          }, 500);
        } else if (!complete){
          complete_status.css("color","#ecececff");
          setTimeout(function(){
            complete_status.text("False");
            complete_status.css("color","red");
        }, 500);
        } else {
          console.log("ERROR WITH CHECKBOX JS")
        }
      }
    });
  
  });