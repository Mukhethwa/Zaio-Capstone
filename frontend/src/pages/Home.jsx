import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

function Home() {
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [futureTab, setFutureTab] = useState('outdoor');

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        const response = await axios.get('/api/accommodations');
        setAccommodations(response.data);
        setLoading(false);
      } catch (err) {
        setError('Could not load listings. Please try again later.');
        setLoading(false);
      }
    };
    fetchAccommodations();
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-rose-100">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-6">
        
        {/* HERO BANNER SECTION */}
        <div className="relative w-full h-[60vh] md:h-[70vh] rounded-2xl overflow-hidden mb-12 shadow-md">
            <img 
                src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
                alt="Beautiful cabin landscape" 
                className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end items-center pb-16 px-4">
                <h1 className="text-white text-4xl md:text-5xl font-bold tracking-tight text-center mb-6 drop-shadow-lg">
                    Not sure where to go? Perfect.
                </h1>
                <Link to="/locations" className="bg-white px-8 py-4 rounded-full font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-rose-500 hover:shadow-xl transition transform hover:scale-105 shadow-lg border border-gray-100 no-underline">
                    I'm flexible
                </Link>
            </div>
        </div>

        {/* Property Showcase Header */}
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Explore stays</h2>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center max-w-md mx-auto border border-red-100">
            {error}
          </div>
        )}

        {!loading && !error && (
          accommodations.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl max-w-xl mx-auto px-4 mb-16">
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No properties found</h3>
              <p className="mt-1 text-sm text-gray-500">Your cloud database is connected, but it's currently empty!</p>
              <div className="mt-6">
                <Link to="/admin/login" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-rose-500 hover:bg-rose-600 no-underline">
                  Go to Admin and Add One
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
              {accommodations.map((item) => (
                <Link to={`/location/${item._id}`} key={item._id} className="group flex flex-col gap-2 no-underline">
                  <div className="aspect-square w-full relative overflow-hidden rounded-xl bg-gray-100">
                    <img 
                      src={item.image ? `http://localhost:5000${item.image}` : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6'} 
                      alt={item.title} 
                      className="h-full w-full object-cover object-center group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute top-3 right-3 text-white/80 hover:text-white transition cursor-pointer">
                        <svg viewBox="0 0 32 32" fill="currentColor" stroke="white" strokeWidth="2" className="w-6 h-6 drop-shadow-md">
                            <path d="M16 28c7-4.73 14-10 14-17a6.98 6.98 0 0 0-7-6.5c-3 0-5.36 1.54-7 3.25C14.36 6.04 12 4.5 9 4.5A6.98 6.98 0 0 0 2 11c0 7 7 12.27 14 17z"></path>
                        </svg>
                    </div>
                  </div>
                  <div className="flex justify-between items-start mt-1">
                    <h3 className="font-semibold text-gray-900 text-sm truncate max-w-[80%]">{item.title || item.name}</h3>
                    <div className="flex items-center text-sm">
                        <span className="text-gray-900 font-semibold text-xs ml-1">★ 4.96</span>
                    </div>
                  </div>
                  <p className="text-gray-500 text-xs truncate">{item.location || 'Cape Town, South Africa'}</p>
                  <p className="text-sm mt-0.5"><span className="font-semibold text-gray-900">R{item.price || '0'}</span> <span className="text-gray-600 text-xs">night</span></p>
                </Link>
              ))}
            </div>
          )
        )}

        {/* 1. INSPIRATION FOR YOUR NEXT TRIP SECTION (UPDATED WITH REAL PHOTOS) */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-6">Inspiration for your next trip</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/locations" className="group rounded-xl overflow-hidden h-64 relative flex flex-col justify-end p-5 no-underline shadow-sm transition transform hover:-translate-y-1">
              <img src="https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=800&q=80" alt="Cape Town" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="relative z-10 text-white">
                <div className="font-bold text-lg leading-tight">Cape Town Stays</div>
                <p className="text-xs text-white/80 mt-1">Explore coastal horizons</p>
              </div>
            </Link>
            
            <Link to="/locations" className="group rounded-xl overflow-hidden h-64 relative flex flex-col justify-end p-5 no-underline shadow-sm transition transform hover:-translate-y-1">
              <img src="https://images.unsplash.com/photo-1558980394-0a06c4631733?auto=format&fit=crop&w=800&q=80" alt="Stellenbosch" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="relative z-10 text-white">
                <div className="font-bold text-lg leading-tight">Stellenbosch</div>
                <p className="text-xs text-white/80 mt-1">Wine route getaways</p>
              </div>
            </Link>
            
            <Link to="/locations" className="group rounded-xl overflow-hidden h-64 relative flex flex-col justify-end p-5 no-underline shadow-sm transition transform hover:-translate-y-1">
              <img src="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80" alt="Knysna Forest" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="relative z-10 text-white">
                <div className="font-bold text-lg leading-tight">Knysna Forest</div>
                <p className="text-xs text-white/80 mt-1">Hidden woodland cabins</p>
              </div>
            </Link>
            
            <Link to="/locations" className="group rounded-xl overflow-hidden h-64 relative flex flex-col justify-end p-5 no-underline shadow-sm transition transform hover:-translate-y-1">
              <img src="https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80" alt="Kruger Safari" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="relative z-10 text-white">
                <div className="font-bold text-lg leading-tight">Kruger Safari</div>
                <p className="text-xs text-white/80 mt-1">Wilderness escapes</p>
              </div>
            </Link>
          </div>
        </section>

        {/* 2. DISCOVER EXPERIENCE SECTION */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">Discover Airbnb Experiences</h2>
          <p className="text-gray-500 text-sm mb-6 font-medium">Unique activities with local experts hosted directly inside your city blocks.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative rounded-2xl overflow-hidden h-[400px] shadow-sm group">
              <img src="https://images.unsplash.com/photo-1544816155-12df9643f363?w=800" alt="Experiences" className="w-full h-full object-cover group-hover:scale-[1.01] transition duration-300"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-8 flex flex-col justify-end items-start text-white">
                <h3 className="text-xl font-bold mb-2">Things to do on your trip</h3>
                <p className="text-xs text-gray-200 mb-4 max-w-xs">Book local tours, cooking courses, or private ocean boat sails.</p>
                <Link to="/locations" className="bg-white text-gray-900 font-bold text-xs py-3 px-5 rounded-lg no-underline shadow-md hover:bg-gray-50 active:scale-95 transition">Experiences</Link>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden h-[400px] shadow-sm group">
              <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800" alt="Online experiences" className="w-full h-full object-cover group-hover:scale-[1.01] transition duration-300"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-8 flex flex-col justify-end items-start text-white">
                <h3 className="text-xl font-bold mb-2">Things to do from home</h3>
                <p className="text-xs text-gray-200 mb-4 max-w-xs">Live interactive video sessions conducted by globally remote guides.</p>
                <Link to="/locations" className="bg-white text-gray-900 font-bold text-xs py-3 px-5 rounded-lg no-underline shadow-md hover:bg-gray-50 active:scale-95 transition">Online Experiences</Link>
              </div>
            </div>
          </div>
        </section>

        {/* 3. SHOP GIFT CARDS SECTION (UPDATED TO AIRBNB LOGO) */}
        <section className="mb-16 bg-gray-950 text-white rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md relative overflow-hidden">
          <div className="space-y-3 max-w-md text-left z-10">
            <h2 className="text-2xl font-bold tracking-tight">Shop Airbnb Gift Cards</h2>
            <p className="text-xs text-gray-400 leading-relaxed font-light">Give the gift of effortless exploration. Gift cards never expire and apply directly onto any available residential stays globally.</p>
            <div className="pt-2">
              <button className="bg-white text-gray-950 font-bold text-xs py-3 px-6 rounded-xl shadow transition hover:bg-gray-100 active:scale-95 cursor-pointer">
                Learn more
              </button>
            </div>
          </div>
          <div className="w-full max-w-xs relative z-10">
            <div className="bg-gradient-to-tr from-rose-500 to-pink-600 rounded-2xl p-6 aspect-[1.58/1] shadow-2xl flex flex-col justify-between text-white tracking-wide border border-white/10 transform rotate-2">
              
              <div className="flex items-center gap-1.5">
                  <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-current">
                      <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.01.415.001.228c0 4.062-2.877 6.478-6.357 6.478-2.224 0-4.556-1.258-6.709-3.386l-.257-.26-.172-.178a23.947 23.947 0 0 1-1.89-2.257l-.228-.3-.162-.224c-.134.183-.284.375-.45.575l-.337.391a24.52 24.52 0 0 1-1.786 1.918l-.248.243c-2.176 2.15-4.528 3.418-6.75 3.418-3.48 0-6.358-2.416-6.358-6.478 0-1.157.315-2.24 1.011-3.792l.135-.29c1.01-2.35 5.17-11.06 7.13-14.912l.514-.993C12.537 1.963 13.992 1 16 1zm0 2c-1.238 0-2.203.623-3.14 2.296l-.513.992c-1.95 3.834-6.096 12.518-7.1 14.854l-.137.293c-.63 1.407-.866 2.233-.905 2.923l-.005.234c0 2.902 1.94 4.478 4.358 4.478 1.636 0 3.52-1.022 5.347-2.833l.255-.257a22.51 22.51 0 0 0 1.98-2.15l.235-.286.205-.262-.224-.277c-1.39-1.74-2.274-3.77-2.617-5.918l-.053-.362-.016-.2c0-3.136 2.403-5.642 5.51-5.642 3.037 0 5.426 2.41 5.508 5.438l.002.204c0 2.254-.913 4.332-2.378 6.136l-.24.288.242.275c.618.694 1.253 1.374 1.905 2.034l.26.255c1.82 1.794 3.696 2.806 5.318 2.806 2.417 0 4.357-1.576 4.357-4.478 0-.622-.213-1.38-.79-2.76l-.152-.365c-.982-2.288-5.128-10.972-7.09-14.823l-.532-1.024C18.203 3.623 17.238 3 16 3zm0 9c-1.984 0-3.51 1.547-3.51 3.442 0 1.72 1.258 3.32 2.91 4.195l.31.15.29.117c.23.08.31.144.31.253 0 .144-.114.243-.364.243-.654 0-1.42-.486-2.12-1.385l-.17-.23-.284-.424-1.464.975.275.43c.966 1.455 2.258 2.308 3.763 2.308 1.474 0 2.374-.74 2.374-1.843 0-1.037-.624-1.7-1.924-2.18l-.29-.107-.31-.12c-.37-.156-.514-.373-.514-.64 0-.616.48-1.047 1.51-1.047.886 0 1.764.442 2.502 1.272l.19.227.228.293 1.442-.993-.243-.326c-.927-1.2-2.115-1.944-3.515-1.944z"></path>
                  </svg>
                  <span className="font-black tracking-tighter text-lg uppercase">airbnb</span>
              </div>
              
              <span className="text-xl font-extrabold text-right">R 2,500</span>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        </section>

        {/* 4. QUESTIONS ABOUT HOSTING BANNER */}
        <section className="mb-16 relative rounded-2xl overflow-hidden h-[320px] md:h-[400px] shadow-md group">
          <img 
            src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1200" 
            alt="Superhost guide" 
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent p-8 md:p-12 flex flex-col justify-center items-start text-white">
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight max-w-xs md:max-w-md leading-tight mb-3 text-left">
              Questions about hosting?
            </h2>
            <p className="text-xs md:text-sm text-gray-300 max-w-xs md:max-w-sm mb-6 text-left font-light">
              Match with an experienced Superhost in Cape Town to receive real-time advice on settings configurations, listings photography, and profile creation.
            </p>
            <button className="bg-white text-gray-900 font-bold text-xs py-3.5 px-6 rounded-xl hover:bg-gray-50 active:scale-95 transition shadow-lg cursor-pointer">
              Ask a Superhost
            </button>
          </div>
        </section>

        {/* 5. INSPIRATION FOR FUTURE GETAWAYS SECTION (PRE-FOOTER TAB MATRIX) */}
        <section className="border-t border-gray-200 pt-10 pb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 text-left">Inspiration for future getaways</h3>
          
          {/* Tab Selector Links */}
          <div className="flex border-b border-gray-200 gap-6 text-xs font-bold text-gray-500 overflow-x-auto scrollbar-none pb-2 select-none">
            <span 
              onClick={() => setFutureTab('outdoor')}
              className={`pb-2 cursor-pointer transition whitespace-nowrap border-b-2 ${futureTab === 'outdoor' ? 'border-black text-black' : 'border-transparent hover:text-black'}`}
            >
              Outdoor adventures
            </span>
            <span 
              onClick={() => setFutureTab('mountain')}
              className={`pb-2 cursor-pointer transition whitespace-nowrap border-b-2 ${futureTab === 'mountain' ? 'border-black text-black' : 'border-transparent hover:text-black'}`}
            >
              Mountain cabins
            </span>
            <span 
              onClick={() => setFutureTab('beach')}
              className={`pb-2 cursor-pointer transition whitespace-nowrap border-b-2 ${futureTab === 'beach' ? 'border-black text-black' : 'border-transparent hover:text-black'}`}
            >
              Beachfront getaways
            </span>
            <span 
              onClick={() => setFutureTab('cities')}
              className={`pb-2 cursor-pointer transition whitespace-nowrap border-b-2 ${futureTab === 'cities' ? 'border-black text-black' : 'border-transparent hover:text-black'}`}
            >
              Popular destinations
            </span>
          </div>

          {/* Dynamic Grid Panels Layout depending on React Hooks state */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-y-4 gap-x-2 text-left text-xs pt-6">
            {futureTab === 'outdoor' && (
              <>
                <div><h6 className="font-bold text-gray-900">Durban</h6><p className="text-gray-400 mt-0.5">KwaZulu-Natal</p></div>
                <div><h6 className="font-bold text-gray-900">Knysna</h6><p className="text-gray-400 mt-0.5">Garden Route</p></div>
                <div><h6 className="font-bold text-gray-900">Lake Malawi</h6><p className="text-gray-400 mt-0.5">Lake rentals</p></div>
                <div><h6 className="font-bold text-gray-900">Plettenberg Bay</h6><p className="text-gray-400 mt-0.5">Western Cape</p></div>
                <div><h6 className="font-bold text-gray-900">Hoedspruit</h6><p className="text-gray-400 mt-0.5">Safari stays</p></div>
                <div><h6 className="font-bold text-gray-900">Wild Coast</h6><p className="text-gray-400 mt-0.5">Coastal trails</p></div>
              </>
            )}
            {futureTab === 'mountain' && (
              <>
                <div><h6 className="font-bold text-gray-900">Drakensberg</h6><p className="text-gray-400 mt-0.5">Mountain Cabins</p></div>
                <div><h6 className="font-bold text-gray-900">Cederberg</h6><p className="text-gray-400 mt-0.5">Rock formations</p></div>
                <div><h6 className="font-bold text-gray-900">Franschhoek</h6><p className="text-gray-400 mt-0.5">Valley retreats</p></div>
                <div><h6 className="font-bold text-gray-900">Clarens</h6><p className="text-gray-400 mt-0.5">Artisan village</p></div>
                <div><h6 className="font-bold text-gray-900">Hogsback</h6><p className="text-gray-400 mt-0.5">Forest cabins</p></div>
                <div><h6 className="font-bold text-gray-900">Magoebaskloof</h6><p className="text-gray-400 mt-0.5">Mist belt hills</p></div>
              </>
            )}
            {futureTab === 'beach' && (
              <>
                <div><h6 className="font-bold text-gray-900">Camps Bay</h6><p className="text-gray-400 mt-0.5">Luxury beachfront</p></div>
                <div><h6 className="font-bold text-gray-900">Ballito</h6><p className="text-gray-400 mt-0.5">Warm ocean condos</p></div>
                <div><h6 className="font-bold text-gray-900">Jeffreys Bay</h6><p className="text-gray-400 mt-0.5">Surfing resorts</p></div>
                <div><h6 className="font-bold text-gray-900">Langebaan</h6><p className="text-gray-400 mt-0.5">Lagoon villas</p></div>
                <div><h6 className="font-bold text-gray-900">Mossel Bay</h6><p className="text-gray-400 mt-0.5">Coastal penthouses</p></div>
                <div><h6 className="font-bold text-gray-900">Umhlanga</h6><p className="text-gray-400 mt-0.5">Ocean side highrises</p></div>
              </>
            )}
            {futureTab === 'cities' && (
              <>
                <div><h6 className="font-bold text-gray-900">London</h6><p className="text-gray-400 mt-0.5">United Kingdom</p></div>
                <div><h6 className="font-bold text-gray-900">Paris</h6><p className="text-gray-400 mt-0.5">France</p></div>
                <div><h6 className="font-bold text-gray-900">New York</h6><p className="text-gray-400 mt-0.5">United States</p></div>
                <div><h6 className="font-bold text-gray-900">Tokyo</h6><p className="text-gray-400 mt-0.5">Japan</p></div>
                <div><h6 className="font-bold text-gray-900">Sydney</h6><p className="text-gray-400 mt-0.5">Australia</p></div>
                <div><h6 className="font-bold text-gray-900">Rome</h6><p className="text-gray-400 mt-0.5">Italy</p></div>
              </>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}

export default Home;