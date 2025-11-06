import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Trash2, Mail } from 'lucide-react';
import Swal from 'sweetalert2';
import api from '../api/api.js';
import { useAuth } from '../context/AuthContext.jsx';

function PropertyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const { user } = useAuth();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      let endpoint = '/property-applications/tenant';
      
      if (user.role === 'owner') {
        endpoint = '/property-applications/owner';
      } else if (user.role === 'admin') {
        endpoint = '/property-applications/all';
      }
      
      const response = await api.get(endpoint);
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch applications'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId, status) => {
    const statusText = status === 'approved' ? 'approve' : 'reject';

    const result = await Swal.fire({
      title: `${statusText.charAt(0).toUpperCase() + statusText.slice(1)} Application`,
      text: `Are you sure you want to ${statusText} this application?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: status === 'approved' ? '#10B981' : '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: `Yes, ${statusText}`,
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await api.put(`/property-applications/${applicationId}/status`, { 
          status
        });
        
        Swal.fire({
          icon: 'success',
          title: `Application ${status.charAt(0).toUpperCase() + status.slice(1)}!`,
          text: `The application has been ${status}.`,
          timer: 2000,
          showConfirmButton: false
        });
        
        fetchApplications();
      } catch (error) {
        console.error('Error updating application status:', error);
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: error.response?.data?.error || 'Failed to update application status'
        });
      }
    }
  };

  const deleteApplication = async (applicationId) => {
    const result = await Swal.fire({
      title: 'Delete Application',
      text: 'Are you sure you want to delete this application? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/property-applications/${applicationId}`);
        
        Swal.fire({
          icon: 'success',
          title: 'Application Deleted!',
          text: 'The application has been deleted.',
          timer: 2000,
          showConfirmButton: false
        });
        
        fetchApplications();
      } catch (error) {
        console.error('Error deleting application:', error);
        Swal.fire({
          icon: 'error',
          title: 'Delete Failed',
          text: error.response?.data?.error || 'Failed to delete application'
        });
      }
    }
  };

  const getFilteredApplications = () => {
    if (activeTab === 'all') return applications;
    return applications.filter(app => app.status === activeTab);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {user.role === 'tenant' ? 'My Applications' : 'Property Applications'}
        </h1>
        
        {/* Status Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['all', 'pending', 'approved', 'rejected'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                  {tab === 'all' ? applications.length : applications.filter(app => app.status === tab).length}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Applications List */}
      {getFilteredApplications().length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
          <p className="text-gray-600">
            {activeTab === 'all' 
              ? 'No applications to display.' 
              : `No ${activeTab} applications found.`}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {getFilteredApplications().map((application) => (
            <div key={application.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    {getStatusIcon(application.status)}
                    <h3 className="text-xl font-semibold text-gray-900 ml-2">
                      {application.property_title}
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-2">{application.address}</p>
                  <p className="text-lg font-medium text-blue-600">
                    ${application.rent}/month
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  {getStatusBadge(application.status)}
                  <span className="text-sm text-gray-500">
                    Applied: {new Date(application.application_date).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Application Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    {user.role === 'tenant' ? 'Property Owner' : 'Applicant'}
                  </h4>
                  <p className="text-gray-600">
                    <strong>Name:</strong> {user.role === 'tenant' ? application.owner_name : application.tenant_name}
                  </p>
                  <p className="text-gray-600">
                    <strong>Email:</strong> {user.role === 'tenant' ? application.owner_email : application.tenant_email}
                  </p>
                  {((user.role === 'tenant' && application.owner_phone) || 
                    (user.role !== 'tenant' && application.tenant_phone)) && (
                    <p className="text-gray-600">
                      <strong>Phone:</strong> {user.role === 'tenant' ? application.owner_phone : application.tenant_phone}
                    </p>
                  )}
                </div>

                {user.role !== 'tenant' && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Application Details</h4>
                    {application.monthly_income && (
                      <p className="text-gray-600">
                        <strong>Monthly Income:</strong> ${application.monthly_income}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {application.message && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Application Message</h4>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-md">
                    {application.message}
                  </p>
                </div>
              )}


              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                {user.role === 'tenant' && application.status === 'pending' && (
                  <button
                    onClick={() => deleteApplication(application.id)}
                    className="flex items-center px-4 py-2 text-red-600 border border-red-300 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Withdraw
                  </button>
                )}

                {(user.role === 'owner' || user.role === 'admin') && application.status === 'pending' && (
                  <>
                    <button
                      onClick={() => updateApplicationStatus(application.id, 'rejected')}
                      className="flex items-center px-4 py-2 text-red-600 border border-red-300 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </button>
                    <button
                      onClick={() => updateApplicationStatus(application.id, 'approved')}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </button>
                  </>
                )}

                <button
                  onClick={() => window.open(`mailto:${user.role === 'tenant' ? application.owner_email : application.tenant_email}`, '_blank')}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Contact {user.role === 'tenant' ? 'Owner' : 'Tenant'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PropertyApplications;
