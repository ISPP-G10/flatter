import csv
from os import path

from django.db.models.signals import post_migrate
from django.dispatch import receiver

from mainApp.models import Municipality, Province

# provinces.csv path
PROVINCES_CSV = path.join(path.dirname(path.abspath(__file__)), 'data', 'provinces.csv')
MUNICIPALITIES_CSV = path.join(path.dirname(path.abspath(__file__)), 'data', 'municipalities.csv')


@receiver(post_migrate)
def save_provinces_municipality(sender, **kwargs):

    if Municipality.objects.count() < 8000:

        Province.objects.all().delete()
        Municipality.objects.all().delete()

        with open(PROVINCES_CSV, mode='r', encoding='utf-8') as f:
            reader = csv.reader(f)
            next(reader)
            provinces = []
            for row in reader:
                provinces.append(Province(code=row[0], name=row[1]))
            Province.objects.bulk_create(provinces)

        with open(MUNICIPALITIES_CSV, mode='r', encoding='utf-8') as f:
            reader = csv.reader(f)
            next(reader)
            municipalities = []
            for row in reader:
                municipalities.append(
                    Municipality(code=f'{row[0]}{row[1]}', name=row[2], province=Province.objects.get(code=row[0])))
            Municipality.objects.bulk_create(municipalities)
