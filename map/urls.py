from django.conf.urls import url
from . import views

app_name = 'map'
urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^meetups_data/$', views.meetups_data, name='meetups_data'),
]
