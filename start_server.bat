@echo off
title AMERICAN Fast Food - Local Server
echo ========================================================
echo   AMERICAN ^| Premium Fast Food - Local Server
echo ========================================================
echo.
echo   Sayt manzili / Website URL:  http://localhost:3000
echo   Android App Webview URL:     http://localhost:3000/android_app/app/src/main/assets/www/index.html
echo.
echo   Serverni to'xtatish uchun: Ctrl + C tugmasini bosing
echo   Press Ctrl + C to stop the server
echo ========================================================
echo.
python -m http.server 3000
pause
