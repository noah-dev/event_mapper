from django.shortcuts import render, redirect
import oauthlib

def index(request):
    meetups = [1,2,3]
    return render(request, 'map/index.html', {'meetups': meetups})
