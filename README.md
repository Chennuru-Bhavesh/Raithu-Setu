# RaithuSetu

A portable Java + Node + SQLite teaching project for a 5?6 minute college lab demo.

## Project structure

- `ads-lab/` - Java data structures demo
- `java-lab/` - Java console client with offline mode
- `backend/` - Express + SQLite API shared by Java and React
- `react-lab/` - browser UI using local React vendor files
- `dbms-lab/` - SQLite schema, seed, queries and transaction scripts
- `PRESENTATION/` - slide deck notes and viva questions

## Quick start

1. Install Node.js LTS and Java 17+.
2. In backend:
   - `npm install`
   - `npm run db:reset`
   - `npm start`
3. Open http://localhost:3000 for the React UI.
4. Run Java demos in their lab folders.

## Demo story

Buyer requirement: 700 kg of tomatoes.
Five farmers list 100, 150, 200, 250 and 300 kg.
The matching algorithm chooses a compatible lot and shows each farmer's contribution and estimated net return.

## Mind map / flowchart of the project

```text
RaithuSetu
├─ 1. Problem and Demo Story
│  ├─ Farmers have small lots
│  ├─ Buyer needs 700 kg tomatoes
│  ├─ Aggregation combines several farmers into one lot
│  └─ Shared transport cost + net return shown per farmer
│
├─ 2. ADS Lab (ads-lab/)
│  ├─ Trie: crop prefix search ("to", "tom")
│  ├─ AVL Tree: balanced sorted storage for eligible listings
│  ├─ Binary Search Tree: unbalanced comparison demo
│  ├─ B+ Tree: price/harvest-date range indexing
│  ├─ Max Heap: ranking eligible listings by score
│  ├─ BTree notes: theory and comparison
│  └─ RaithuSetuAdsDemo.java: one combined ADS demonstration
│
├─ 3. Java Lab (java-lab/)
│  ├─ Main.java: menu / console workflow
│  ├─ ApiClient.java: Java HTTP calls to backend
│  ├─ Models.java: core domain classes
│  ├─ MatchingEngine.java: greedy matching logic
│  ├─ NetReturnCalculator.java: BigDecimal cost and net return logic
│  └─ OFFLINE DEMO MODE: works without backend using demo data
│
├─ 4. Backend (backend/)
│  ├─ db.js: SQLite setup and demo seed data
│  ├─ server.js: REST API routes and validation
│  ├─ services/trie.js: crop trie for prefix search
│  ├─ services/matching.js: exact matching algorithm
│  ├─ services/netReturn.js: shared transport and net return logic
│  └─ data/raithusetu.db: SQLite database file
│
├─ 5. React Lab (react-lab/)
│  ├─ index.html: browser landing page
│  ├─ app.js: UI logic and form handling
│  ├─ Crop search suggestions from backend trie API
│  ├─ Farmer listing form and buyer requirement form
│  ├─ Matching result and lot breakdown screen
│  └─ Net-return table with INR formatting
│
├─ 6. DBMS Lab (dbms-lab/)
│  ├─ 01_schema.sql: tables and constraints
│  ├─ 02_seed.sql: demo data for five farmers + one buyer
│  ├─ 03_queries.sql: joins, group by, subquery, window function, view
│  ├─ 04_transactions.sql: transaction and rollback example
│  ├─ 05_integrity_demo.sql: bad data checks and expected errors
│  ├─ NORMALIZATION.md: 1NF/2NF/3NF/BCNF discussion
│  ├─ ER.md: entity relationship diagram
│  └─ README + run.bat: SQLite setup instructions
│
└─ 7. Presentation Layer (PRESENTATION/)
   ├─ ppt-outline.md: 6-8 slide storyline
   ├─ demo-script.md: minute-by-minute live demo script
   ├─ viva-qa.md: likely questions and answers
   └─ architecture.md: system diagram
```

### Simple flowchart view

```text
Farmer listings --> Backend matching engine --> Aggregated lot --> Buyer requirement
      |                           |                         |
      |                           |                         +--> Show shortfall if any
      |                           |
      +--> Crop trie search      +--> Net return calculator
      |                           |
      +--> SQL schema + queries  +--> UI (Java / React)
```

## Section-wise file flowcharts

### Presentation/

