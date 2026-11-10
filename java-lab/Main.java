import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Main {
    private static final List<Models.Listing> DEMO_LISTINGS = new ArrayList<>();
    private static final Models.Requirement DEMO_REQUIREMENT =
            new Models.Requirement(1, 6, "tomato", "kg", 700, 4, new BigDecimal("30"), "2026-11-30");

    static {
        DEMO_LISTINGS.add(new Models.Listing(1, 1, "Farmer A", "tomato", "kg", 100, 100, new BigDecimal("24"), 4, "2026-11-20", "ACTIVE"));
        DEMO_LISTINGS.add(new Models.Listing(2, 2, "Farmer B", "tomato", "kg", 150, 150, new BigDecimal("25"), 4, "2026-11-21", "ACTIVE"));
        DEMO_LISTINGS.add(new Models.Listing(3, 3, "Farmer C", "tomato", "kg", 200, 200, new BigDecimal("23"), 5, "2026-11-22", "ACTIVE"));
        DEMO_LISTINGS.add(new Models.Listing(4, 4, "Farmer D", "tomato", "kg", 250, 250, new BigDecimal("22"), 4, "2026-11-23", "ACTIVE"));
        DEMO_LISTINGS.add(new Models.Listing(5, 5, "Farmer E", "tomato", "kg", 300, 300, new BigDecimal("21"), 5, "2026-11-24", "ACTIVE"));
    }

    public static void main(String[] args) throws Exception {
        ApiClient api = new ApiClient("http://localhost:3000");
        boolean offline = args.length > 0 && "--offline".equals(args[0]) || !api.isHealthy();

        Scanner scanner = new Scanner(System.in);
        if (offline) {
            System.out.println("OFFLINE DEMO MODE - DEMO DATA");
            showOfflineDemo();
            return;
        }

        System.out.println("Connected to backend. Demo mode available.");
        System.out.println("1. Register user");
        System.out.println("2. Show crop search");
        System.out.println("3. Run matching demo");
        System.out.println("4. Exit");
        int choice = scanner.nextInt();
        if (choice == 3) showOfflineDemo();
    }

    private static void showOfflineDemo() {
        Models.MatchResult result = MatchingEngine.match(DEMO_REQUIREMENT, DEMO_LISTINGS);
        System.out.println("Buyer requirement: 700 kg of tomatoes.");
        System.out.println("Proposed lot contributions:");
        for (Models.MatchContribution contribution : result.contributions) {
            System.out.printf("- Farmer %s (%s): %d kg at INR %.2f%n",
                    contribution.farmerName,
                    contribution.farmerName,
                    contribution.quantity,
                    contribution.price.doubleValue());
        }
        if (result.shortfall > 0) {
            System.out.println("Shortfall: " + result.shortfall + " kg");
        }

        BigDecimal transportCost = new BigDecimal("1750.00");
        List<Models.NetReturnLine> rows = NetReturnCalculator.calculate(DEMO_REQUIREMENT, result.contributions, transportCost, new BigDecimal("1.20"));
        System.out.println("ESTIMATE: net return per farmer");
        System.out.println("Farmer | Qty | Gross Revenue | Transport | Packaging | Net Return | Net/kg");
        for (Models.NetReturnLine row : rows) {
            System.out.printf("%s | %d | INR %.2f | INR %.2f | INR %.2f | INR %.2f | INR %.2f%n",
                    row.farmer, row.quantity, row.grossRevenue.doubleValue(), row.transport.doubleValue(),
                    row.packaging.doubleValue(), row.netReturn.doubleValue(), row.netPerKg.doubleValue());
        }
    }
}
