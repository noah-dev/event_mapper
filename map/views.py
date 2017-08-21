from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
import os, requests, json, datetime, pytz

def index(request):
    meetups_data = []
    return render(request, 'map/index.html')

def meetups_data(request):
    key = os.environ.get("MEETUP_API_KEY")
    print("https://api.meetup.com/find/events?key=" + key +"&photo-host=public&sig_id=229046722&radius=20.0&lon=-94.6275&lat=39.1141")
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
            meetup_data['date'] = str(datetime.datetime.utcfromtimestamp(int(meetup['time']/1000)))
            meetups_data.append(meetup_data)
        else:
            pass
    
    return JsonResponse(meetups_data, safe=False)


def show_item(request):
    '''Return a specific item using passed in primary key via ajax request'''
    try:
        item_id = request.GET['id']
        item_select = get_object_or_404(Item, pk=item_id)
    except:
        print("Error at todo.view.show_item")

    # To be honest, I don't know if this is necessary. But it makes me feel better
    if item_select.username != str(request.user):
        return redirect('/todo/')

    # To format the data correctly, model_to_dict is used
    pre_data = model_to_dict(item_select)
    # Convert the date fields from datetime objects to strings
    tz = pytz.timezone('America/Chicago')
    pre_data['add_date'] = str(pre_data['add_date'].astimezone(tz))
    pre_data['due_date'] = str(pre_data['due_date'].astimezone(tz))
    pre_data['start_date'] = str(pre_data['start_date'].astimezone(tz))

    # Dump data and return it
    data = json.dumps(pre_data)
    return JsonResponse(data, safe=False)