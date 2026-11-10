import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class MaxHeap<T> {
    private final List<T> data = new ArrayList<>();
    private final Comparator<T> comparator;

    public MaxHeap(Comparator<T> comparator) {
        this.comparator = comparator;
    }

    public void offer(T value) {
        data.add(value);
        int index = data.size() - 1;
        while (index > 0) {
            int parent = (index - 1) / 2;
            if (comparator.compare(data.get(parent), data.get(index)) >= 0) break;
            swap(parent, index);
            index = parent;
        }
    }

    public T poll() {
        if (data.isEmpty()) return null;
        T root = data.get(0);
        T last = data.remove(data.size() - 1);
        if (!data.isEmpty()) {
            data.set(0, last);
            heapify(0);
        }
        return root;
    }

    private void heapify(int index) {
        int left = 2 * index + 1;
        int right = 2 * index + 2;
        int largest = index;

        if (left < data.size() && comparator.compare(data.get(left), data.get(largest)) > 0) {
            largest = left;
        }
        if (right < data.size() && comparator.compare(data.get(right), data.get(largest)) > 0) {
            largest = right;
        }
        if (largest != index) {
            swap(index, largest);
            heapify(largest);
        }
    }

    private void swap(int first, int second) {
        T temp = data.get(first);
        data.set(first, data.get(second));
        data.set(second, temp);
    }

    public boolean isEmpty() {
        return data.isEmpty();
    }

    public static void main(String[] args) {
        MaxHeap<Integer> heap = new MaxHeap<>(Integer::compareTo);
        int[] values = {18, 32, 7, 41, 12, 27};
        for (int value : values) heap.offer(value);
        System.out.println("Max heap ranked values:");
        while (!heap.isEmpty()) System.out.print(heap.poll() + " ");
        System.out.println();
    }
}
