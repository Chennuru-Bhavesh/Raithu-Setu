@echo off
cd /d "%~dp0"
setlocal
if exist raithusetu.db del raithusetu.db
sqlite3 raithusetu.db < 01_schema.sql
sqlite3 raithusetu.db < 02_seed.sql
sqlite3 raithusetu.db < 03_queries.sql
