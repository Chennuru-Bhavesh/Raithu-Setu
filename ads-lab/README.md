# ADS Lab - Java Structures for RaithuSetu

This folder contains standalone Java demos for the ADS lab. Each file has a small `main()` so it can be run independently.

## Run commands

```bat
cd ads-lab
javac Trie.java
java Trie

javac AVLTree.java
java AVLTree

javac BinarySearchTree.java
java BinarySearchTree

javac BPlusTree.java
java BPlusTree

javac MaxHeap.java
java MaxHeap

javac RaithuSetuAdsDemo.java
java RaithuSetuAdsDemo
```

## Structure fit table

| Structure | Where it fits in RaithuSetu | Complexity | One-line limitation |
| --- | --- | --- | --- |
| Trie | Crop prefix search | prefix traversal cost plus visited subtree size | Small data; a DB index would be similar in real use |
| AVL Tree | Keep eligible listings sorted by price and ID | O(log n) insert/search, O(n) traversal | More code than a BST |
| Binary Search Tree | Comparison demo only | O(log n) average, O(n) worst case | Unbalanced input can degrade quickly |
| B+ Tree | Price/harvest-date index for range queries | search O(log n), range scan O(log n + k) | In-memory demo is simpler than disk-based |
| Max Heap | Ranking eligible listings by score | O(log n) per push/pop | Ranking is only meaningful after eligibility filtering |

## AVL vs Red-Black tree (theory)

AVL trees are stricter: they rebalance more often and keep height more balanced, so lookups are very fast. Red-Black trees are slightly less rigid and rebalance less often, which can be a win for repeated inserts. In a small college demo, AVL is easier to explain because the rotations are clearly visible.

## B-tree vs B+ tree

A B-tree stores keys in internal and leaf nodes. A B+ tree stores data in leaves and keeps leaf nodes linked. That makes B+ trees better for range scans, which is useful when the system queries a price band or harvest date band.
