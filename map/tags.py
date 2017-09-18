import os, json
import watson_developer_cloud as wdp
import watson_developer_cloud.natural_language_understanding.features.v1 as Features

# Prepare to connect to IBM's NLU
natural_language_understanding = wdp.NaturalLanguageUnderstandingV1(
  username=os.environ.get('w_nlu_username'),
  password=os.environ.get('w_nlu_password'),
  version="2017-02-27")

def tag(title, desc_nohtml):
  tags = {}
  tags['cat']=cat(title + "\n" + desc_nohtml)
  return tags;

def cat(text):
  response = natural_language_understanding.analyze(
    text=text,
    features=[Features.Categories()]
  )
  # Return only Level 1 tags.
  try:
    category = response['categories'][0]['label'][1:].partition("/")[0]
  except:
    category = ""
  return  category