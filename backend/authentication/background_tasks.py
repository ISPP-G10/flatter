from .models import FlatterUser, Promotion
from django.utils import timezone
from apscheduler.schedulers.background import BackgroundScheduler

def start():
    scheduler = BackgroundScheduler()
    scheduler.add_job(delete_users, 'interval', days=1)
    scheduler.start()


def delete_users():
    date = timezone.datetime.now() - timezone.timedelta(years=5)
    FlatterUser.objects.filter(last_login_lt=date).delete()
    promotions = Promotion.objects.filter(max_date__lt=timezone.now(), is_disabled=False)
    for promotion in promotions:
        promotion.is_disabled = True
        promotion.save()