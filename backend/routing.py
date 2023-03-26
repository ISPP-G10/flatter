from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from channels.auth import AuthMiddlewareStack
from backend.socket import MyGraphqlWsConsumer
from django.urls import path
from channels.staticfiles import StaticFilesHandler
from django.core.asgi import get_asgi_application


websocket_urlPattern = [
    path('api/graphql/', MyGraphqlWsConsumer.as_asgi()),
]
application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter(
                websocket_urlPattern
                )
            )
    )
})

channel_routing = {
    'http.request': StaticFilesHandler()
}
