import os
from django.core.asgi import get_asgi_application

from channels.staticfiles import StaticFilesHandler

environment = os.environ.get("DJANGO_ENV", "development")
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings.' + environment)
# Initialize Django ASGI application early to ensure the AppRegistry
# is populated before importing code that may import ORM models.
django_asgi_app = get_asgi_application()

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from backend.socket import MyGraphqlWsConsumer
from django.urls import path

websocket_urlPattern = [
    path('api/graphql/', MyGraphqlWsConsumer.as_asgi()),
]
application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AllowedHostsOriginValidator(
            URLRouter(
                websocket_urlPattern
            )
        )
            
})

channel_routing = {
    'http.request': StaticFilesHandler()
}