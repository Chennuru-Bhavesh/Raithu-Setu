# Java Lab - Console Client for RaithuSetu

This folder contains the Java client application. It can run fully offline using DEMO DATA when the backend is unavailable.

## Commands

```bat
cd java-lab
javac Main.java ApiClient.java MatchingEngine.java Models.java NetReturnCalculator.java
java Main --offline
```

## Important notes

- The app prints an OFFLINE DEMO MODE banner if the backend is not reachable.
- It uses built-in data to demonstrate the full matching story.
- Net return uses `BigDecimal` with HALF_UP rounding and clearly labels values as ESTIMATE.
