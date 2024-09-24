import React, { useState, useEffect } from 'react';

// Mock login role
const userRole = 'Admin'; // Change to 'Standard' or 'Guest' to test different roles

function Dashboard() {
  const [vmData, setVmData] = useState([]);
  const [selectedVm, setSelectedVm] = useState(null);
  const [formData, setFormData] = useState({ name: '' });
  const [newVm, setNewVm] = useState({ name: '' });
  const [backups, setBackups] = useState([]);
  const [snapshots, setSnapshots] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [userActivities, setUserActivities] = useState([]);
  const [vmRequests, setVmRequests] = useState([]);

  useEffect(() => {
    // Fetch mock data (VMs, backups, snapshots, users)
    fetch('/mockData.json')
      .then((response) => response.json())
      .then((data) => {
        setVmData(data.vms);
        setBackups(data.backups || []);
        setSnapshots(data.snapshots || []);
        setUsers(data.users || []);
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
    logUserActivity(`Edited VM: ${formData.name}`);
  };

  const handleCreateVm = () => {
    const newVM = {
      id: vmData.length + 1,
      ...newVm,
      status: 'Running',
      ownerId: selectedUser.id,
    };
    setVmData([...vmData, newVM]);
    setNewVm({ name: '' });
    logUserActivity(`Created VM: ${newVM.name}`);
  };

  const handleDelete = (id) => {
    setVmData(vmData.filter(vm => vm.id !== id));
    logUserActivity(`Deleted VM with ID: ${id}`);
  };

  const handleBackup = (vmId) => {
    const backup = {
      id: backups.length + 1,
      vmId,
      timestamp: new Date().toISOString(),
    };
    setBackups([...backups, backup]);
    alert(`Backup created for VM ID ${vmId}`);
    logUserActivity(`Backup created for VM ID: ${vmId}`);
  };

  const handleSnapshot = (vmId) => {
    const snapshot = {
      id: snapshots.length + 1,
      vmId,
      timestamp: new Date().toISOString(),
    };
    setSnapshots([...snapshots, snapshot]);
    alert(`Snapshot created for VM ID ${vmId}`);
    logUserActivity(`Snapshot created for VM ID: ${vmId}`);
  };

  // Fetch users when the move VM button is clicked
  const handleMoveVm = (vmId) => {
    setSelectedVm(vmData.find(vm => vm.id === vmId));
    fetch('/users.json') // Fetch users from API (or from the same mockData.json in this case)
      .then((response) => response.json())
      .then((data) => {
        setUsers(data.users || []); // Set the fetched users
        setIsMoveModalOpen(true);   // Open the modal after fetching users
      })
      .catch((error) => console.error('Error fetching users:', error));
  };

  const handleMoveSubmit = () => {
    if (!selectedUser) {
      alert('Please select a user to move the VM to.');
      return;
    }
    setVmData(vmData.map(vm => (vm.id === selectedVm.id ? { ...vm, ownerId: selectedUser.id } : vm)));
    logUserActivity(`Moved VM ID ${selectedVm.id} to User ID ${selectedUser.id}`);
    alert(`VM ID ${selectedVm.id} moved to User ID ${selectedUser.id}`);
    setIsMoveModalOpen(false);
  };

  const logUserActivity = (activity) => {
    setUserActivities([...userActivities, { timestamp: new Date().toISOString(), activity }]);
  };

  const handleStartVM = (id) => {
    setVmData(vmData.map(vm => (vm.id === id ? { ...vm, status: 'Running' } : vm)));
    logUserActivity(`Started VM ID: ${id}`);
  };

  const handleStopVM = (id) => {
    setVmData(vmData.map(vm => (vm.id === id ? { ...vm, status: 'Stopped' } : vm)));
    logUserActivity(`Stopped VM ID: ${id}`);
  };

  const handleVmRequest = () => {
    const request = {
      id: vmRequests.length + 1,
      userId: selectedUser.id,
      timestamp: new Date().toISOString(),
    };
    setVmRequests([...vmRequests, request]);
    alert('VM Request sent to admin.');
    logUserActivity(`VM Request made by User ID: ${selectedUser.id}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-4">Virtual Machines Dashboard</h2>

      {/* Create VM Form for Admin */}
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
            </div>
            <select 
              onChange={(e) => setSelectedUser(users.find(user => user.id === parseInt(e.target.value)))}
              className="mt-4 border p-2 rounded w-full"
            >
              <option value="">Select User</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
            <button type="submit" className="mt-4 bg-green-500 text-white px-4 py-2 rounded shadow">Create VM</button>
          </form>
        </div>
      )}

      {/* VM Table for Standard Users and Admin */}
      {(userRole === 'Admin' || userRole === 'Standard') && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-xl font-semibold mb-4">Virtual Machines</h3>
          <table className="table-auto w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-600">
                <th className="p-3 border">ID</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Status</th>
                {userRole === 'Admin' && <th className="p-3 border">Owner</th>}
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vmData.map((vm) => (
                <tr key={vm.id}>
                  <td className="p-3 border">{vm.id}</td>
                  <td className="p-3 border">{vm.name}</td>
                  <td className="p-3 border">{vm.status}</td>
                  {userRole === 'Admin' && <td className="p-3 border">{vm.ownerId}</td>}
                  <td className="p-3 border">
                    {userRole === 'Admin' && (
                      <>
                        <button onClick={() => handleEdit(vm)} className="text-blue-500">Edit</button>
                        <button onClick={() => handleDelete(vm.id)} className="text-red-500 ml-2">Delete</button>
                        <button onClick={() => handleMoveVm(vm.id)} className="text-yellow-500 ml-2">Move</button>
                      </>
                    )}
                    <button onClick={() => (vm.status === 'Stopped' ? handleStartVM(vm.id) : handleStopVM(vm.id))} className="text-green-500 ml-2">
                      {vm.status === 'Stopped' ? 'Start' : 'Stop'}
                    </button>
                    <button onClick={() => handleSnapshot(vm.id)} className="text-purple-500 ml-2">Snapshot</button>
                    <button onClick={() => handleBackup(vm.id)} className="text-gray-500 ml-2">Backup</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Move VM Modal */}
      {isMoveModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-xl font-semibold mb-4">Move VM: {selectedVm.name}</h3>
            <select
              onChange={(e) => setSelectedUser(users.find(user => user.id === parseInt(e.target.value)))}
              className="border p-2 rounded w-full"
            >
              <option value="">Select User</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
            <div className="flex justify-end mt-4">
              <button onClick={handleMoveSubmit} className="bg-blue-500 text-white px-4 py-2 rounded shadow">Move</button>
              <button onClick={() => setIsMoveModalOpen(false)} className="bg-red-500 text-white px-4 py-2 rounded shadow ml-2">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* User Activity Log */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-xl font-semibold mb-4">User Activity Log</h3>
        <ul>
          {userActivities.map((activity, index) => (
            <li key={index} className="border-b p-2">{activity.timestamp}: {activity.activity}</li>
          ))}
        </ul>
      </div>

      {/* VM Requests */}
      {userRole === 'Standard' && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-xl font-semibold mb-4">Request a VM</h3>
          <button onClick={handleVmRequest} className="bg-green-500 text-white px-4 py-2 rounded shadow">Request VM</button>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
