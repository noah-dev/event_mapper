from django.contrib import admin

# Register your models here.

from .models import tag_store, stat_store
admin.site.register(tag_store)
admin.site.register(stat_store)