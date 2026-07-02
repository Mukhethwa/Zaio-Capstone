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
        // FIXED: Changed from hardcoded localhost to a relative path for deployment stability
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
                src="https://images.unsplash.com/photo-1501785888041-af3ef285b470" 
                alt="Travel experiences banner"
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-white">
                <h1 className="text-4xl md:text-6xl font-black tracking-tight drop-shadow-md mb-4">
                    Not sure where to go? Perfect.
                </h1>
                <button type="button" className="bg-white text-purple-700 font-bold px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all text-sm md:text-base cursor-pointer">
                    I'm flexible
                </button>
            </div>
        </div>

        {/* INSPIRATION CARDS SECTION */}
        <section className="mb-14">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-6 text-gray-900">
            Inspiration for your next trip
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="group rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition">
              <div className="h-48 overflow-hidden bg-gray-100">
                <img src="https://images.unsplash.com/photo-1580618672591-eb180b1a973f" alt="Cape Town" className="w-full h-full object-cover group-hover:scale-105 transition duration-300"/>
              </div>
              <div className="p-5 bg-rose-500 text-white group-hover:bg-rose-600 transition">
                <h3 className="font-bold text-lg">Cape Town</h3>
                <p className="text-sm opacity-90 mt-1">53 km away</p>
              </div>
            </div>
            {/* Card 2 */}
            <div className="group rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition">
              <div className="h-48 overflow-hidden bg-gray-100">
                <img src="https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3" alt="Franschhoek" className="w-full h-full object-cover group-hover:scale-105 transition duration-300"/>
              </div>
              <div className="p-5 bg-amber-600 text-white group-hover:bg-amber-700 transition">
                <h3 className="font-bold text-lg">Franschhoek</h3>
                <p className="text-sm opacity-90 mt-1">85 km away</p>
              </div>
            </div>
            {/* Card 3 */}
            <div className="group rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition">
              <div className="h-48 overflow-hidden bg-gray-100">
                <img src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9" alt="Stellenbosch" className="w-full h-full object-cover group-hover:scale-105 transition duration-300"/>
              </div>
              <div className="p-5 bg-teal-600 text-white group-hover:bg-teal-700 transition">
                <h3 className="font-bold text-lg">Stellenbosch</h3>
                <p className="text-sm opacity-90 mt-1">42 km away</p>
              </div>
            </div>
            {/* Card 4 */}
            <div className="group rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition">
              <div className="h-48 overflow-hidden bg-gray-100">
                <img src="https://images.unsplash.com/photo-1564507592333-c60657eea523" alt="Hermanus" className="w-full h-full object-cover group-hover:scale-105 transition duration-300"/>
              </div>
              <div className="p-5 bg-blue-600 text-white group-hover:bg-blue-700 transition">
                <h3 className="font-bold text-lg">Hermanus</h3>
                <p className="text-sm opacity-90 mt-1">120 km away</p>
              </div>
            </div>
          </div>
        </section>

        {/* COMPREHENSIVE LISTINGS MATRIX MAPPER */}
        <section className="mb-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-4 mb-6 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">
                Explore Stays Marketplace
              </h2>
              <p className="text-gray-500 text-sm mt-1">Hand-picked dynamic listings matching your active criteria</p>
            </div>
            <div className="flex items-center gap-2 self-start md:self-auto bg-gray-50 p-1 rounded-xl border border-gray-100">
                <span className="text-xs font-bold text-gray-400 px-3 uppercase tracking-wider">Database Status</span>
                <span className={`h-2.5 w-2.5 rounded-full animate-pulse ${error ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
              <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-medium font-mono tracking-wide">Syncing listing clusters from database engine...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50/70 border border-red-100 text-red-700 rounded-2xl p-6 text-center max-w-lg mx-auto shadow-sm">
              <p className="font-semibold text-base">{error}</p>
              <p className="text-xs text-red-500/80 font-mono mt-2">ERR_CONNECTION_REFUSED or Missing Model Registers</p>
            </div>
          ) : accommodations.length === 0 ? (
            <div className="border-2 border-dashed border-gray-100 rounded-2xl py-16 text-center text-gray-400 max-w-md mx-auto">
              <p className="font-medium text-gray-500">No accommodations matching records found.</p>
              <p className="text-xs mt-1 px-4">Use your admin interface securely at the header links to provision listings database clusters maps.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
              {accommodations.map((item) => (
                <Link key={item._id} to={`/location/${item._id}`} className="group no-underline text-inherit block">
                  <div className="aspect-square w-full rounded-xl overflow-hidden bg-gray-100 relative mb-3 shadow-sm group-hover:shadow-md transition duration-300">
                    <img 
                      src={item.images && item.images[0] ? item.images[0] : "https://images.unsplash.com/photo-1564013799919-ab600027ffc6"} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-102 transition duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs p-1.5 rounded-full shadow-xs cursor-pointer hover:scale-110 active:scale-95 transition">
                        <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 fill-gray-500/80 hover:fill-rose-500 transition-colors"><path d="M16 28c7-4.733 14-10 14-17 0-4.418-3.582-8-8-8-3.414 0-5.717 2.128-6 4.167-.283-2.039-2.586-4.167-6-4.167-4.418 0-8 3.582-8 8 0 7 7 12.267 14 17z"/></svg>
                    </div>
                  </div>
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-[15px] text-gray-900 group-hover:text-rose-500 transition-colors line-clamp-1 truncate">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-1 shrink-0 text-xs font-semibold text-gray-800">
                      <span>★</span>
                      <span>4.95</span>
                    </div>
                  </div>
                  <p className="text-gray-500 text-[13px] mt-0.5 line-clamp-1 truncate">{item.location}</p>
                  <p className="text-gray-400 text-xs mt-0.5 font-mono">Max guests: {item.guests || 2}</p>
                  <div className="mt-1.5 flex items-baseline gap-1 text-sm text-gray-900">
                    <span className="font-extrabold text-[15px]">R {item.price}</span>
                    <span className="text-gray-500 text-xs">night</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* FUTURE GETAWAYS PRE-FOOTER DIRECTORY */}
        <section className="border-t border-gray-100 pt-12 pb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 tracking-tight">Inspiration for future getaways</h3>
          <div className="flex border-b border-gray-100 gap-6 text-sm font-semibold text-gray-500 mb-6 overflow-x-auto pb-1.5">
            <button type="button" onClick={() => setFutureTab('outdoor')} className={`pb-3 border-b-2 cursor-pointer transition whitespace-nowrap ${futureTab === 'outdoor' ? 'border-gray-900 text-gray-900 font-bold' : 'border-transparent hover:text-gray-800'}`}>Destinations for arts & culture</button>
            <button type="button" onClick={() => setFutureTab('cities')} className={`pb-3 border-b-2 cursor-pointer transition whitespace-nowrap ${futureTab === 'cities' ? 'border-gray-900 text-gray-900 font-bold' : 'border-transparent hover:text-gray-800'}`}>Great for outdoor adventures</button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-6 text-[13px] pb-6">
            {futureTab === 'outdoor' && (
              <>
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
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;