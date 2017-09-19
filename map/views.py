from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from django.utils import timezone
from django.utils.html import strip_tags
import os, requests, json, datetime

from . import tags

def index(request):
    return render(request, 'map/index.html')

def privacy(request):
    return render(request, 'map/privacy.html')

def meetups_data(request):
    # Create the API request to Meetup
    key = os.environ.get("MEETUP_API_KEY")
    lat = request.GET['lat'][:10]
    lon = request.GET['lon'][:10]
    meetup_api_request = "https://api.meetup.com/find/events?key=" + key +"&photo-host=public&sig_id=229046722&radius=5.0" + "&lon=" + lon + "&lat=" + lat
    print(meetup_api_request)
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

                meetup_data['utc'] = int(meetup['time']/1000)
                meetup_data['utc_offset'] = int(meetup['utc_offset']/1000)

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
                if meetup_data['desc']== "<h1>No Description Found</h1>":
                    pass
                    meetup_data['tags']=tags.tag(meetup_data['title'], "")
                else:
                    pass
                    meetup_data['tags']=tags.tag(meetup_data['title'], strip_tags(meetup_data['desc']))

                meetups_data.append(meetup_data)

        else:
            pass
    
    return JsonResponse(meetups_data, safe=False)

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