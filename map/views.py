from django.shortcuts import render, redirect
import os, requests, json, datetime, pytz

def index(request):
    meetups_data = []
    return render(request, 'map/index.html', {'meetups': meetups_data})

def index_map(request):
    key = os.environ.get("MEETUP_API_KEY")
    print("https://api.meetup.com/find/events?key=" + key +"&photo-host=public&sig_id=229046722&radius=10.0&lon=-94.6275&lat=39.1141")
    meetup_api_request = "https://api.meetup.com/find/events?key=" + key +"&photo-host=public&sig_id=229046722&radius=10.0&lon=-94.6275&lat=39.1141"
    meetups = json.loads(requests.get(meetup_api_request).text)

    meetups_data = []

    for meetup in meetups:
        if 'time' in meetup:
            meetup_data = {}

            meetup_data['date'] = str(datetime.datetime.utcfromtimestamp(int(meetup['time']/1000)))
            meetups_data.append(meetup_data)
        else:
            pass

    return render(request, 'map/index.html', {'meetups': meetups_data})
