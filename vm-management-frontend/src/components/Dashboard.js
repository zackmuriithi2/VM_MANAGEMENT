import React, { useState, useEffect } from 'react';

// Modal component
function Modal({ isOpen, onClose, onSubmit, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">&times;</button>
        </div>
        {children}
        <div className="flex justify-end mt-4">
          <button onClick={onSubmit} className="bg-green-500 text-white px-4 py-2 rounded shadow">Create VM</button>
        </div>
      </div>
    </div>
  );
}

const userRole = 'Admin'; // Change this to 'Standard' or 'Guest' to test different roles

function Dashboard() {
  const [vmData, setVmData] = useState([]);
  const [selectedVm, setSelectedVm] = useState(null);
  const [formData, setFormData] = useState({ name: '', cpu: '', ram: '', storage: '' });
  const [newVm, setNewVm] = useState({ name: '', cpu: '', ram: '', storage: '' });
  const [backups, setBackups] = useState([]);
  const [snapshots, setSnapshots] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('/mockData.json')
      .then((response) => response.json())
      .then((data) => {
        setVmData(data.vms);
        setBackups(data.backups || []);
        setSnapshots(data.snapshots || []);
        setUsers(data.users || []); // Assuming users data is also available in the mock data
      })
      .catch((error) => console.error('Error fetching mock data:', error));
  }, []);

  const handleCreateVm = () => {
    const newVM = {
      id: vmData.length + 1,
      ...newVm,
      status: 'Running',
    };
    setVmData([...vmData, newVM]);
    setNewVm({ name: '', cpu: '', ram: '', storage: '' });
    setIsModalOpen(false); // Close modal after submission
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVm({ ...newVm, [name]: value });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-4">Virtual Machines Dashboard</h2>

      {/* Button to open Create VM Modal */}
      {userRole === 'Admin' && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-500 text-white px-4 py-2 rounded shadow mb-4"
        >
          Create New VM
        </button>
      )}

      {/* Create VM Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateVm}
      >
        <h3 className="text-xl font-semibold mb-4">Create New VM</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">VM Name:</label>
            <input
              type="text"
              name="name"
              value={newVm.name}
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
              value={newVm.cpu}
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
              value={newVm.ram}
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
              value={newVm.storage}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>
        </div>
      </Modal>

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
                        <button className="bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
                        <button className="bg-red-500 text-white px-2 py-1 rounded ml-2">Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Users and VM Requests Table */}
      {users.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-xl font-semibold mb-4">User VM Requests</h3>
          <table className="table-auto w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-600">
                <th className="p-3 border">User ID</th>
                <th className="p-3 border">Username</th>
                <th className="p-3 border">Requested VM</th>
                <th className="p-3 border">Requested CPU</th>
                <th className="p-3 border">Requested RAM</th>
                <th className="p-3 border">Requested Storage</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-100">
                  <td className="p-3 border">{user.id}</td>
                  <td className="p-3 border">{user.username}</td>
                  <td className="p-3 border">{user.requestedVm}</td>
                  <td className="p-3 border">{user.requestedCpu} Cores</td>
                  <td className="p-3 border">{user.requestedRam} GB</td>
                  <td className="p-3 border">{user.requestedStorage} GB</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
