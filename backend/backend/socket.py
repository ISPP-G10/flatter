import channels_graphql_ws
from .schema import schema


class MyGraphqlWsConsumer(channels_graphql_ws.GraphqlWsConsumer):
    schema = schema

    # Uncomment to send keepalive message every 42 seconds.
    # send_keepalive_every = 42

    # Uncomment to process requests sequentially (useful for tests).
    # strict_ordering = True

    async def on_connect(self, payload):
        self.scope['domain'] = payload.get('domain')
        print(f"Connected to {self.channel_name}")
        print("New client connected!")

    async def disconnect(self, code):
        print("Client Disconnected!")