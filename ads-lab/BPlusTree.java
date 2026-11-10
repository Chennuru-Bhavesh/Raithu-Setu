import java.util.ArrayList;
import java.util.List;

public class BPlusTree {
    private final int order;
    private Node root;

    static class Node {
        boolean isLeaf;
        List<Integer> keys = new ArrayList<>();
        List<Node> children = new ArrayList<>();
        Node next;
    }

    public BPlusTree(int order) {
        if (order < 2) throw new IllegalArgumentException("Order must be >= 2");
        this.order = order;
        root = new Node();
        root.isLeaf = true;
    }

    public void insert(int value) {
        if (root == null) {
            root = new Node();
            root.isLeaf = true;
        }
        Node newRight = insert(root, value);
        if (newRight != null) {
            Node newRoot = new Node();
            newRoot.isLeaf = false;
            newRoot.keys.add(newRight.keys.get(0));
            newRoot.children.add(root);
            newRoot.children.add(newRight);
            root = newRoot;
        }
    }

    private Node insert(Node node, int value) {
        if (node.isLeaf) {
            node.keys.add(value);
            node.keys.sort(Integer::compareTo);
            if (node.keys.size() > order) {
                Node sibling = splitLeaf(node);
                return sibling;
            }
            return null;
        }

        int index = 0;
        while (index < node.keys.size() && value > node.keys.get(index)) index++;
        Node child = node.children.get(index);
        Node rightSplit = insert(child, value);
        if (rightSplit == null) return null;
        node.children.add(index + 1, rightSplit);
        node.keys.add(index, rightSplit.keys.get(0));
        node.keys.sort(Integer::compareTo);
        if (node.keys.size() > order) {
            return splitInternal(node);
        }
        return null;
    }

    private Node splitLeaf(Node leaf) {
        int splitIndex = (leaf.keys.size() + 1) / 2;
        Node sibling = new Node();
        sibling.isLeaf = true;
        sibling.keys.addAll(leaf.keys.subList(splitIndex, leaf.keys.size()));
        sibling.next = leaf.next;
        leaf.keys.subList(splitIndex, leaf.keys.size()).clear();
        leaf.next = sibling;
        return sibling;
    }

    private Node splitInternal(Node node) {
        int mid = node.keys.size() / 2;
        Node right = new Node();
        right.isLeaf = false;
        right.keys.addAll(node.keys.subList(mid + 1, node.keys.size()));
        right.children.addAll(node.children.subList(mid + 1, node.children.size()));
        node.keys.subList(mid + 1, node.keys.size()).clear();
        node.children.subList(mid + 1, node.children.size()).clear();
        Node promoted = new Node();
        promoted.isLeaf = false;
        promoted.keys.add(node.keys.get(mid));
        promoted.children.add(node);
        promoted.children.add(right);
        return promoted;
    }

    public boolean search(int value) {
        Node current = root;
        while (current != null && !current.isLeaf) {
            int index = 0;
            while (index < current.keys.size() && value > current.keys.get(index)) index++;
            current = current.children.get(index);
        }
        if (current == null) return false;
        return current.keys.contains(value);
    }

    public List<Integer> rangeScan(int start, int end) {
        List<Integer> result = new ArrayList<>();
        Node current = root;
        while (!current.isLeaf) {
            int idx = 0;
            while (idx < current.keys.size() && start > current.keys.get(idx)) idx++;
            current = current.children.get(idx);
        }
        while (current != null) {
            for (int value : current.keys) {
                if (value >= start && value <= end) result.add(value);
                if (value > end) return result;
            }
            current = current.next;
        }
        return result;
    }

    public static void main(String[] args) {
        BPlusTree tree = new BPlusTree(3);
        int[] values = {10, 20, 5, 6, 12, 30, 7, 17, 20, 15, 18};
        for (int value : values) tree.insert(value);
        System.out.println("B+ tree search 18: " + tree.search(18));
        System.out.println("B+ tree range 6..18: " + tree.rangeScan(6, 18));
    }
}
