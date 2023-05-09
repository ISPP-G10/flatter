sudo mv /tmp/docker.env flatter/docker/.env
sudo mv /tmp/client.env flatter/client/.env
cd flatter/docker
sudo docker-compose up -d