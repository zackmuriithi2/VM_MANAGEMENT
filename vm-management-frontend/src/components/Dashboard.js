import React, { useState, useEffect } from 'react';

const userRole = 'Admin'; // Change this to 'Standard' or 'Guest' to test different roles

function Dashboard() {
  const [vmData, setVmData] = useState([]);
  const [selectedVm, setSelectedVm] = useState(null);
  const [formData, setFormData] = useState({ name: '', cpu: '', ram: '', storage: '' });
  const [newVm, setNewVm] = useState({ name: '', cpu: '', ram: '', storage: '' });
  const [backups, setBackups] = useState([]);
  const [snapshots, setSnapshots] = useState([]);

  useEffect(() => {
    fetch('/mockData.json')
      .then((response) => response.json())
      .then((data) => {
        setVmData(data.vms);
        setBackups(data.backups || []);
        setSnapshots(data.snapshots || []);
      })
      .catch((error) => console.error('Error fetching mock data:', error));
  }, []);

  const handleEdit = (vm) => {
    setSelectedVm(vm);
    setFormData(vm);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    setVmData(vmData.map(vm => vm.id === selectedVm.id ? { ...selectedVm, ...formData } : vm));
    setSelectedVm(null);
  };

  const handleCreateVm = () => {
    const newVM = {
      id: vmData.length + 1,
      ...newVm,
      status: 'Running',
    };
    setVmData([...vmData, newVM]);
    setNewVm({ name: '', cpu: '', ram: '', storage: '' });
  };

  const handleDelete = (id) => {
    setVmData(vmData.filter(vm => vm.id !== id));
  };

  const handleBackup = (vmId) => {
    const backup = {
      id: backups.length + 1,
      vmId,
      timestamp: new Date().toISOString(),
    };
    setBackups([...backups, backup]);
    alert(`Backup created for VM ID ${vmId}`); // Optional: Alert to confirm backup creation
  };

  const handleSnapshot = (vmId) => {
    const snapshot = {
      id: snapshots.length + 1,
      vmId,
      timestamp: new Date().toISOString(),
    };
    setSnapshots([...snapshots, snapshot]);
    alert(`Snapshot created for VM ID ${vmId}`); // Optional: Alert to confirm snapshot creation
  };

  const handleStartVM = (id) => {
    setVmData(vmData.map(vm => (vm.id === id ? { ...vm, status: 'Running' } : vm)));
  };

  const handleStopVM = (id) => {
    setVmData(vmData.map(vm => (vm.id === id ? { ...vm, status: 'Stopped' } : vm)));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-4">Virtual Machines Dashboard</h2>

      {/* Create VM Form */}
      {userRole === 'Admin' && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-xl font-semibold mb-4">Create New VM</h3>
          <form onSubmit={(e) => { e.preventDefault(); handleCreateVm(); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">VM Name:</label>
                <input
                  type="text"
                  name="name"
                  value={newVm.name}
                  onChange={(e) => setNewVm({ ...newVm, name: e.target.value })}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">CPU (Cores):</label>
                <input
                  type="number"
                  name="cpu"
                  value={newVm.cpu}
                  onChange={(e) => setNewVm({ ...newVm, cpu: e.target.value })}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">RAM (GB):</label>
                <input
                  type="number"
                  name="ram"
                  value={newVm.ram}
                  onChange={(e) => setNewVm({ ...newVm, ram: e.target.value })}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Storage (GB):</label>
                <input
                  type="number"
                  name="storage"
                  value={newVm.storage}
                  onChange={(e) => setNewVm({ ...newVm, storage: e.target.value })}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
            </div>
            <button type="submit" className="mt-4 bg-green-500 text-white px-4 py-2 rounded shadow">Create VM</button>
          </form>
        </div>
      )}

      {/* VM Table */}
      {vmData.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-xl font-semibold mb-4">Virtual Machines</h3>
          <table className="table-auto w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-600">
                <th className="p-3 border">ID</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">CPU</th>
                <th className="p-3 border">RAM</th>
                <th className="p-3 border">Storage</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vmData.map((vm) => (
                <tr key={vm.id} className="hover:bg-gray-100">
                  <td className="p-3 border">{vm.id}</td>
                  <td className="p-3 border">{vm.name}</td>
                  <td className="p-3 border">{vm.status}</td>
                  <td className="p-3 border">{vm.cpu} Cores</td>
                  <td className="p-3 border">{vm.ram} GB</td>
                  <td className="p-3 border">{vm.storage} GB</td>
                  <td className="p-3 border">
                    {userRole === 'Admin' && (
                      <>
                        <button onClick={() => handleEdit(vm)} className="bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
                        <button onClick={() => handleStartVM(vm.id)} className="bg-green-500 text-white px-2 py-1 rounded ml-2">Start</button>
                        <button onClick={() => handleStopVM(vm.id)} className="bg-red-500 text-white px-2 py-1 rounded ml-2">Stop</button>
                        <button onClick={() => handleSnapshot(vm.id)} className="bg-yellow-500 text-white px-2 py-1 rounded ml-2">Snapshot</button>
                        <button onClick={() => handleBackup(vm.id)} className="bg-purple-500 text-white px-2 py-1 rounded ml-2">Backup</button>
                      </>
                    )}
                    <button onClick={() => handleDelete(vm.id)} className="bg-red-500 text-white px-2 py-1 rounded ml-2">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit VM Form */}
      {selectedVm && userRole === 'Admin' && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-xl font-semibold mb-4">Edit VM: {selectedVm.name}</h3>
          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">VM Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">CPU (Cores):</label>
                <input
                  type="number"
                  name="cpu"
                  value={formData.cpu}
                  onChange={handleInputChange}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">RAM (GB):</label>
                <input
                  type="number"
                  name="ram"
                  value={formData.ram}
                  onChange={handleInputChange}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Storage (GB):</label>
                <input
                  type="number"
                  name="storage"
                  value={formData.storage}
                  onChange={handleInputChange}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
            </div>
            <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded shadow">Save Changes</button>
          </form>
        </div>
      )}

      {/* Backups Section */}
      {backups.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-xl font-semibold mb-4">Backups</h3>
          <ul>
            {backups.map((backup) => (
              <li key={backup.id} className="border-b p-2">
                Backup ID: {backup.id} | VM ID: {backup.vmId} | Timestamp: {backup.timestamp}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Snapshots Section */}
      {snapshots.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-xl font-semibold mb-4">Snapshots</h3>
          <ul>
            {snapshots.map((snapshot) => (
              <li key={snapshot.id} className="border-b p-2">
                Snapshot ID: {snapshot.id} | VM ID: {snapshot.vmId} | Timestamp: {snapshot.timestamp}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
