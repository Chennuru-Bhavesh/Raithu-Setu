# B-tree notes

A B-tree stores keys in internal nodes and keeps the tree balanced. In a B-tree, each node may hold multiple keys and multiple children, so the height stays small for large data. It is good for disk-based indexes because a single node can be read as one block.

Example insert sequence: 10, 20, 5, 6, 12, 30 in a B-tree of order 3. The root splits as needed and keys are kept sorted within each node. A B+ tree has the same idea but stores records only in leaf pages and links leaf nodes together, which makes range scans faster.

## B-tree vs B+ tree

- B-tree: keys can appear in internal nodes and leaves; range scans require more pointer chasing.
- B+ tree: all data records live at leaves; leaves are linked, so range queries and scans are simpler and faster.
- In RaithuSetu, the B+ tree is a better fit for price or harvest-date indexing because the demo is a range query, not a single-key lookup only.
