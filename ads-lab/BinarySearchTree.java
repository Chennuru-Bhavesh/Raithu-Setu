import java.util.ArrayList;
import java.util.List;

public class BinarySearchTree {
    private Node root;

    static class Node {
        int key;
        Node left, right;

        Node(int key) {
            this.key = key;
        }
    }

    public void insert(int key) {
        root = insert(root, key);
    }

    private Node insert(Node node, int key) {
        if (node == null) return new Node(key);
        if (key < node.key) node.left = insert(node.left, key);
        else if (key > node.key) node.right = insert(node.right, key);
        return node;
    }

    public boolean search(int key) {
        Node current = root;
        while (current != null) {
            if (key == current.key) return true;
            current = key < current.key ? current.left : current.right;
        }
        return false;
    }

    public int height() {
        return height(root);
    }

    private int height(Node node) {
        if (node == null) return 0;
        return 1 + Math.max(height(node.left), height(node.right));
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

    public static void main(String[] args) {
        BinarySearchTree bst = new BinarySearchTree();
        int[] values = {10, 20, 30, 40, 50, 60, 70};
        for (int value : values) bst.insert(value);
        System.out.println("BST inorder: " + bst.inOrder());
        System.out.println("BST height: " + bst.height());
        System.out.println("BST search 40: " + bst.search(40));
    }
}
