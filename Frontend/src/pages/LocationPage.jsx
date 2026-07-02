import React from 'react';
import { Link } from 'react-router-dom';

function LocationPage() {
  const locations = [
    {
      id: 'cape-town',
      name: 'Cape Town',
      province: 'Western Cape',
      image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=600&q=80',
      description: 'Explore stunning beaches, iconic Table Mountain, and scenic vineyards.'
    },
    {
      id: 'johannesburg',
      name: 'Johannesburg',
      province: 'Gauteng',
      image: 'PLACEHOLDER_GRADIENT', 
      description: 'Experience vibrant urban culture, rich history, and dynamic city life.'
    },
    {
      id: 'durban',
      name: 'Durban',
      province: 'KwaZulu-Natal',
      image: 'https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?auto=format&fit=crop&w=600&q=80',
      description: 'Enjoy warm golden beaches, sub-tropical weather, and diverse cuisine.'
    },
    {
      id: 'krueger',
      name: 'Kruger National Park',
      province: 'Mpumalanga',
      image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=600&q=80',
      description: 'Embark on world-class wildlife safaris to spot the iconic Big Five.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Navigation Bar */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50 px-6 py-4 flex justify-between items-center shadow-sm">
        <Link to="/" className="text-rose-500 font-bold text-2xl tracking-tight">
          airbnb
        </Link>
        <div className="flex items-center gap-6 font-medium text-sm text-gray-600">
          <Link to="/" className="hover:text-black transition">Home</Link>
          <Link to="/admin/login" className="bg-rose-500 text-white px-4 py-2 rounded-full hover:bg-rose-600 transition shadow-sm">
            Become a Host
          </Link>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Incredible destinations</h1>
          <p className="text-gray-500 text-lg">Find the perfect region for your next getaway stay.</p>
        </header>

        {/* Location Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {locations.map((loc) => (
            <div key={loc.id} className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 flex flex-col hover:shadow-lg transition duration-200">
              <div className="h-48 overflow-hidden relative">
                
                
                {loc.image === 'PLACEHOLDER_GRADIENT' ? (
                  <div className="w-full h-full bg-gradient-to-br from-amber-500 via-orange-600 to-rose-700 flex flex-col justify-center items-center text-white p-4 text-center transform hover:scale-105 transition duration-300">
                    <span className="text-3xl mb-1">🏙️</span>
                    <span className="font-bold tracking-wide text-sm uppercase">Johannesburg City</span>
                  </div>
                ) : (
                  <img 
                    src={loc.image} 
                    alt={loc.name} 
                    className="w-full h-full object-cover transform hover:scale-105 transition duration-300"
                  />
                )}

              </div>
              <div className="p-5 flex flex-col flex-grow">
                <span className="text-xs font-semibold text-rose-500 uppercase tracking-wider mb-1">
                  {loc.province}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{loc.name}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
                  {loc.description}
                </p>
                <Link 
                  to={`/`} 
                  className="w-full text-center bg-gray-900 hover:bg-black text-white font-medium py-2 px-4 rounded-xl transition duration-150 text-sm shadow-sm"
                >
                  View Local Stays
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default LocationPage;