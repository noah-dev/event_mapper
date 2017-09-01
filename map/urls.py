from django.conf.urls import url
from . import views

app_name = 'map'
urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^privacy/$', views.privacy, name='privacy'),
    url(r'^concept/$', views.concept, name='concept'),
    url(r'^partial/$', views.partial, name='partial'),

    url(r'^meetups_data/$', views.meetups_data, name='meetups_data'),
    url(r'^concept_meetups_data/$', views.concept_meetups_data, name='concept_meetups_data'),
    url(r'^partial_meetups_data/$', views.partial_meetups_data, name='partial_meetups_data'),
]
