@echo off
REM Optimiza PNGs con oxipng
oxipng src\assets\images\*.png

REM Optimiza GIFs con gifsicle
c:\Users\niz\Downloads\gifsicle-1.95-win64\gifsicle.exe -O3 src\assets\images\*.gif -o src\assets\images\optimized.gif

echo Optimización completada.
