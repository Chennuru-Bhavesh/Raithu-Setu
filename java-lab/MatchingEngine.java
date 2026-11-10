import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class MatchingEngine {
    public static Models.MatchResult match(Models.Requirement requirement, List<Models.Listing> listings) {
        Models.MatchResult result = new Models.MatchResult();
        result.requirementQuantity = requirement.quantity;
        List<Models.Listing> filtered = new ArrayList<>();
        for (Models.Listing listing : listings) {
            if (!listing.cropName.equalsIgnoreCase(requirement.cropName)) continue;
            if (!listing.unit.equalsIgnoreCase(requirement.unit)) continue;
            if (!"ACTIVE".equals(listing.status) && !"PARTIALLY_COMMITTED".equals(listing.status)) continue;
            if (listing.remainingQuantity <= 0) continue;
            if (listing.grade < requirement.minGrade) continue;
            if (requirement.maxPrice != null && listing.price.compareTo(requirement.maxPrice) > 0) continue;
            filtered.add(listing);
        }

        filtered.sort(Comparator
                .comparing((Models.Listing l) -> l.price)
                .thenComparing(l -> l.harvestDate)
                .thenComparingInt(l -> l.grade)
                .reversed());

        int remaining = requirement.quantity;
        for (Models.Listing listing : filtered) {
            if (remaining <= 0) break;
            int take = Math.min(listing.remainingQuantity, remaining);
            if (take > 0) {
                result.contributions.add(new Models.MatchContribution(
                        listing.id,
                        listing.farmerId,
                        listing.farmerName,
                        take,
                        listing.price));
                remaining -= take;
            }
        }

        result.matchedQuantity = requirement.quantity - remaining;
        result.shortfall = remaining;
        result.excludedCount = 0;
        return result;
    }
}
