@echo off
REM One-command setup: installs dependencies, browsers, and creates the env file.
REM Run this once by double-clicking setup.bat

echo Step 1/3: Installing npm dependencies...
call npm install
if errorlevel 1 goto :error

echo Step 2/3: Installing Playwright browsers (Chromium, Firefox, WebKit)...
call npx playwright install --with-deps
if errorlevel 1 goto :error

echo Step 3/3: Setting up environment file...
if not exist .env.staging (
  copy .env.staging.example .env.staging
  echo Created .env.staging
) else (
  echo .env.staging already exists, skipping
)

echo.
echo Setup complete! Now run:
echo   npm run test:smoke     -^> quick check
echo   npm test                -^> full suite
echo   npm run report          -^> view results in browser
pause
exit /b 0

:error
echo.
echo Something failed above. Make sure Node.js is installed (nodejs.org) and try again.
pause
exit /b 1
