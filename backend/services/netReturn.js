function calculateNetReturn({ totalTransportCost, contributions, packagingCostPerKg = 1.2 }) {
  const totalQty = contributions.reduce((sum, item) => sum + Number(item.quantity || 0), 0) || 1;
  return contributions.map((item) => {
    const quantity = Number(item.quantity || 0);
    const grossRevenue = Number((quantity * item.price).toFixed(2));
    const transportShare = Number((totalTransportCost * (quantity / totalQty)).toFixed(2));
    const packaging = Number((quantity * packagingCostPerKg).toFixed(2));
    const netReturn = Number((grossRevenue - transportShare - packaging).toFixed(2));
    return {
      farmer: item.farmer_name || `Farmer ${item.farmer_id}`,
      quantity,
      grossRevenue,
      transportShare,
      packaging,
      netReturn,
      netPerKg: quantity > 0 ? Number((netReturn / quantity).toFixed(2)) : 0
    };
  });
}
module.exports = { calculateNetReturn };
