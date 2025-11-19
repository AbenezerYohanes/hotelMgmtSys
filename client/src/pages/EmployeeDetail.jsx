import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { hrService } from '../services/api';
import { uploadsService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [employee, setEmployee] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  const canManage = ['super_admin', 'admin', 'manager'].includes(user?.role);

  useEffect(() => {
    fetchEmployee();
    fetchDocuments();
    // eslint-disable-next-line
  }, [id]);

  const fetchEmployee = async () => {
    try {
      const res = await hrService.getEmployee(id);
      const data = res?.data || res || null;
      setEmployee(data);
    } catch (err) {
      toast.error('Failed to load employee');
    }
  };

  const fetchDocuments = async () => {
    try {
      const res = await uploadsService.getStaffDocuments(id);
      const list = res?.data || res || [];
      setDocuments(list);
    } catch (err) {
      toast.error('Failed to fetch documents');
    }
  };

  const handleDelete = async (docId) => {
    if (!window.confirm('Delete this document?')) return;
    try {
      await uploadsService.deleteStaffDocument(docId);
      toast.success('Document deleted');
      fetchDocuments();
    } catch (err) {
      toast.error('Failed to delete document');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Employee Details</h1>
        <button onClick={() => navigate(-1)} className="px-3 py-1 bg-gray-200 rounded">Back</button>
      </div>
      <div className="mt-4 bg-white p-6 rounded shadow">
        {employee ? (
          <div>
            <div className="text-lg font-medium">{employee.first_name} {employee.last_name}</div>
            <div className="text-sm text-gray-600">{employee.position} • {employee.department_name}</div>
            <div className="mt-2">Email: {employee.email}</div>
            <div>Phone: {employee.phone}</div>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>

      <div className="mt-6 bg-white p-6 rounded shadow">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Documents</h2>
          {canManage && (
            <button onClick={() => navigate(`/admin/hr`)} className="px-3 py-1 bg-blue-600 text-white rounded">Manage</button>
          )}
        </div>

        <div className="mt-4">
          {documents.length === 0 && <div className="text-gray-500">No documents uploaded.</div>}
          <ul className="divide-y divide-gray-200">
            {documents.map((d) => (
              <li key={d.id} className="py-2 flex items-center justify-between">
                <div>
                  <a href={d.path} target="_blank" rel="noreferrer" className="text-blue-600 underline">{d.filename}</a>
                  <div className="text-xs text-gray-500">Uploaded: {new Date(d.uploaded_at).toLocaleString()}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <a href={d.path} target="_blank" rel="noreferrer" className="px-2 py-1 bg-green-100 text-green-800 rounded">Download</a>
                  {canManage && (
                    <button onClick={() => handleDelete(d.id)} className="px-2 py-1 bg-red-100 text-red-800 rounded">Delete</button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;
