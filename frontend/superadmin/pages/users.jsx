import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import Table from '../../common/components/Table'
import toast from 'react-hot-toast'
import Modal from '../../common/components/Modal'
import Confirm from '../../common/components/Confirm'
import './users.css'

function EditUserForm({ user, onUpdated, onClose }) {
  const [email, setEmail] = useState(user?.email || '');
  const [name, setName] = useState(user?.name || '');
  const [role, setRole] = useState(user?.role || '');
  const [availableRoles, setAvailableRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await axios.get((process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000') + '/api/superadmin/roles', { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } });
        setAvailableRoles(res.data.roles);
      } catch (err) {
        console.error('Failed to fetch roles:', err);
        toast.error('Failed to load roles');
      } finally {
        setLoadingRoles(false);
      }
    };
    fetchRoles();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await axios.put((process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000') + '/api/superadmin/users/' + user.id, { email, name, role }, { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } });
      toast.success('User updated');
      onUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Update failed');
    }
  };

  return (
    <form onSubmit={submit} className="user-form">
      <div className="form-group">
        <label htmlFor="user-email">Email</label>
        <input id="user-email" value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <div className="form-group">
        <label htmlFor="user-name">Name</label>
        <input id="user-name" value={name} onChange={e => setName(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Role</label>
        {loadingRoles ? (
          <div className="loading-roles">Loading roles...</div>
        ) : (
          <div className="role-buttons">
            {availableRoles.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.name)}
                className={`role-button ${role === r.name ? 'selected' : ''}`}
              >
                {r.name.charAt(0).toUpperCase() + r.name.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="form-submit">
        <button type="submit">Save</button>
      </div>
    </form>
  )
}

// Prop types for components
EditUserForm.propTypes = {
  user: PropTypes.object,
  onUpdated: PropTypes.func,
  onClose: PropTypes.func
}


function CreateUserForm({ onCreated, onClose }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [availableRoles, setAvailableRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await axios.get((process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000') + '/api/superadmin/roles', { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } });
        setAvailableRoles(res.data.roles);
        if (res.data.roles.length > 0) {
          setRole(res.data.roles[0].name); // Set default to first role
        }
      } catch (err) {
        console.error('Failed to fetch roles:', err);
        toast.error('Failed to load roles');
      } finally {
        setLoadingRoles(false);
      }
    };
    fetchRoles();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await axios.post((process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000') + '/api/superadmin/users', { email, name, password, role }, { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } });
      toast.success('User created');
      onCreated();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to create user');
    }
  };

  return (
    <form onSubmit={submit}>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="create-email">Email</label><br />
        <input id="create-email" value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="create-name">Name</label><br />
        <input id="create-name" value={name} onChange={e => setName(e.target.value)} />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="create-password">Password</label><br />
        <input id="create-password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>Role</label><br />
        {loadingRoles ? (
          <div>Loading roles...</div>
        ) : (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {availableRoles.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.name)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: role === r.name ? '#007bff' : '#f8f9fa',
                  color: role === r.name ? '#fff' : '#000',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {r.name.charAt(0).toUpperCase() + r.name.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>
      <div><button type="submit">Create</button></div>
    </form>
  )
}

CreateUserForm.propTypes = {
  onCreated: PropTypes.func,
  onClose: PropTypes.func
}

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  const fetch = async () => {
    try {
      const res = await axios.get((process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000') + '/api/superadmin/users', { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load users');
    }
  };

  useEffect(() => { fetch(); }, []);

  const columns = [
    { key: 'id', title: 'ID' },
    { key: 'email', title: 'Email' },
    { key: 'name', title: 'Name' },
    { key: 'role', title: 'Role' },
    { key: 'createdAt', title: 'Created' }
  ];

  const confirmDelete = (id) => {
    setToDeleteId(id);
    setConfirmOpen(true);
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete((process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000') + '/api/superadmin/users/' + id, { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } });
      toast.success('User deleted');
      fetch();
    } catch (err) {
      console.error(err);
      toast.error('Delete failed');
    } finally {
      setConfirmOpen(false);
      setToDeleteId(null);
    }
  };

  // append actions column
  columns.push({
    key: 'actions', title: 'Actions', render: (row) => (
      <div className="action-buttons">
        <button onClick={() => navigator.clipboard.writeText(row.email)}>Copy Email</button>
        <button onClick={() => { setEditingUser(row); setOpen(true); }}>Edit</button>
        <button onClick={() => confirmDelete(row.id)}>Delete</button>
      </div>
    )
  });

  return (
    <div className="users-page">
      <div className="page-header">
        <h2>Users</h2>
        <button onClick={() => setOpen(true)} className="btn-primary">Create User</button>
      </div>
      <Table columns={columns} data={users} />
      <Modal open={open} title={editingUser ? 'Edit User' : 'Create User'} onClose={() => { setOpen(false); setEditingUser(null); }}>
        {editingUser ? <EditUserForm user={editingUser} onUpdated={fetch} onClose={() => { setOpen(false); setEditingUser(null); }} /> : <CreateUserForm onCreated={fetch} onClose={() => setOpen(false)} />}
      </Modal>
      <Confirm open={confirmOpen} title="Delete User" message={"Are you sure you want to delete user #" + (toDeleteId || '')} onConfirm={() => deleteUser(toDeleteId)} onCancel={() => setConfirmOpen(false)} />
    </div>
  )
}
