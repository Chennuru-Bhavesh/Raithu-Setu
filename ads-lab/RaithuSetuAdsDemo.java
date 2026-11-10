import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class RaithuSetuAdsDemo {
    static class Listing {
        final int id;
        final int quantity;
        final int price;
        final int grade;
        final String harvestDate;

        Listing(int id, int quantity, int price, int grade, String harvestDate) {
            this.id = id;
            this.quantity = quantity;
            this.price = price;
            this.grade = grade;
            this.harvestDate = harvestDate;
        }
    }

    public static void main(String[] args) {
        System.out.println("=== RaithuSetu ADS Demo ===");

        Trie trie = new Trie();
        for (String crop : new String[]{"tomato", "onion", "potato", "tamarind"}) trie.insert(crop);
        System.out.println("Trie prefix 'to': " + trie.prefixSearch("to", 10));
        System.out.println("Trie prefix 'tom': " + trie.prefixSearch("tom", 10));

        BinarySearchTree bst = new BinarySearchTree();
        AVLTree avl = new AVLTree();
        List<Integer> keys = new ArrayList<>();
        for (int i = 1; i <= 1000; i++) keys.add(i);
        long bstStart = System.nanoTime();
        for (int key : keys) bst.insert(key);
        long bstTime = System.nanoTime() - bstStart;

        long avlStart = System.nanoTime();
        for (int key : keys) avl.insert(key);
        long avlTime = System.nanoTime() - avlStart;

        System.out.println("BST height after 1000 sorted keys: " + bst.height());
        System.out.println("AVL height after 1000 sorted keys: " + avl.height());
        System.out.println("Insert time BST: " + bstTime + " ns | AVL: " + avlTime + " ns");

        BPlusTree bt = new BPlusTree(3);
        int[] priceIndex = {18, 21, 23, 24, 27, 30, 35, 42};
        for (int value : priceIndex) bt.insert(value);
        System.out.println("B+ range query 20..30: " + bt.rangeScan(20, 30));

        List<Listing> listings = new ArrayList<>();
        listings.add(new Listing(1, 100, 24, 4, "2026-11-20"));
        listings.add(new Listing(2, 150, 25, 4, "2026-11-21"));
        listings.add(new Listing(3, 200, 23, 5, "2026-11-22"));
        listings.add(new Listing(4, 250, 22, 4, "2026-11-23"));
        listings.add(new Listing(5, 300, 21, 5, "2026-11-24"));

        MaxHeap<Listing> heap = new MaxHeap<>(Comparator.comparingInt((Listing l) -> l.grade).thenComparingInt(l -> l.price).reversed());
        for (Listing listing : listings) heap.offer(listing);
        System.out.println("Heap ranking (highest grade, then lower price):");
        while (!heap.isEmpty()) {
            Listing item = heap.poll();
            System.out.println("  Listing " + item.id + " -> grade " + item.grade + ", price " + item.price + ", qty " + item.quantity);
        }

        System.out.println("Summary: need 700 kg tomatoes; available lots from five farmers are 100, 150, 200, 250, 300 kg.");
    }
}
