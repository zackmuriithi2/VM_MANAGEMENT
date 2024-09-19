import React, { useEffect, useState } from 'react';

function Billing() {
  const [billingInfo, setBillingInfo] = useState([]);

  useEffect(() => {
    // Simulate fetching billing info
    const mockBillingInfo = [
      { id: 1, description: 'Subscription Payment', amount: '$20', date: '2024-09-01' },
      { id: 2, description: 'Additional Storage', amount: '$5', date: '2024-09-10' }
    ];
    setBillingInfo(mockBillingInfo);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl mb-4">Billing Information (Mock Data)</h2>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2">Amount</th>
            <th className="px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {billingInfo.map(item => (
            <tr key={item.id}>
              <td className="border px-4 py-2">{item.description}</td>
              <td className="border px-4 py-2">{item.amount}</td>
              <td className="border px-4 py-2">{item.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Billing;
