from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from django.utils import timezone
from django.utils.html import strip_tags
import os, requests, json, datetime

from math import radians, cos, sin, asin, sqrt

from . import tags

def index(request):
    '''Render the home page, with the map'''
    return render(request, 'map/index.html')

def privacy(request):
    '''Render the private page'''
    return render(request, 'map/privacy.html')

def meetups_data(request):
    '''Provide data to front-end'''
    # Create the API request to Meetup
    key = os.environ.get("MEETUP_API_KEY")
    lat = request.GET['lat'][:10]
    lon = request.GET['lon'][:10]
    radius = float(request.GET['radius'])*0.000621371192
    meetup_api_radius = str(int(radius)+1) 
    tag_flag = request.GET['tag_flag']
    
    # The meetup api seems to only accept whole miles. Overshoot and then clean out meetups outside of the radius
    meetup_api_request = "https://api.meetup.com/find/events?key=" + key +"&photo-host=public&sig_id=229046722&radius="+ meetup_api_radius + "&lon=" + lon + "&lat=" + lat
    meetups = json.loads(requests.get(meetup_api_request).text)
    
    meetups_data = []
    for meetup in meetups:
        # Filter out meetups without a venue
        if 'venue' in meetup:
            meetup_data = {}

            # Filter out meetups that do not fit within time frame
            if int(request.GET['to_time']) <= int(meetup['time']/1000) <= int(request.GET['from_time']):

                #Begin populating the dict
                meetup_data['index'] = len(meetups_data)
                meetup_data['title'] = meetup['name']
                meetup_data['link'] = meetup['link']
                
                meetup_data['address'] = meetup['venue']['address_1']
                meetup_data['lat'] = meetup['venue']['lat']
                meetup_data['lng'] = meetup['venue']['lon']

                # As mentioned before, the meetup api only accepts whole miles. Overshoot and then clean out meetups outside of the radius
                if haversine(float(meetup_data['lng']), float(meetup_data['lat']), float(lon), float(lat)) > radius:
                    break # If the event is too far out of range, break out and move to next event

                meetup_data['utc'] = int(meetup['time']/1000)
                meetup_data['utc_offset'] = int(meetup['utc_offset']/1000)

                # Turn UTC into datetime object for formatting
                date_datetime = datetime.datetime.utcfromtimestamp(int((meetup['time'] + meetup['utc_offset'])/1000))
                meetup_data['date'] = date_datetime.strftime('%m/%d, %I:%M %p')

                meetup_data['group'] = meetup['group']['name']
                meetup_data['desc'] = "<b>"+meetup['group']['name']+": "+meetup_data['title']+"</b></br>" + \
                                        "Held at: <b>"+meetup_data['date']+"</b></br>" +\
                                            "<a href=\""+meetup_data['link']+"\" target=\"_blank\">Meetup Page Link</a></br><hr>"
                
                # If the meetup does not have a desc, place one
                if 'description' in meetup:
                    meetup_data['desc']+= meetup['description']
                else:
                    meetup_data['desc']+= "<h1>No Description Found</h1>"
                
                # Assign appropriate tags to the meetup
                if tag_flag == "true":
                    if meetup_data['desc']== "<h1>No Description Found</h1>":
                        meetup_data['tags']=tags.tag(meetup_data['title'], "")
                    else:
                        meetup_data['tags']=tags.tag(meetup_data['title'], strip_tags(meetup_data['desc']))
                    meetup_data['desc']="<b>Tags:</b> "+ meetup_data['tags']['cat'] + "<hr>" + meetup_data['desc']

                # Assuming nothing broke, the event will be added to the list. 
                meetups_data.append(meetup_data)

        else:
            pass
    
    return JsonResponse(meetups_data, safe=False)

# https://stackoverflow.com/questions/4913349/haversine-formula-in-python-bearing-and-distance-between-two-gps-points
def haversine(lon1, lat1, lon2, lat2):
    """
    Calculate the great circle distance between two points 
    on the earth (specified in decimal degrees)
    """
    # convert decimal degrees to radians 
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])

    # haversine formula 
    dlon = lon2 - lon1 
    dlat = lat2 - lat1 
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a)) 
    r = 6371 # Radius of earth in kilometers. Use 3956 for miles
    return c * r

# -------------------------------------
# Previous Versions
# ------------------------------------

def concept(request):
    return render(request, 'concept/index.html')

def partial(request):
    return render(request, 'partial/index.html')


def concept_meetups_data(request):
    key = os.environ.get("MEETUP_API_KEY")
    meetup_api_request = "https://api.meetup.com/find/events?key=" + key +"&photo-host=public&sig_id=229046722&radius=10.0&lon=-94.6275&lat=39.1141"
    meetups = json.loads(requests.get(meetup_api_request).text)

    meetups_data = []

    for meetup in meetups:
        if 'venue' in meetup:
            meetup_data = {}

            meetup_data['title'] = meetup['name']
            meetup_data['desc'] = meetup['link']
            meetup_data['lat'] = meetup['venue']['lat']
            meetup_data['lng'] = meetup['venue']['lon']
            date_datetime = datetime.datetime.utcfromtimestamp(int((meetup['time'] + meetup['utc_offset'])/1000))
            meetup_data['date'] = date_datetime.strftime('%m/%d, %I:%M %p')
            meetups_data.append(meetup_data)
        else:
            pass
    
    return JsonResponse(meetups_data, safe=False)

def partial_meetups_data(request):
    key = os.environ.get("MEETUP_API_KEY")
    meetup_api_request = "https://api.meetup.com/find/events?key=" + key +"&photo-host=public&sig_id=229046722&radius=10.0&lon=-94.6275&lat=39.1141"
    meetups = json.loads(requests.get(meetup_api_request).text)

    meetups_data = []

    for meetup in meetups:
        if 'venue' in meetup:
            meetup_data = {}

            meetup_data['index'] = len(meetups_data)
            meetup_data['title'] = meetup['name']
            meetup_data['link'] = meetup['link']
            
            meetup_data['address'] = meetup['venue']['address_1']
            meetup_data['lat'] = meetup['venue']['lat']
            meetup_data['lng'] = meetup['venue']['lon']

            meetup_data['utc'] = int(meetup['time']/1000)
            meetup_data['utc_offset'] = int(meetup['utc_offset']/1000)

            date_datetime = datetime.datetime.utcfromtimestamp(int((meetup['time'] + meetup['utc_offset'])/1000))
            meetup_data['date'] = date_datetime.strftime('%m/%d, %I:%M %p')

            meetup_data['group'] = meetup['group']['name']
            meetup_data['desc'] = "<b>"+meetup['group']['name']+": "+meetup_data['title']+"</b></br>" + \
                                    "Held at: <b>"+meetup_data['date']+"</b></br>" +\
                                        "<a href=\""+meetup_data['link']+"\">Meetup Page Link</a></br><hr>"
            if 'description' in meetup:
                meetup_data['desc']+= meetup['description']
            else:
                meetup_data['desc']+= "<h1>No Description Found</h1>"
            meetup_data['desc_no_html'] = strip_tags(meetup_data['desc'])
            
            meetups_data.append(meetup_data)
        else:
            pass
    
    return JsonResponse(meetups_data, safe=False)