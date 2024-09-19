import React, { useEffect, useState } from 'react';

function Dashboard() {
  const [vms, setVms] = useState([]);

  useEffect(() => {
    // Simulate fetching data with mock VMs
    const mockVMs = [
      { id: 1, name: 'VM 1' },
      { id: 2, name: 'VM 2' },
      { id: 3, name: 'VM 3' }
    ];
    setVms(mockVMs);
  }, []);

  const createVM = () => {
    const newVM = { id: vms.length + 1, name: `VM ${vms.length + 1}` };
    setVms([...vms, newVM]);
  };

  const deleteVM = (vmId) => {
    const updatedVMs = vms.filter(vm => vm.id !== vmId);
    setVms(updatedVMs);
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl mb-4">Your Virtual Machines (Mock Data)</h2>
      <button onClick={createVM} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
        Create New VM
      </button>
      <div className="grid grid-cols-3 gap-4">
        {vms.map(vm => (
          <div key={vm.id} className="p-4 bg-white shadow rounded">
            <h3 className="text-xl">{vm.name}</h3>
            <button onClick={() => deleteVM(vm.id)} className="bg-red-500 text-white px-2 py-1 mt-2 rounded">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
