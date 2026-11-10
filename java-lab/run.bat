@echo off
cd /d "%~dp0"
setlocal
javac Main.java ApiClient.java MatchingEngine.java Models.java NetReturnCalculator.java
java Main --offline
