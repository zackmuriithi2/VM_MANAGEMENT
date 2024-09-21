import React, { useState, useEffect } from 'react';

function Billing() {
  const [billingData, setBillingData] = useState([]);
  const [totalAmountDue, setTotalAmountDue] = useState(0);

  // Fetch billing data from the JSON file
  useEffect(() => {
    fetch('/mockData.json')
      .then((response) => response.json())
      .then((data) => {
        setBillingData(data.billing);
        calculateTotalAmountDue(data.billing);
      })
      .catch((error) => console.error('Error fetching billing data:', error));
  }, []);

  // Calculate total amount due
  const calculateTotalAmountDue = (data) => {
    const total = data.reduce((sum, bill) => sum + parseFloat(bill.amount), 0);
    setTotalAmountDue(total);
  };

  // Check if a bill is overdue
  const isOverdue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    return due < today;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-4">Billing Information</h2>

      {/* Billing Summary */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="text-xl font-semibold mb-2">Total Amount Due: <span className="text-green-500">${totalAmountDue.toFixed(2)}</span></h3>
        <p className="text-gray-700">Review your billing details and make sure to settle any overdue payments.</p>
      </div>

      {/* Billing Table */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Billing Details</h3>
        <table className="table-auto w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-600">
              <th className="p-3 border">ID</th>
              <th className="p-3 border">VM Name</th>
              <th className="p-3 border">Amount ($)</th>
              <th className="p-3 border">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {billingData.map((bill) => (
              <tr key={bill.id} className={isOverdue(bill.dueDate) ? "bg-red-100" : "hover:bg-gray-100"}>
                <td className="p-3 border">{bill.id}</td>
                <td className="p-3 border">{bill.vmName}</td>
                <td className="p-3 border">${bill.amount}</td>
                <td className="p-3 border">
                  {isOverdue(bill.dueDate) ? (
                    <span className="text-red-500 font-bold">{bill.dueDate} (Overdue)</span>
                  ) : (
                    bill.dueDate
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Billing;
