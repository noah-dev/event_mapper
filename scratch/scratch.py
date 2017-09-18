import os, json
import watson_developer_cloud as wdp
import watson_developer_cloud.natural_language_understanding.features.v1 as Features

natural_language_understanding = wdp.NaturalLanguageUnderstandingV1(
  username=os.environ.get('w_nlu_username'),
  password=os.environ.get('w_nlu_password'),
  version="2017-02-27")

response = natural_language_understanding.analyze(
  text="IBM is an American multinational technology company headquartered \
    in Armonk, New York, United States, with operations in over 170 \
    countries.",
  features=[Features.Categories()]
)

print(response['categories'][0]['label'][1:])

def tag(title, desc_nohtml):
  tags = {}
  tags['cat']=cat(title + "\n" + desc_nohtml)
  return tags;

def cat(text):
  response = natural_language_understanding.analyze(
    text=text,
    features=[Features.Categories()]
  )
  return response['categories'][0]['label'][1:]

print(tag("IBM","IBM is an American multinational technology company headquartered \
    in Armonk, New York, United States, with operations in over 170 \
    countries."))