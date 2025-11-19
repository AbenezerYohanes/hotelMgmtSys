import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api, { hrService, uploadsService } from '../services/api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';

const HR = () => {
  const { user } = useAuth();
  const canManage = ['super_admin', 'admin', 'manager'].includes(user?.role);
  const [activeTab, setActiveTab] = useState('employees');
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [payroll, setPayroll] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [showDeptForm, setShowDeptForm] = useState(false);
  const [showAttendanceForm, setShowAttendanceForm] = useState(false);
  const [showPayrollForm, setShowPayrollForm] = useState(false);

  // Form states
  const [employeeForm, setEmployeeForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    department_id: '',
    position: '',
    salary: '',
    hire_date: ''
  });

  const [editingEmployeeId, setEditingEmployeeId] = useState(null);

  const employeeSchema = z.object({
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email'),
    phone: z.string().optional(),
    department_id: z.string().optional(),
    position: z.string().min(1, 'Position is required'),
    salary: z.preprocess((v) => Number(v), z.number().nonnegative()),
    hire_date: z.string().optional()
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(employeeSchema),
    defaultValues: { first_name: '', last_name: '', email: '', phone: '', department_id: '', position: '', salary: '', hire_date: '' }
  });

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadEmployeeId, setUploadEmployeeId] = useState(null);

  const [deptForm, setDeptForm] = useState({
    name: '',
    description: '',
    manager_id: ''
  });

  const [attendanceForm, setAttendanceForm] = useState({
    employee_id: '',
    date: new Date().toISOString().split('T')[0],
    status: 'present',
    check_in_time: '',
    check_out_time: '',
    notes: ''
  });

  const [payrollForm, setPayrollForm] = useState({
    employee_id: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
    fetchAttendance();
    fetchPayroll();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await hrService.getEmployees();
      const list = response?.data || response || [];
      setEmployees(list);
    } catch (error) {
      toast.error('Failed to fetch employees');
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/hr/departments');
      setDepartments(response.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch departments');
    }
  };

  const handleDeptSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { name: deptForm.name, description: deptForm.description };
      // manager_id is optional and may require elevated privileges; include only if set
      if (deptForm.manager_id) payload.manager_id = deptForm.manager_id;
      const res = await api.post('/hr/departments', payload);
      toast.success('Department created');
      setShowDeptForm(false);
      setDeptForm({ name: '', description: '', manager_id: '' });
      // Refresh departments and pre-select the newly created one if returned
      await fetchDepartments();
      const newDeptId = res.data?.data?.id ?? res.data?.data?.id;
      if (newDeptId) setEmployeeForm(prev => ({ ...prev, department_id: newDeptId }));
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create department';
      toast.error(msg);
    }
    setLoading(false);
  };

    const handleEmployeeEdit = (employee) => {
      setEditingEmployeeId(employee.id);
      reset({
        first_name: employee.first_name || '',
        last_name: employee.last_name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        department_id: employee.department_id || '',
        position: employee.position || '',
        salary: employee.salary || '',
        hire_date: employee.hire_date ? employee.hire_date.split('T')[0] : ''
      });
      setShowEmployeeForm(true);
    };

    const handleEmployeeDelete = async (id) => {
      if (!window.confirm('Delete this employee?')) return;
      try {
        await hrService.deleteEmployee(id);
        toast.success('Employee deleted');
        fetchEmployees();
      } catch (err) {
        const msg = err.response?.data?.message || 'Failed to delete employee';
        toast.error(msg);
      }
    };

  const openUploadFor = (employee) => {
    setUploadEmployeeId(employee.id);
    setUploadFile(null);
    setShowUploadModal(true);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadFile) {
      toast.error('Please choose a file to upload');
      return;
    }
    setLoading(true);
    try {
      await uploadsService.uploadStaffDocument(uploadEmployeeId, uploadFile);
      toast.success('Document uploaded');
      setShowUploadModal(false);
      setUploadEmployeeId(null);
      setUploadFile(null);
      fetchEmployees();
    } catch (err) {
      const msg = err.response?.data?.message || 'Upload failed';
      toast.error(msg);
    }
    setLoading(false);
  };

  const fetchAttendance = async () => {
    try {
      const response = await api.get('/attendance');
      setAttendance(response.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch attendance');
    }
  };

  const fetchPayroll = async () => {
    try {
      const response = await api.get('/payroll');
      setPayroll(response.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch payroll');
    }
  };

  const handleEmployeeSubmit = async (data) => {
    setLoading(true);
    try {
      if (editingEmployeeId) {
        await hrService.updateEmployee(editingEmployeeId, data);
        toast.success('Employee updated successfully');
      } else {
        await hrService.createEmployee(data);
        toast.success('Employee added successfully');
      }
      setShowEmployeeForm(false);
      setEditingEmployeeId(null);
      reset();
      fetchEmployees();
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to save employee';
      toast.error(msg);
    }
    setLoading(false);
  };

  const handleAttendanceSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/attendance', attendanceForm);
      toast.success('Attendance marked successfully');
      setShowAttendanceForm(false);
      setAttendanceForm({
        employee_id: '',
        date: new Date().toISOString().split('T')[0],
        status: 'present',
        check_in_time: '',
        check_out_time: '',
        notes: ''
      });
      fetchAttendance();
    } catch (error) {
      toast.error('Failed to mark attendance');
    }
    setLoading(false);
  };

  const handlePayrollGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/payroll/generate', payrollForm);
      toast.success('Payroll generated successfully');
      setShowPayrollForm(false);
      setPayrollForm({
        employee_id: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
      });
      fetchPayroll();
    } catch (error) {
      toast.error('Failed to generate payroll');
    }
    setLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      case 'on_leave': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPayrollStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">HR Management</h1>
        <p className="mt-1 text-sm text-gray-500">Manage employees, attendance, and payroll</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'employees', name: 'Employees' },
            { id: 'attendance', name: 'Attendance' },
            { id: 'payroll', name: 'Payroll' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Employees Tab */}
      {activeTab === 'employees' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Employees</h2>
            {canManage && (
              <button
                onClick={() => {
                  setEditingEmployeeId(null);
                  reset({ first_name: '', last_name: '', email: '', phone: '', department_id: '', position: '', salary: '', hire_date: '' });
                  setShowEmployeeForm(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Add Employee
              </button>
            )}
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {employees.map((employee) => (
                <li key={employee.id}>
                  <div className="px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {employee.first_name?.[0]}{employee.last_name?.[0]}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {employee.first_name} {employee.last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {employee.position} • {employee.department_name}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        ${employee.salary?.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {employee.employee_id}
                      </div>
                      {canManage && (
                        <div className="mt-2 flex justify-end space-x-2">
                          <button onClick={() => handleEmployeeEdit(employee)} className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">Edit</button>
                          <button onClick={() => openUploadFor(employee)} className="px-2 py-1 bg-blue-100 text-blue-800 rounded">Upload</button>
                          <button onClick={() => handleEmployeeDelete(employee.id)} className="px-2 py-1 bg-red-100 text-red-800 rounded">Delete</button>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {showUploadModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Document for Employee</h3>
              <form onSubmit={handleUploadSubmit} className="space-y-4">
                <input
                  type="file"
                  accept="*/*"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="w-full"
                  required
                />
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Uploading...' : 'Upload'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Tab */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Attendance</h2>
            <button
              onClick={() => setShowAttendanceForm(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Mark Attendance
            </button>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {attendance.map((record) => (
                <li key={record.id}>
                  <div className="px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {record.first_name?.[0]}{record.last_name?.[0]}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {record.first_name} {record.last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {record.date} • {record.department_name}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm text-gray-500">
                          {record.check_in_time} - {record.check_out_time || 'N/A'}
                        </div>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Payroll Tab */}
      {activeTab === 'payroll' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Payroll</h2>
            <button
              onClick={() => setShowPayrollForm(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
            >
              Generate Payroll
            </button>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {payroll.map((record) => (
                <li key={record.id}>
                  <div className="px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {record.first_name?.[0]}{record.last_name?.[0]}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {record.first_name} {record.last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {record.month}/{record.year} • {record.department_name}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          ${record.net_salary?.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {record.days_worked} days worked
                        </div>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPayrollStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Employee Form Modal */}
      {showEmployeeForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add Employee</h3>
              <form onSubmit={handleSubmit(handleEmployeeSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input type="text" placeholder="First Name" {...register('first_name')} className="border rounded-md px-3 py-2" />
                    {errors.first_name && <div className="text-red-600 text-sm">{errors.first_name.message}</div>}
                  </div>
                  <div>
                    <input type="text" placeholder="Last Name" {...register('last_name')} className="border rounded-md px-3 py-2" />
                    {errors.last_name && <div className="text-red-600 text-sm">{errors.last_name.message}</div>}
                  </div>
                </div>
                <div>
                  <input type="email" placeholder="Email" {...register('email')} className="border rounded-md px-3 py-2 w-full" />
                  {errors.email && <div className="text-red-600 text-sm">{errors.email.message}</div>}
                </div>
                <div>
                  <input type="tel" placeholder="Phone" {...register('phone')} className="border rounded-md px-3 py-2 w-full" />
                </div>
                <div className="flex space-x-2">
                  <select {...register('department_id')} className="border rounded-md px-3 py-2 flex-1">
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                  <button type="button" onClick={() => setShowDeptForm(true)} className="px-3 py-2 bg-gray-100 rounded-md border hover:bg-gray-200" title="Add Department">+ Dept</button>
                </div>
                <div>
                  <input type="text" placeholder="Position" {...register('position')} className="border rounded-md px-3 py-2 w-full" />
                  {errors.position && <div className="text-red-600 text-sm">{errors.position.message}</div>}
                </div>
                <div>
                  <input type="number" placeholder="Salary" {...register('salary')} className="border rounded-md px-3 py-2 w-full" />
                  {errors.salary && <div className="text-red-600 text-sm">{errors.salary.message}</div>}
                </div>
                <div>
                  <input type="date" placeholder="Hire Date" {...register('hire_date')} className="border rounded-md px-3 py-2 w-full" />
                </div>
                <div className="flex space-x-3">
                  <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50">
                    {loading ? (editingEmployeeId ? 'Updating...' : 'Saving...') : (editingEmployeeId ? 'Update Employee' : 'Add Employee')}
                  </button>
                  <button type="button" onClick={() => setShowEmployeeForm(false)} className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Form Modal */}
      {showAttendanceForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Mark Attendance</h3>
              <form onSubmit={handleAttendanceSubmit} className="space-y-4">
                <select
                  value={attendanceForm.employee_id}
                  onChange={(e) => setAttendanceForm({...attendanceForm, employee_id: e.target.value})}
                  className="border rounded-md px-3 py-2 w-full"
                  required
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name}</option>
                  ))}
                </select>
                {/* Add Department Modal */}
                  
                <input
                  type="date"
                  value={attendanceForm.date}
                  onChange={(e) => setAttendanceForm({...attendanceForm, date: e.target.value})}
                  className="border rounded-md px-3 py-2 w-full"
                  required
                />
                <select
                  value={attendanceForm.status}
                  onChange={(e) => setAttendanceForm({...attendanceForm, status: e.target.value})}
                  className="border rounded-md px-3 py-2 w-full"
                  required
                >
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                  <option value="on_leave">On Leave</option>
                </select>
                <input
                  type="time"
                  placeholder="Check In Time"
                  value={attendanceForm.check_in_time}
                  onChange={(e) => setAttendanceForm({...attendanceForm, check_in_time: e.target.value})}
                  className="border rounded-md px-3 py-2 w-full"
                />
                <input
                  type="time"
                  placeholder="Check Out Time"
                  value={attendanceForm.check_out_time}
                  onChange={(e) => setAttendanceForm({...attendanceForm, check_out_time: e.target.value})}
                  className="border rounded-md px-3 py-2 w-full"
                />
                <textarea
                  placeholder="Notes"
                  value={attendanceForm.notes}
                  onChange={(e) => setAttendanceForm({...attendanceForm, notes: e.target.value})}
                  className="border rounded-md px-3 py-2 w-full"
                  rows="3"
                />
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    {loading ? 'Marking...' : 'Mark Attendance'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAttendanceForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Payroll Form Modal */}
      {showPayrollForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Generate Payroll</h3>
              <form onSubmit={handlePayrollGenerate} className="space-y-4">
                <select
                  value={payrollForm.employee_id}
                  onChange={(e) => setPayrollForm({...payrollForm, employee_id: e.target.value})}
                  className="border rounded-md px-3 py-2 w-full"
                  required
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name}</option>
                  ))}
                </select>
                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={payrollForm.month}
                    onChange={(e) => setPayrollForm({...payrollForm, month: parseInt(e.target.value)})}
                    className="border rounded-md px-3 py-2"
                    required
                  >
                    {Array.from({length: 12}, (_, i) => (
                      <option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('default', {month: 'long'})}</option>
                    ))}
                  </select>
                  <select
                    value={payrollForm.year}
                    onChange={(e) => setPayrollForm({...payrollForm, year: parseInt(e.target.value)})}
                    className="border rounded-md px-3 py-2"
                    required
                  >
                    {Array.from({length: 5}, (_, i) => {
                      const year = new Date().getFullYear() - 2 + i;
                      return <option key={year} value={year}>{year}</option>;
                    })}
                  </select>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 disabled:opacity-50"
                  >
                    {loading ? 'Generating...' : 'Generate Payroll'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPayrollForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
      </div>
        </div>
      )}

      {/* Add Department Modal (top-level) */}
      {showDeptForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add Department</h3>
              <form onSubmit={handleDeptSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Department Name"
                  value={deptForm.name}
                  onChange={(e) => setDeptForm({...deptForm, name: e.target.value})}
                  className="border rounded-md px-3 py-2 w-full"
                  required
                />
                <textarea
                  placeholder="Description (optional)"
                  value={deptForm.description}
                  onChange={(e) => setDeptForm({...deptForm, description: e.target.value})}
                  className="border rounded-md px-3 py-2 w-full"
                  rows={3}
                />
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Adding...' : 'Add Department'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeptForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HR;
