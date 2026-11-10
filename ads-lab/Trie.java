import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

public class Trie {
    private final Node root = new Node();

    private static class Node {
        Map<Character, Node> children = new TreeMap<>();
        boolean isWord;
        String alias;
    }

    public static String normalize(String value) {
        if (value == null) return "";
        return value.trim().toLowerCase().replaceAll("\s+", " ");
    }

    public void insert(String cropName) {
        String key = normalize(cropName);
        if (key.isEmpty()) return;
        Node current = root;
        for (char ch : key.toCharArray()) {
            current.children.putIfAbsent(ch, new Node());
            current = current.children.get(ch);
        }
        current.isWord = true;
        current.alias = key;
    }

    public List<String> prefixSearch(String prefix, int limit) {
        String key = normalize(prefix);
        if (key.isEmpty()) return new ArrayList<>();
        Node current = root;
        for (char ch : key.toCharArray()) {
            if (!current.children.containsKey(ch)) return new ArrayList<>();
            current = current.children.get(ch);
        }

        List<String> results = new ArrayList<>();
        collect(current, key, results, limit);
        return results;
    }

    private void collect(Node node, String prefix, List<String> out, int limit) {
        if (out.size() >= limit) return;
        if (node.isWord) {
            out.add(prefix);
        }
        for (Map.Entry<Character, Node> entry : node.children.entrySet()) {
            collect(entry.getValue(), prefix + entry.getKey(), out, limit);
            if (out.size() >= limit) break;
        }
    }

    public void delete(String cropName) {
        String key = normalize(cropName);
        delete(root, key, 0);
    }

    private boolean delete(Node node, String key, int depth) {
        if (depth == key.length()) {
            if (!node.isWord) return false;
            node.isWord = false;
            node.alias = null;
            return node.children.isEmpty();
        }
        char ch = key.charAt(depth);
        Node child = node.children.get(ch);
        if (child == null) return false;
        boolean shouldDelete = delete(child, key, depth + 1);
        if (shouldDelete) node.children.remove(ch);
        return node.children.isEmpty() && !node.isWord;
    }

    public static void main(String[] args) {
        Trie trie = new Trie();
        for (String crop : new String[]{"tomato", "onion", "potato", "tamarind", "tomato"}) {
            trie.insert(crop);
        }
        System.out.println("Trie demo: prefix 'to' => " + trie.prefixSearch("to", 10));
        System.out.println("Trie demo: prefix 'tom' => " + trie.prefixSearch("tom", 10));
    }
}
