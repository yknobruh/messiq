#!/bin/bash

set -e

echo "======================================"
echo "MESSIQ DEPLOYMENT STARTED"
echo "======================================"

cd ~/messiq

echo ""
echo "Pulling latest code from dev..."
git fetch origin
git checkout dev
git reset --hard origin/dev

echo ""
echo "Building Frontend..."
cd ~/messiq/FE

npm install
npm run build

echo ""
echo "Publishing Frontend..."
sudo rm -rf /var/www/messiq/*
sudo cp -r dist/. /var/www/messiq/

echo ""
echo "Building Backend..."
cd ~/messiq/BE

npm install
npx tsc

echo ""
echo "Restarting Backend..."
pm2 restart messiq-backend

echo ""
echo "Reloading Nginx..."
sudo nginx -t
sudo systemctl reload nginx

echo ""
echo "Checking Backend..."
sleep 2

if pm2 list | grep -q "messiq-backend.*online"; then
    echo "BACKEND IS ONLINE"
else
    echo "BACKEND IS NOT RUNNING"
    pm2 status
    exit 1
fi

echo ""
echo "======================================"
echo "MESSIQ DEPLOYMENT COMPLETED"
echo "======================================"
