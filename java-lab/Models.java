import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class Models {
    public static class User {
        public int id;
        public String name;
        public String role;
        public String username;

        public User(int id, String name, String role, String username) {
            this.id = id;
            this.name = name;
            this.role = role;
            this.username = username;
        }
    }

    public static class Listing {
        public int id;
        public int farmerId;
        public String farmerName;
        public String cropName;
        public String unit;
        public int quantity;
        public int remainingQuantity;
        public BigDecimal price;
        public int grade;
        public String harvestDate;
        public String status;

        public Listing(int id, int farmerId, String farmerName, String cropName, String unit, int quantity, int remainingQuantity,
                       BigDecimal price, int grade, String harvestDate, String status) {
            this.id = id;
            this.farmerId = farmerId;
            this.farmerName = farmerName;
            this.cropName = cropName;
            this.unit = unit;
            this.quantity = quantity;
            this.remainingQuantity = remainingQuantity;
            this.price = price;
            this.grade = grade;
            this.harvestDate = harvestDate;
            this.status = status;
        }
    }

    public static class Requirement {
        public int id;
        public int buyerId;
        public String cropName;
        public String unit;
        public int quantity;
        public int minGrade;
        public BigDecimal maxPrice;
        public String deliveryDate;

        public Requirement(int id, int buyerId, String cropName, String unit, int quantity, int minGrade, BigDecimal maxPrice, String deliveryDate) {
            this.id = id;
            this.buyerId = buyerId;
            this.cropName = cropName;
            this.unit = unit;
            this.quantity = quantity;
            this.minGrade = minGrade;
            this.maxPrice = maxPrice;
            this.deliveryDate = deliveryDate;
        }
    }

    public static class MatchContribution {
        public int listingId;
        public int farmerId;
        public String farmerName;
        public int quantity;
        public BigDecimal price;

        public MatchContribution(int listingId, int farmerId, String farmerName, int quantity, BigDecimal price) {
            this.listingId = listingId;
            this.farmerId = farmerId;
            this.farmerName = farmerName;
            this.quantity = quantity;
            this.price = price;
        }
    }

    public static class MatchResult {
        public int requirementQuantity;
        public int matchedQuantity;
        public int shortfall;
        public List<MatchContribution> contributions = new ArrayList<>();
        public int excludedCount;
        public List<String> excludedReasons = new ArrayList<>();
    }

    public static class NetReturnLine {
        public final String farmer;
        public final int quantity;
        public final BigDecimal grossRevenue;
        public final BigDecimal transport;
        public final BigDecimal packaging;
        public final BigDecimal netReturn;
        public final BigDecimal netPerKg;

        public NetReturnLine(String farmer, int quantity, BigDecimal grossRevenue, BigDecimal transport, BigDecimal packaging,
                            BigDecimal netReturn, BigDecimal netPerKg) {
            this.farmer = farmer;
            this.quantity = quantity;
            this.grossRevenue = grossRevenue;
            this.transport = transport;
            this.packaging = packaging;
            this.netReturn = netReturn;
            this.netPerKg = netPerKg;
        }
    }
}
