import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Bed, Bath, Home, DollarSign, User, Phone, Mail } from 'lucide-react';
import Swal from 'sweetalert2';
import api from '../api/api.js';
import { useAuth } from '../context/AuthContext.jsx';

function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/properties/${id}`);
      setProperty(response.data.property);
    } catch (error) {
      console.error('Error fetching property:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch property details'
      });
    } finally {
      setLoading(false);
    }
  };

  const applyForProperty = async () => {
    if (user.role !== 'tenant') {
      Swal.fire({
        icon: 'warning',
        title: 'Access Denied',
        text: 'Only tenants can apply for properties'
      });
      return;
    }

    const { value: formValues } = await Swal.fire({
      title: 'Apply for Property',
      html: `
        <div class="text-left space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Why are you interested?</label>
            <textarea id="swal-message" class="w-full px-3 py-2 border border-gray-300 rounded-md" rows="3" placeholder="Tell the owner why you would be a good tenant..."></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Monthly Income (₹)</label>
            <input id="swal-income" type="number" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="5000">
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Submit Application',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        return {
          message: document.getElementById('swal-message').value,
          monthly_income: document.getElementById('swal-income').value
        }
      }
    });

    if (formValues) {
      try {
        await api.post('/property-applications', {
          property_id: id,
          ...formValues
        });

        Swal.fire({
          icon: 'success',
          title: 'Application Submitted!',
          text: 'Your application has been sent to the property owner.',
          timer: 3000,
          showConfirmButton: false
        });
      } catch (error) {
        console.error('Error submitting application:', error);
        Swal.fire({
          icon: 'error',
          title: 'Application Failed',
          text: error.response?.data?.error || 'Failed to submit application'
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h2>
          <Link to="/search" className="text-blue-600 hover:text-blue-800">
            ← Back to Search
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Link 
        to="/search" 
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Search
      </Link>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Property Image */}
        <div className="w-full h-64 bg-gray-200 flex items-center justify-center overflow-hidden">
          {property.image_path ? (
            <img
              src={`http://localhost:4000${property.image_path}`}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <Home className="h-16 w-16 text-gray-400" />
          )}
        </div>

        <div className="p-8">
          {/* Property Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{property.address}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                ₹{property.rent}/month
              </div>
              <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                property.status === 'available' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {property.status}
              </span>
            </div>
          </div>

          {/* Property Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center">
              <Bed className="h-6 w-6 text-gray-400 mr-3" />
              <div>
                <div className="font-medium text-gray-900">{property.bedrooms}</div>
                <div className="text-sm text-gray-500">Bedrooms</div>
              </div>
            </div>
            <div className="flex items-center">
              <Bath className="h-6 w-6 text-gray-400 mr-3" />
              <div>
                <div className="font-medium text-gray-900">{property.bathrooms}</div>
                <div className="text-sm text-gray-500">Bathrooms</div>
              </div>
            </div>
            <div className="flex items-center">
              <Home className="h-6 w-6 text-gray-400 mr-3" />
              <div>
                <div className="font-medium text-gray-900 capitalize">{property.property_type}</div>
                <div className="text-sm text-gray-500">Property Type</div>
              </div>
            </div>
          </div>

          {/* Description */}
          {property.description && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Description</h3>
              <p className="text-gray-600 leading-relaxed">{property.description}</p>
            </div>
          )}

          {/* Owner Information */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Property Owner</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <User className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-700">{property.owner_name}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-700">{property.owner_email}</span>
              </div>
              {property.owner_phone && (
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-700">{property.owner_phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Apply Button */}
          {property.status === 'available' && user?.role === 'tenant' && (
            <div className="text-center">
              <button
                onClick={applyForProperty}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Apply for This Property
              </button>
            </div>
          )}

          {property.status !== 'available' && (
            <div className="text-center">
              <div className="bg-gray-100 text-gray-600 px-8 py-3 rounded-lg text-lg font-medium">
                This property is not currently available
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PropertyDetails;
