from .models import FlatterUser
from django.utils import timezone
from apscheduler.schedulers.background import BackgroundScheduler

def start():
    scheduler = BackgroundScheduler()
    scheduler.add_job(delete_users, 'interval', days=1)
    scheduler.start()


def delete_users():
    date = timezone.datetime.now() - timezone.timedelta(years=5)
    FlatterUser.objects.filter(last_login_lt=date).delete()