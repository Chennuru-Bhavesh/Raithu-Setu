# Demo Script (5 to 6 minutes)

## Minute 0:00 to 0:45
- Start with the problem statement: 700 kg tomato requirement and five small farmers.
- Show the project root and explain the four lab folders.

## Minute 0:45 to 1:30
- Run the ADS demo: Trie lookup, AVL vs BST, B+ range query, heap ranking.
- Mention that the purpose is conceptual clarity.

## Minute 1:30 to 2:30
- Start Node backend and explain /api/crops/search, /api/lots/match and database seeding.
- Show matching result for the 700 kg requirement.

## Minute 2:30 to 4:00
- Run Java client in --offline mode.
- Show the proposed lot and net return estimate table.

## Minute 4:00 to 5:00
- Open the React UI and display the form, search box, and lot summary.
- Show the DEMO DATA badge and role selector.

## Minute 5:00 to 5:45
- Run a few DBMS queries: inner join, left join, view, window function.
- Explain the transaction example and integrity checks.

## Minute 5:45 to 6:00
- Wrap up: this is a portable demo showing one business story across four labs.

## Exact commands

```bat
cd raithusetuds-lab
javac RaithuSetuAdsDemo.java
java RaithuSetuAdsDemo

cd ..ackend
npm install
npm run db:reset
npm start

cd ..\java-lab
javac Main.java ApiClient.java MatchingEngine.java Models.java NetReturnCalculator.java
java Main --offline

cd ..\dbms-lab
sqlite3 raithusetu.db < 01_schema.sql
sqlite3 raithusetu.db < 02_seed.sql
sqlite3 raithusetu.db < 03_queries.sql
```
