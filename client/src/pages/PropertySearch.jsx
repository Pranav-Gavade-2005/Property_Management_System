import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, MapPin, Bed, Bath, Square } from 'lucide-react';
import Swal from 'sweetalert2';
import api from '../api/api.js';
import { useAuth } from '../context/AuthContext.jsx';

function PropertySearch() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState({
    search: '',
    minRent: '',
    maxRent: '',
    bedrooms: '',
    property_type: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await api.get('/properties/available');
      setProperties(response.data.properties);
    } catch (error) {
      console.error('Error fetching properties:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch properties'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      Object.entries(searchFilters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const response = await api.get(`/properties/search?${params.toString()}`);
      setProperties(response.data.properties);
    } catch (error) {
      console.error('Error searching properties:', error);
      Swal.fire({
        icon: 'error',
        title: 'Search Error',
        text: 'Failed to search properties'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setSearchFilters({
      ...searchFilters,
      [e.target.name]: e.target.value
    });
  };

  const clearFilters = () => {
    setSearchFilters({
      search: '',
      minRent: '',
      maxRent: '',
      bedrooms: '',
      property_type: ''
    });
    fetchProperties();
  };

  const applyForProperty = async (propertyId) => {
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
          property_id: propertyId,
          ...formValues
        });

        Swal.fire({
          icon: 'success',
          title: 'Application Submitted!',
          text: 'Your application has been sent to the property owner.',
          timer: 3000,
          showConfirmButton: false
        });

        fetchProperties();
      } catch (error) {
        console.error('Error applying for property:', error);
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
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Search Properties</h1>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                name="search"
                value={searchFilters.search}
                onChange={handleFilterChange}
                placeholder="Search by title, address, or description..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Search
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 pt-4 border-t">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Rent</label>
                <input
                  type="number"
                  name="minRent"
                  value={searchFilters.minRent}
                  onChange={handleFilterChange}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Rent</label>
                <input
                  type="number"
                  name="maxRent"
                  value={searchFilters.maxRent}
                  onChange={handleFilterChange}
                  placeholder="10000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Bedrooms</label>
                <select
                  name="bedrooms"
                  value={searchFilters.bedrooms}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                <select
                  name="property_type"
                  value={searchFilters.property_type}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="condo">Condo</option>
                  <option value="townhouse">Townhouse</option>
                </select>
              </div>


              <div className="flex items-end">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Results Count */}
        <p className="text-gray-600 mb-4">
          {properties.length} {properties.length === 1 ? 'property' : 'properties'} found
        </p>
      </div>

      {/* Properties Grid */}
      {properties.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🏠</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
          <p className="text-gray-600">Try adjusting your search filters to find more properties.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                {property.image_path ? (
                  <img
                    src={`http://localhost:4000${property.image_path}`}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-4xl">🏠</span>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-gray-900">{property.title}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    property.status === 'available' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {property.status}
                  </span>
                </div>
                
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{property.address}</span>
                </div>

                {property.description && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{property.description}</p>
                )}
                
                <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Bed className="h-4 w-4 mr-1" />
                    <span>{property.bedrooms} bed</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="h-4 w-4 mr-1" />
                    <span>{property.bathrooms} bath</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-blue-600">
                    ₹{property.rent}/month
                  </span>
                  {property.property_type && (
                    <span className="text-sm text-gray-500 capitalize">{property.property_type}</span>
                  )}
                </div>
                
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Owner:</strong> {property.owner_name}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    <strong>Contact:</strong> {property.owner_email}
                  </p>
                  
                  <div className="flex space-x-2">
                    <Link
                      to={`/property/${property.id}`}
                      className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      View Details
                    </Link>
                    
                    {user && user.role === 'tenant' && property.status === 'available' && (
                      <button
                        onClick={() => applyForProperty(property.id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Apply Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PropertySearch;
