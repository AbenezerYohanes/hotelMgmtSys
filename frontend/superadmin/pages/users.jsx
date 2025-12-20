import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import Table from '../../common/components/Table'
import toast from 'react-hot-toast'
import Modal from '../../common/components/Modal'
import Confirm from '../../common/components/Confirm'

function EditUserForm({ user, onUpdated, onClose }) {
  const [email, setEmail] = useState(user?.email || '');
  const [name, setName] = useState(user?.name || '');
  const [role, setRole] = useState(user?.role || 'guest');

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
    <form onSubmit={submit}>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="user-email">Email</label><br/>
        <input id="user-email" value={email} onChange={e=>setEmail(e.target.value)} />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="user-name">Name</label><br/>
        <input id="user-name" value={name} onChange={e=>setName(e.target.value)} />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="user-role">Role</label><br/>
        <select id="user-role" value={role} onChange={e=>setRole(e.target.value)}>
          <option value="guest">Guest</option>
          <option value="receptionist">Receptionist</option>
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
          <option value="superadmin">Superadmin</option>
        </select>
      </div>
      <div><button type="submit">Save</button></div>
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
  const [role, setRole] = useState('guest');

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
        <label htmlFor="create-email">Email</label><br/>
        <input id="create-email" value={email} onChange={e=>setEmail(e.target.value)} />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="create-name">Name</label><br/>
        <input id="create-name" value={name} onChange={e=>setName(e.target.value)} />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="create-password">Password</label><br/>
        <input id="create-password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="create-role">Role</label><br/>
        <select id="create-role" value={role} onChange={e=>setRole(e.target.value)}>
          <option value="guest">Guest</option>
          <option value="receptionist">Receptionist</option>
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
          <option value="superadmin">Superadmin</option>
        </select>
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
  columns.push({ key: 'actions', title: 'Actions', render: (row) => (
    <div>
      <button onClick={() => navigator.clipboard.writeText(row.email)}>Copy Email</button>
      <button onClick={() => { setEditingUser(row); setOpen(true); }} style={{ marginLeft: 8 }}>Edit</button>
      <button onClick={() => confirmDelete(row.id)} style={{ marginLeft: 8 }}>Delete</button>
    </div>
  ) });

  return (
    <div style={{ padding: 24 }}>
      <h2>Users</h2>
      <div style={{ marginBottom: 12 }}><button onClick={() => setOpen(true)}>Create User</button></div>
      <Table columns={columns} data={users} />
      <Modal open={open} title={editingUser ? 'Edit User' : 'Create User'} onClose={() => { setOpen(false); setEditingUser(null); }}>
        {editingUser ? <EditUserForm user={editingUser} onUpdated={fetch} onClose={() => { setOpen(false); setEditingUser(null); }} /> : <CreateUserForm onCreated={fetch} onClose={() => setOpen(false)} />}
      </Modal>
      <Confirm open={confirmOpen} title="Delete User" message={"Are you sure you want to delete user #" + (toDeleteId || '')} onConfirm={() => deleteUser(toDeleteId)} onCancel={() => setConfirmOpen(false)} />
    </div>
  )
}
