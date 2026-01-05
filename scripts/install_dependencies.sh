#!/bin/bash
cd /home/ubuntu/ks-chicken-server
npm i
cd ..
pm2 start ecosystem.config.js --name ks-chicken