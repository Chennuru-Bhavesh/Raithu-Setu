import java.util.ArrayList;
import java.util.List;

public class AVLTree {
    private Node root;

    static class Node {
        int key;
        Node left, right;
        int height;

        Node(int key) {
            this.key = key;
            this.height = 1;
        }
    }

    public void insert(int key) {
        root = insert(root, key);
    }

    private Node insert(Node node, int key) {
        if (node == null) return new Node(key);
        if (key < node.key) node.left = insert(node.left, key);
        else if (key > node.key) node.right = insert(node.right, key);
        else return node;
        update(node);
        return rebalance(node);
    }

    public boolean search(int key) {
        Node current = root;
        while (current != null) {
            if (key == current.key) return true;
            current = key < current.key ? current.left : current.right;
        }
        return false;
    }

    public void delete(int key) {
        root = delete(root, key);
    }

    private Node delete(Node node, int key) {
        if (node == null) return null;
        if (key < node.key) node.left = delete(node.left, key);
        else if (key > node.key) node.right = delete(node.right, key);
        else {
            if (node.left == null) return node.right;
            if (node.right == null) return node.left;
            Node successor = min(node.right);
            node.key = successor.key;
            node.right = delete(node.right, successor.key);
        }
        update(node);
        return rebalance(node);
    }

    private Node min(Node node) {
        while (node.left != null) node = node.left;
        return node;
    }

    private void update(Node node) {
        node.height = 1 + Math.max(height(node.left), height(node.right));
    }

    private int height(Node node) {
        return node == null ? 0 : node.height;
    }

    private Node rebalance(Node node) {
        int diff = height(node.left) - height(node.right);
        if (diff > 1) {
            if (height(node.left.left) >= height(node.left.right)) {
                return rotateRight(node);
            }
            node.left = rotateLeft(node.left);
            return rotateRight(node);
        }
        if (diff < -1) {
            if (height(node.right.right) >= height(node.right.left)) {
                return rotateLeft(node);
            }
            node.right = rotateRight(node.right);
            return rotateLeft(node);
        }
        return node;
    }

    private Node rotateLeft(Node x) {
        Node y = x.right;
        x.right = y.left;
        y.left = x;
        update(x);
        update(y);
        return y;
    }

    private Node rotateRight(Node y) {
        Node x = y.left;
        y.left = x.right;
        x.right = y;
        update(y);
        update(x);
        return x;
    }

    public List<Integer> inOrder() {
        List<Integer> values = new ArrayList<>();
        inOrder(root, values);
        return values;
    }

    private void inOrder(Node node, List<Integer> values) {
        if (node == null) return;
        inOrder(node.left, values);
        values.add(node.key);
        inOrder(node.right, values);
    }

    public int height() {
        return height(root);
    }

    public List<Integer> rangeQuery(int start, int end) {
        List<Integer> values = new ArrayList<>();
        rangeQuery(root, start, end, values);
        return values;
    }

    private void rangeQuery(Node node, int start, int end, List<Integer> values) {
        if (node == null) return;
        if (node.key > start) rangeQuery(node.left, start, end, values);
        if (node.key >= start && node.key <= end) values.add(node.key);
        if (node.key < end) rangeQuery(node.right, start, end, values);
    }

    public static void main(String[] args) {
        AVLTree tree = new AVLTree();
        int[] values = {30, 20, 10, 25, 40, 50, 35};
        for (int value : values) tree.insert(value);
        System.out.println("AVL inorder: " + tree.inOrder());
        System.out.println("AVL search 25: " + tree.search(25));
        System.out.println("AVL height: " + tree.height());
        System.out.println("AVL range 20..40: " + tree.rangeQuery(20, 40));
    }
}
