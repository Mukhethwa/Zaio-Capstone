import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-[#F7F7F7] border-t border-gray-200 pt-12 pb-8 px-6 mt-auto font-sans text-gray-800">
            <div className="max-w-6xl mx-auto">
                
                {/* 4-Column Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-gray-200 text-sm">
                    
                    {/* Column 1: Support */}
                    <div className="space-y-3">
                        <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider">Support</h3>
                        <ul className="space-y-2.5 list-none p-0 m-0 text-gray-600 font-normal">
                            <li><Link to="#" className="hover:underline no-underline text-inherit text-xs">Help Center</Link></li>
                            <li><Link to="#" className="hover:underline no-underline text-inherit text-xs">Safety information</Link></li>
                            <li><Link to="#" className="hover:underline no-underline text-inherit text-xs">Cancellation options</Link></li>
                            <li><Link to="#" className="hover:underline no-underline text-inherit text-xs">Our COVID-19 Response</Link></li>
                            <li><Link to="#" className="hover:underline no-underline text-inherit text-xs">Supporting people with disabilities</Link></li>
                            <li><Link to="#" className="hover:underline no-underline text-inherit text-xs">Report a neighbourhood concern</Link></li>
                        </ul>
                    </div>

                    {/* Column 2: Community */}
                    <div className="space-y-3">
                        <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider">Community</h3>
                        <ul className="space-y-2.5 list-none p-0 m-0 text-gray-600 font-normal">
                            <li><Link to="#" className="hover:underline no-underline text-inherit text-xs">Airbnb.org: disaster relief housing</Link></li>
                            <li><Link to="#" className="hover:underline no-underline text-inherit text-xs">Support: Afghan refugees</Link></li>
                            <li><Link to="#" className="hover:underline no-underline text-inherit text-xs">Celebrating diversity & belonging</Link></li>
                            <li><Link to="#" className="hover:underline no-underline text-inherit text-xs">Combating discrimination</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Hosting */}
                    <div className="space-y-3">
                        <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider">Hosting</h3>
                        <ul className="space-y-2.5 list-none p-0 m-0 text-gray-600 font-normal">
                            <li><Link to="#" className="hover:underline no-underline text-inherit text-xs">Try hosting</Link></li>
                            <li><Link to="#" className="hover:underline no-underline text-inherit text-xs">AirCover: protection for Hosts</Link></li>
                            <li><Link to="#" className="hover:underline no-underline text-inherit text-xs">Explore hosting resources</Link></li>
                            <li><Link to="#" className="hover:underline no-underline text-inherit text-xs">Visit our community forum</Link></li>
                            <li><Link to="#" className="hover:underline no-underline text-inherit text-xs">How to host responsibly</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: About */}
                    <div className="space-y-3">
                        <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider">About</h3>
                        <ul className="space-y-2.5 list-none p-0 m-0 text-gray-600 font-normal">
                            <li><Link to="#" className="hover:underline no-underline text-inherit text-xs">Newsroom</Link></li>
                            <li><Link to="#" className="hover:underline no-underline text-inherit text-xs">Learn about new features</Link></li>
                            <li><Link to="#" className="hover:underline no-underline text-inherit text-xs">Learn from our founders</Link></li>
                            <li><Link to="#" className="hover:underline no-underline text-inherit text-xs">Careers</Link></li>
                            <li><Link to="#" className="hover:underline no-underline text-inherit text-xs">Investors</Link></li>
                            <li><Link to="#" className="hover:underline no-underline text-inherit text-xs">Airbnb Luxe</Link></li>
                        </ul>
                    </div>

                </div>

                {/* Bottom Bar: Credentials & Meta Links */}
                <div className="pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600 gap-4">
                    
                    {/* Bottom Left: Legal Context */}
                    <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start">
                        <span className="font-normal">© 2022 Airbnb, Inc.</span>
                        <span className="text-gray-400">·</span>
                        <Link to="#" className="hover:underline text-inherit no-underline">Privacy</Link>
                        <span className="text-gray-400">·</span>
                        <Link to="#" className="hover:underline text-inherit no-underline">Terms</Link>
                        <span className="text-gray-400">·</span>
                        <Link to="#" className="hover:underline text-inherit no-underline">Sitemap</Link>
                    </div>

                    {/* Bottom Right: Localization & Social Icons */}
                    <div className="flex items-center gap-6 font-semibold text-gray-900">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1 cursor-pointer hover:underline">
                                🌐 <span className="text-xs">English (US)</span>
                            </span>
                            <span className="cursor-pointer hover:underline">$ USD</span>
                        </div>
                        
                        {/* Social Media Link Vector Icons */}
                        <div className="flex items-center gap-4 text-gray-700 text-sm">
                            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-black transition text-inherit">
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-black transition text-inherit">
                                <i className="fab fa-twitter"></i>
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-black transition text-inherit">
                                <i className="fab fa-instagram"></i>
                            </a>
                        </div>
                    </div>

                </div>

            </div>
        </footer>
    );
};

export default Footer;