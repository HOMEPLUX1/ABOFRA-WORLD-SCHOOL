@echo off
echo Installing Abofra World School dependencies...
echo.

echo Installing Backend dependencies...
cd backend
call npm install
cd ..

echo.
echo Installing Frontend dependencies...
cd frontend
call npm install
cd ..

echo.
echo All dependencies installed!
echo Run start.bat to launch the website.
pause
