from .models import FlatterUser, Promotion, ReferralProgram
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
    promotions2 = Promotion.objects.filter(times_to_be_used__lte=0, is_disabled=False, can_be_used_always=False)
    for promotion in promotions2:
        promotion.is_disabled = True
        promotion.save()
    referral_program = ReferralProgram.objects.filter(end_date__lt=timezone.now(), is_disabled=False)
    for program in referral_program:
        program.is_disabled = True
        program.save()