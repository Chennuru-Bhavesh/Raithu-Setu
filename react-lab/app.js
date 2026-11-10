const { useState, useEffect } = React;

function App() {
  const [role, setRole] = useState('farmer');
  const [cropSearch, setCropSearch] = useState('tom');
  const [suggestions, setSuggestions] = useState([]);
  const [listings, setListings] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [farmerForm, setFarmerForm] = useState({ farmer_id: 1, crop_name: 'tomato', unit: 'kg', quantity: 180, price: 24, grade: 4, harvest_date: '2026-11-26' });
  const [buyerForm, setBuyerForm] = useState({ buyer_id: 6, crop_name: 'tomato', unit: 'kg', quantity: 700, min_grade: 4, max_price: 30, delivery_date: '2026-11-30' });

  useEffect(() => {
    fetch('/api/crops/search?prefix=' + encodeURIComponent(cropSearch || ''))
      .then((res) => res.json())
      .then((data) => setSuggestions(data.data || []))
      .catch(() => setSuggestions([]));
  }, [cropSearch]);

  useEffect(() => {
    fetch('/api/listings')
      .then((res) => res.json())
      .then((data) => setListings(data.data || []))
      .catch(() => setListings([]));

    fetch('/api/buyer-requirements')
      .then((res) => res.json())
      .then((data) => setRequirements(data.data || []))
      .catch(() => setRequirements([]));
  }, []);

  function submitFarmer() {
    setLoading(true);
    setError('');
    fetch('/api/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(farmerForm)
    }).then((res) => res.json())
      .then((data) => {
        if (!data.success) throw new Error(data.error || 'Unable to add listing');
        return fetch('/api/listings');
      })
      .then((res) => res.json())
      .then((data) => setListings(data.data || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  function submitRequirement() {
    setLoading(true);
    setError('');
    fetch('/api/buyer-requirements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buyerForm)
    }).then((res) => res.json())
      .then((data) => {
        if (!data.success) throw new Error(data.error || 'Unable to post requirement');
        return fetch('/api/buyer-requirements');
      })
      .then((res) => res.json())
      .then((data) => setRequirements(data.data || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  function runMatching() {
    setLoading(true);
    setError('');
    fetch('/api/lots/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ crop_name: 'tomato', unit: 'kg', quantity: 700, min_grade: 4, max_price: 30, delivery_date: '2026-11-30' })
    }).then((res) => res.json())
      .then((data) => {
        setMatch(data.data || null);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  return React.createElement('div', { className: 'container' },
    React.createElement('div', { className: 'panel' },
      React.createElement('div', { className: 'row' },
        React.createElement('h2', null, 'RaithuSetu'),
        React.createElement('span', { className: 'badge' }, 'DEMO DATA')
      ),
      React.createElement('div', { className: 'small' }, 'Farmer produce aggregation and smart selling platform')
    ),
    React.createElement('div', { className: 'panel' },
      React.createElement('h3', null, 'Role / login'),
      React.createElement('div', { className: 'row' },
        React.createElement('div', { className: 'col' },
          React.createElement('label', null, 'Select role'),
          React.createElement('select', { value: role, onChange: (e) => setRole(e.target.value) },
            React.createElement('option', { value: 'farmer' }, 'Farmer'),
            React.createElement('option', { value: 'buyer' }, 'Buyer'),
            React.createElement('option', { value: 'admin' }, 'Admin')
          )
        )
      )
    ),
    React.createElement('div', { className: 'panel' },
      React.createElement('h3', null, 'Crop search and trie suggestions'),
      React.createElement('input', { value: cropSearch, onChange: (e) => setCropSearch(e.target.value), placeholder: 'Try tom or to' }),
      React.createElement('ul', null,
        suggestions.map((item, idx) => React.createElement('li', { key: idx }, item.name || item.label))
      )
    ),
    React.createElement('div', { className: 'row' },
      React.createElement('div', { className: 'col' },
        React.createElement('div', { className: 'panel' },
          React.createElement('h3', null, 'Farmer listing form'),
          React.createElement('label', null, 'Farmer ID'),
          React.createElement('input', { type: 'number', value: farmerForm.farmer_id, onChange: (e) => setFarmerForm({ ...farmerForm, farmer_id: Number(e.target.value) }) }),
          React.createElement('label', null, 'Crop'),
          React.createElement('input', { value: farmerForm.crop_name, onChange: (e) => setFarmerForm({ ...farmerForm, crop_name: e.target.value }) }),
          React.createElement('label', null, 'Quantity'),
          React.createElement('input', { type: 'number', value: farmerForm.quantity, onChange: (e) => setFarmerForm({ ...farmerForm, quantity: Number(e.target.value) }) }),
          React.createElement('label', null, 'Price'),
          React.createElement('input', { type: 'number', value: farmerForm.price, onChange: (e) => setFarmerForm({ ...farmerForm, price: Number(e.target.value) }) }),
          React.createElement('label', null, 'Grade'),
          React.createElement('input', { type: 'number', value: farmerForm.grade, onChange: (e) => setFarmerForm({ ...farmerForm, grade: Number(e.target.value) }) }),
          React.createElement('label', null, 'Harvest date'),
          React.createElement('input', { type: 'date', value: farmerForm.harvest_date, onChange: (e) => setFarmerForm({ ...farmerForm, harvest_date: e.target.value }) }),
          React.createElement('button', { onClick: submitFarmer, style: { marginTop: 12 } }, loading ? 'Submitting...' : 'Add Listing')
        )
      ),
      React.createElement('div', { className: 'col' },
        React.createElement('div', { className: 'panel' },
          React.createElement('h3', null, 'Buyer requirement form'),
          React.createElement('label', null, 'Buyer ID'),
          React.createElement('input', { type: 'number', value: buyerForm.buyer_id, onChange: (e) => setBuyerForm({ ...buyerForm, buyer_id: Number(e.target.value) }) }),
          React.createElement('label', null, 'Crop'),
          React.createElement('input', { value: buyerForm.crop_name, onChange: (e) => setBuyerForm({ ...buyerForm, crop_name: e.target.value }) }),
          React.createElement('label', null, 'Quantity'),
          React.createElement('input', { type: 'number', value: buyerForm.quantity, onChange: (e) => setBuyerForm({ ...buyerForm, quantity: Number(e.target.value) }) }),
          React.createElement('label', null, 'Min grade'),
          React.createElement('input', { type: 'number', value: buyerForm.min_grade, onChange: (e) => setBuyerForm({ ...buyerForm, min_grade: Number(e.target.value) }) }),
          React.createElement('label', null, 'Max price'),
          React.createElement('input', { type: 'number', value: buyerForm.max_price, onChange: (e) => setBuyerForm({ ...buyerForm, max_price: Number(e.target.value) }) }),
          React.createElement('label', null, 'Delivery date'),
          React.createElement('input', { type: 'date', value: buyerForm.delivery_date, onChange: (e) => setBuyerForm({ ...buyerForm, delivery_date: e.target.value }) }),
          React.createElement('button', { onClick: submitRequirement, style: { marginTop: 12 } }, loading ? 'Submitting...' : 'Post Requirement')
        )
      )
    ),
    React.createElement('div', { className: 'panel' },
      React.createElement('button', { onClick: runMatching }, 'Run matching algorithm'),
      error && React.createElement('div', { className: 'error' }, error),
      match && React.createElement('div', null,
        React.createElement('h3', null, 'Matching result'),
        React.createElement('p', null, 'Matched quantity: ' + match.matched_quantity + ' kg'),
        React.createElement('p', null, 'Shortfall: ' + match.shortfall + ' kg'),
        React.createElement('table', null,
          React.createElement('thead', null,
            React.createElement('tr', null,
              React.createElement('th', null, 'Farmer'),
              React.createElement('th', null, 'Quantity'),
              React.createElement('th', null, 'Price')
            )
          ),
          React.createElement('tbody', null,
            (match.contributions || []).map((row, idx) => React.createElement('tr', { key: idx },
              React.createElement('td', null, row.farmer_name || 'Farmer'),
              React.createElement('td', null, row.quantity),
              React.createElement('td', null, '?' + Number(row.price).toFixed(2))
            ))
          )
        )
      )
    ),
    React.createElement('div', { className: 'panel' },
      React.createElement('h3', null, 'Listing table'),
      React.createElement('table', null,
        React.createElement('thead', null,
          React.createElement('tr', null,
            React.createElement('th', null, 'Farmer'),
            React.createElement('th', null, 'Crop'),
            React.createElement('th', null, 'Qty'),
            React.createElement('th', null, 'Price')
          )
        ),
        React.createElement('tbody', null,
          listings.map((item) => React.createElement('tr', { key: item.id },
            React.createElement('td', null, item.farmer_id),
            React.createElement('td', null, item.crop_name),
            React.createElement('td', null, item.quantity),
            React.createElement('td', null, '?' + Number(item.price).toFixed(2))
          ))
        )
      )
    ),
    React.createElement('div', { className: 'panel' },
      React.createElement('h3', null, 'Requirements'),
      React.createElement('table', null,
        React.createElement('thead', null,
          React.createElement('tr', null,
            React.createElement('th', null, 'Crop'),
            React.createElement('th', null, 'Qty'),
            React.createElement('th', null, 'Min grade')
          )
        ),
        React.createElement('tbody', null,
          requirements.map((item) => React.createElement('tr', { key: item.id },
            React.createElement('td', null, item.crop_name),
            React.createElement('td', null, item.quantity),
            React.createElement('td', null, item.min_grade)
          ))
        )
      )
    )
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
