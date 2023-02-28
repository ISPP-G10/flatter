import os

bind = "0.0.0.0:8000"
workers = 2
threads = 4
timeout = 30
keepalive = 2

# Set the Django settings module
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings.production")

# Explicitly set the ROOT_URLCONF setting
env = os.environ.copy()
env["ROOT_URLCONF"] = "backend.urls"

# Start the server
def worker_init(worker):
    worker.cfg.set("env", env)

