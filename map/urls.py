from django.conf.urls import url
from . import views

app_name = 'map'
urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^meetups_data/$', views.meetups_data, name='meetups_data'),
    url(r'^privacy/$', views.privacy, name='privacy'),
    url(r'^concept/$', views.concept, name='meetups_data'),
    url(r'^partial/$', views.partial, name='meetups_data'),
]
