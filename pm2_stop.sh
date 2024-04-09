pm2 stop cedgeweb_frontend
TARGET_PID=`lsof -i :3000 | grep 'next-serv' | awk '{print $2}'`
kill -HUP $TARGET_PID