```text
PRESENTATION/
├─ ppt-outline.md
│  └─ supports slide-by-slide presentation flow
├─ demo-script.md
│  └─ supports live demo timing and exact commands
├─ viva-qa.md
│  └─ supports examiner questions and short answers
├─ architecture.md
│  └─ supports the system design and component diagram
└─ together they prepare the final lab explanation and presentation
```

### ads-lab/

```text
ads-lab/
├─ Trie.java
│  └─ used for crop-name prefix search
├─ AVLTree.java
│  └─ balanced tree for sorted eligible listings
├─ BinarySearchTree.java
│  └─ unbalanced tree comparison demo
├─ BPlusTree.java
│  └─ range-query index for dates or prices
├─ MaxHeap.java
│  └─ ranking eligible listings or buyers by score
├─ BTREE_NOTES.md
│  └─ theory comparison of B-tree vs B+ tree
├─ RaithuSetuAdsDemo.java
│  └─ main ADS demo that runs all structures together
├─ README.md
│  └─ explains structure usage and complexity
└─ run.bat
   └─ one-click ADS demo launch
```

### backend/

```text
backend/
├─ db.js
│  └─ creates SQLite schema and demo seed data
├─ server.js
│  ├─ uses db.js for database access
│  ├─ calls services/trie.js for search suggestions
│  ├─ calls services/matching.js for lot matching
│  ├─ calls services/netReturn.js for net-return estimates
│  └─ serves the React UI and backend REST API
├─ services/
│  ├─ trie.js
│  │  └─ prefix-search trie for crop lookup
│  ├─ matching.js
│  │  └─ greedy matching logic for buyer requirements
│  └─ netReturn.js
│     └─ calculates transport share and estimated net return
├─ scripts/
│  └─ reset-db.js
│     └─ recreates the SQLite demo database
├─ package.json
│  └─ defines scripts like npm start and db:reset
├─ package-lock.json
│  └─ lockfile for dependency consistency
├─ data/
│  └─ raithusetu.db
│     └─ SQLite database generated from schema and seed files
└─ README.txt
   └─ note about the database folder
```

### dbms-lab/

```text
dbms-lab/
├─ 01_schema.sql
│  └─ creates all tables and constraints
├─ 02_seed.sql
│  └─ loads the five farmers, buyer and 700 kg requirement demo data
├─ 03_queries.sql
│  ├─ joins, subquery, group by and window function examples
│  └─ creates the v_lot_summary view
├─ 04_transactions.sql
│  └─ shows BEGIN / COMMIT / ROLLBACK transaction flow
├─ 05_integrity_demo.sql
│  └─ tests constraint violations and expected errors
├─ NORMALIZATION.md
│  └─ 1NF, 2NF, 3NF, BCNF discussion with examples
├─ ER.md
│  └─ Mermaid ER diagram for the database
├─ README.md
│  └─ setup and sqlite3 instructions
├─ run.bat
│  └─ runs the database prep quickly on Windows
└─ raithusetu.db
   └─ database generated after schema and seed execution
```

### java-lab/

```text
java-lab/
├─ Main.java
│  ├─ drives the Java lab app and offline mode
│  └─ uses the matching and net-return logic for the demo
├─ ApiClient.java
│  └─ calls the Node backend using java.net.http.HttpClient
├─ Models.java
│  └─ contains the domain objects for users, listings and requirements
├─ MatchingEngine.java
│  └─ applies the matching algorithm to eligible listings
├─ NetReturnCalculator.java
│  └─ calculates gross revenue, transport split and net return
├─ README.md
│  └─ explains commands and notes for the Java app
├─ run.bat
│  └─ one-click demo launch on Windows
└─ compiled .class files
   └─ generated after javac compilation
```

### react-lab/

```text
react-lab/
├─ index.html
│  └─ main browser entry page for the UI
├─ app.js
│  ├─ renders the role selector and forms
│  ├─ loads crop suggestions from backend search API
│  ├─ shows listing table and buyer requirement table
│  └─ displays lot-match results and net-return output
├─ vendor/
│  ├─ react.development.js
│  └─ react-dom.development.js
│     └─ local React files to avoid internet dependency
├─ package.json
│  └─ minimal project setup for local UI usage
└─ README.md (if added later)
   └─ explains browser-run instructions
```

## Future Work

Payments, GPS, government schemes, AI advice, offline sync, external price APIs, SMS, JWT/OAuth, Docker, cloud hosting.
