#!/bin/bash
export SOCKET_SERVER_URL=http://Jaspers-iMac:8081
#export PATH=$PATH:/home/pi/.nvm/versions/node/v6.10.2/bin
echo "STARTING SERVER"
echo $(which node)

node index.js
