from django.db import models

class tag_store(models.Model):
    '''Store tags for an event here - use to prevent unnecessary recomputation'''
    key = models.CharField(max_length=200)
    cat = models.CharField(max_length=200)

    def __str__(self):
        return self.key + " | " + self.cat 

class stat_store(models.Model):
    '''Measure relevent analytics'''
    # What type of stat
    stat_type = models.CharField(max_length=200)
    # When it was recored in DB
    date = models.DateTimeField(auto_now = True)
    # Stats - e.g. how much time
    stats = models.TextField()

    def __str__(self):
        return self.stat_type + " | " + str(self.date) + " | " + self.stats