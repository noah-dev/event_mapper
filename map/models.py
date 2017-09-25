from django.db import models

class tag_store(models.Model):
    '''Represents an item on a todo list'''
    
    key = models.CharField(max_length=200)
    cat = models.CharField(max_length=200)

    def __str__(self):
        return self.key + " | " + self.cat 