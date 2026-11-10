import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

public class NetReturnCalculator {
    private static final int SCALE = 2;
    private static final RoundingMode MODE = RoundingMode.HALF_UP;

    public static List<Models.NetReturnLine> calculate(Models.Requirement requirement, List<Models.MatchContribution> contributions,
                                                       BigDecimal transportCost, BigDecimal packagingPerKg) {
        List<Models.NetReturnLine> rows = new ArrayList<>();
        int totalQty = 0;
        for (Models.MatchContribution contribution : contributions) {
            totalQty += contribution.quantity;
        }
        if (totalQty <= 0) return rows;

        for (Models.MatchContribution contribution : contributions) {
            int quantity = contribution.quantity;
            BigDecimal grossRevenue = new BigDecimal(quantity).multiply(contribution.price).setScale(SCALE, MODE);
            BigDecimal shareRatio = new BigDecimal(quantity).divide(new BigDecimal(totalQty), SCALE, MODE);
            BigDecimal transportShare = transportCost.multiply(shareRatio).setScale(SCALE, MODE);
            BigDecimal packaging = new BigDecimal(quantity).multiply(packagingPerKg).setScale(SCALE, MODE);
            BigDecimal netReturn = grossRevenue.subtract(transportShare).subtract(packaging).setScale(SCALE, MODE);
            BigDecimal netPerKg = (quantity > 0)
                    ? netReturn.divide(new BigDecimal(quantity), SCALE, MODE)
                    : BigDecimal.ZERO.setScale(SCALE, MODE);
            rows.add(new Models.NetReturnLine(contribution.farmerName, quantity, grossRevenue, transportShare, packaging,
                    netReturn, netPerKg));
        }
        return rows;
    }
}
