rem  Get script dir, with '\' on the end
set SCRIPT_DIR=%~dp0
rem Remove trailing slash
set SCRIPT_DIR=%SCRIPT_DIR:~0,-1%

rem Navigate to our directory
cd %SCRIPT_DIR%

rem Installing our dependencies
call npm install
call npm audit fix

rem Installing Process Manager 2 globally
call npm install pm2 -g

rem Calling our start script
START npm run pm2:start

rem Tail the log file
call npm run pm2:logs

