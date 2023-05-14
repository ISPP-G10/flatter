python manage.py collectstatic --noinput
python manage.py makemigrations --noinput
python manage.py migrate --noinput
python manage.py loaddata tags.json
python manage.py loaddata inappropiate_language.json
echo "from authentication.models import FlatterUser;
FlatterUser.objects.filter(email='$DJANGO_ADMIN_EMAIL').delete();
FlatterUser.objects.create_superuser('$DJANGO_ADMIN_USER', '$DJANGO_ADMIN_EMAIL', '$DJANGO_ADMIN_PASSWORD')" | python manage.py shell

exec "$@"