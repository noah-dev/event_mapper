from django.test import TestCase
from django.urls import reverse
from django.utils import timezone
import datetime, json, time

def valid_time(to_time, from_time, data):
    for entry in data:
        if datetime.datetime.utcfromtimestamp(to_time) <= \
                datetime.datetime.utcfromtimestamp(entry['utc']) <= \
                datetime.datetime.utcfromtimestamp(from_time):
            pass
        else:
            return False
    return True

class TestData(TestCase):
    def test_data_api(self):
        """
        See if the response from views.py has the correct headings. 
        """
        to_time_dt = timezone.now().replace(tzinfo=None)
        to_time = int(time.mktime(to_time_dt.timetuple()))
        from_time_dt = timezone.now().replace(tzinfo=None) + datetime.timedelta(days=1)
        from_time = int(time.mktime(from_time_dt.timetuple()))

        response = self.client.get(reverse('map:meetups_data'),{'lat': 39.099727, 
                                                                'lon': -94.578567,
                                                                'radius': 8046.72,
                                                                'to_time': to_time , 
                                                                'from_time': from_time,
                                                                'tag_flag': "true",
                                                                })
        data_json = json.loads(response.content)
        data_keys = ['index', 'title', 'link', 'address', 'lat', 'lng', 'utc', 'utc_offset', 'date', 'group', 'desc', 'tags']
        
        print("Testing if response is valid...")
        self.assertEqual(response.status_code, 200)
        self.assertIs(len(data_json)>0, True)
        self.assertIs(set(data_json[0].keys()) == set(data_keys), True)
        print("Testing if time filtering worked...")
        self.assertIs(valid_time(to_time, from_time, data_json), True)
        print("Testing if tags are formatted correctly...")
        for entry in data_json:
            self.assertIs("/" in entry['tags']['cat'], False)
            self.assertIs(len(entry['tags']['cat'])>0, True)
