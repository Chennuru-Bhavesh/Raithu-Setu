function matchRequirement(requirement, listings) {
  const buyerCrop = requirement.crop_name;
  const buyerUnit = requirement.unit || 'kg';
  const filtered = listings.filter((listing) => {
    if (listing.crop_name !== buyerCrop) return false;
    if (listing.unit !== buyerUnit) return false;
    if (!['ACTIVE', 'PARTIALLY_COMMITTED'].includes(listing.status)) return false;
    if (Number(listing.remaining_quantity || 0) <= 0) return false;
    if (Number(listing.grade || 0) < Number(requirement.min_grade || 0)) return false;
    if (requirement.delivery_date && listing.harvest_date && listing.harvest_date > requirement.delivery_date) return false;
    if (requirement.max_price && Number(listing.price) > Number(requirement.max_price)) return false;
    return true;
  }).sort((a, b) => {
    if (Number(a.price) !== Number(b.price)) return Number(a.price) - Number(b.price);
    if (a.harvest_date !== b.harvest_date) return new Date(a.harvest_date) - new Date(b.harvest_date);
    if (Number(a.grade) !== Number(b.grade)) return Number(b.grade) - Number(a.grade);
    return Number(a.id) - Number(b.id);
  });

  const contributions = [];
  let remaining = Number(requirement.quantity || 0);
  for (const listing of filtered) {
    if (remaining <= 0) break;
    const qty = Math.min(Number(listing.remaining_quantity || 0), remaining);
    if (qty > 0) {
      contributions.push({ listing_id: listing.id, farmer_id: listing.farmer_id, farmer_name: listing.farmer_name || `Farmer ${listing.farmer_id}`, quantity: qty, price: Number(listing.price) });
      remaining -= qty;
    }
  }

  const shortfall = Math.max(0, Number(requirement.quantity || 0) - contributions.reduce((sum, item) => sum + item.quantity, 0));
  return {
    requirement_quantity: Number(requirement.quantity || 0),
    matched_quantity: Number(requirement.quantity || 0) - shortfall,
    shortfall,
    contributions,
    excluded_count: 0,
    excluded: []
  };
}
module.exports = { matchRequirement };
