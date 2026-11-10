# Viva Q&A

1. Why use a Trie? It helps with prefix-based crop search like ?tom?.
2. Trie vs database index? A Trie is in-memory and fast for text prefix lookup; a database index is better for larger persistent data.
3. AVL vs plain BST? AVL rebalances to keep height small and improves worst-case search time.
4. B-tree vs B+ tree? B+ tree uses leaf links that make range scans easier.
5. How does the heap ranking work? Items are ordered by score, with the best item at the top.
6. Gross revenue vs net return? Gross revenue is selling price before transport and packaging; net return subtracts cost.
7. How is shared transport cost allocated? Proportionally by each farmer's quantity contribution.
8. What is a functional dependency? It describes attributes determined by other attributes.
9. 1NF vs 2NF vs 3NF? The normal forms progressively remove redundant data and partial/transitive dependencies.
10. How does a transaction prevent overcommitment? It checks stock again and uses BEGIN IMMEDIATE / ROLLBACK if the update breaks constraints.
11. How does Java talk to Node? Using `java.net.http.HttpClient`.
12. Why SQLite? A single file, portable, quick to reset, enough for the demo.
13. What is implemented here? A working demo of matching, SQL schema, Java console app, React UI, and backend.
14. What is simulated? Some advanced login, role checks, and lot confirmation logic are simplified for a lab demo.
15. What is future work? Payments, GPS, and more governance features.
16. Why greedy matching? It is simple and matches the required assignment criteria.
17. What is the demo requirement? 700 kg of tomatoes from five farmer listings.
18. Why use `BigDecimal`? It avoids binary floating-point errors in money calculations.
19. Why label output as ESTIMATE? Because cost-sharing and packaging are approximations and are not final accounting.
20. Which feature is easiest to explain live? The matching algorithm and the per-farmer net-return table.
