#!/bin/bash
cd /home/ubuntu/ks-chicken-server
npm i
pm2 start index.js --name ks-chicken