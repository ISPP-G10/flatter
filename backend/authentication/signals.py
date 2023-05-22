from django.db.models import signals
from django.dispatch import receiver
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from django.core.exceptions import ValidationError
from .models import FlatterUser, Promotion, ReferralProgramController, Role, RoleType, Plan, UserPreferences, ReferralProgram
import base64

@receiver(signals.post_migrate, sender=None)
def create_referral_program_controller(sender=None, **kwargs):
    if ReferralProgramController.objects.count() == 0:
        ReferralProgramController.objects.create(max_days=30, max_users=10, quantity=50, quantity_referred=10)

@receiver(signals.post_migrate, sender=None)
def create_referral_program_controller(sender=None, **kwargs):
    for user in FlatterUser.objects.filter(referralprogram__isnull=True):
        today = timezone.now()
        ReferralProgram.objects.create(initial_date=today, user=user, code=_create_code(), times_to_be_used=0, end_date=(today + timezone.timedelta(days=1)), user_quantity=0, user_referred_quantity=0, is_disabled=True)

@receiver(signals.post_save, sender=Promotion) 
def create_promotion(sender, instance, created,  **kwargs):
    if instance.is_discount:
        if instance.quantity > 1 or instance.quantity < 0:
            raise ValidationError("The quantity must be between 0 and 1")
    else:
        if instance.quantity < 0:
            raise ValidationError("The quantity must be greater than 0")
        if int(instance.quantity) != instance.quantity:
            raise ValidationError("The quantity must be an integer")

@receiver(signals.post_migrate, sender=None)
def add_roles(sender=None, **kwargs):
    for role in RoleType:
        Role.objects.get_or_create(role=role)

@receiver(signals.post_migrate, sender=None)
def create_plans(sender=None, **kwargs):
    if Plan.objects.count() == 0:
    
        Plan.objects.get_or_create(flatter_coins=0, visits_number=10, 
                            tags_number=6, advertisement=True, 
                            chat_creation=False, standard_support=False, 
                            premium_support=False, view_self_profile_opinions=False, 
                            initial_date=timezone.now(), end_date=None, 
                            plan_type='B')

        Plan.objects.get_or_create(flatter_coins=30, visits_number=30, 
                            tags_number=10, advertisement=False, 
                            chat_creation=True, standard_support=True, 
                            premium_support=False, view_self_profile_opinions=True, 
                            initial_date=timezone.now(), end_date=None, 
                            plan_type='A')

        Plan.objects.get_or_create(flatter_coins=65, visits_number=10**10, 
                            tags_number=10, advertisement=False, 
                            chat_creation=True, standard_support=True, 
                            premium_support=True, view_self_profile_opinions=True, 
                            initial_date=timezone.now(), end_date=None, 
                            plan_type='P')

@receiver(signals.post_save, sender=FlatterUser)
def create_user_preferences(sender, instance, created, **kwargs):
    if created:
        UserPreferences.objects.create(user=instance)
        try:
            controller = ReferralProgramController.objects.all().first()
            is_disabled = False
            if controller.is_disabled:
                is_disabled = True
            today = timezone.now()
            ReferralProgram.objects.create(initial_date=today, user=instance, code=_create_code(), times_to_be_used=controller.max_users, end_date=(today + timezone.timedelta(days=controller.max_days)), user_quantity=controller.quantity, user_referred_quantity=controller.quantity_referred, is_disabled=is_disabled)
        except Exception:
            today = timezone.now()
            ReferralProgram.objects.create(initial_date=today, user=instance, code=_create_code(), times_to_be_used=0, end_date=(today + timezone.timedelta(days=1)), user_quantity=0, user_referred_quantity=0, is_disabled=True)
            
def _create_code():
    code = base64.b64encode(f'{timezone.now().timestamp()}'.encode('utf-8')).decode('utf-8')
    if ReferralProgram.objects.filter(code=code).exists():
        return _create_code()
    return code