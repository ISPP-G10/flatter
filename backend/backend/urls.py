from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from django.views.decorators.csrf import csrf_exempt
from graphene_django.views import GraphQLView
from django.views.static import serve 

if settings.DEBUG:
    urlpatterns = [
        path('admin/', admin.site.urls),
        path('api/graphql/', csrf_exempt(GraphQLView.as_view(graphiql=True))),
    ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
else:
    urlpatterns = [
        path('admin/', admin.site.urls),
        path('api/graphql/', csrf_exempt(GraphQLView.as_view(graphiql=True))),
        path('api/media', serve, {'document_root': settings.MEDIA_ROOT}),
        path('api/static', serve, {'document_root': settings.STATIC_ROOT})
    ]
