# DBMS Lab - SQLite Scripts for RaithuSetu

This lab is designed for sqlite3 or DB Browser for SQLite.

## Build the database

```bat
cd dbms-lab
sqlite3 raithusetu.db < 01_schema.sql
sqlite3 raithusetu.db < 02_seed.sql
sqlite3 raithusetu.db < 03_queries.sql
sqlite3 raithusetu.db < 04_transactions.sql
sqlite3 raithusetu.db < 05_integrity_demo.sql
```

## Notes

- SQLite does not provide row-level locks, so concurrency safety depends on the write transaction lock.
- Demo data includes the five farmers and the 700 kg buyer requirement.
