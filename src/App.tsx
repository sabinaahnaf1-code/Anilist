/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar.tsx';
import Home from './pages/Home.tsx';
import AnimeDetails from './pages/AnimeDetails.tsx';
import Genres from './pages/Genres.tsx';
import Search from './pages/Search.tsx';
import Watchlist from './pages/Watchlist.tsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-bg-dark">
        <ScrollToTop />
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/anime/:id" element={<AnimeDetails />} />
            <Route path="/genres" element={<Genres />} />
            <Route path="/search" element={<Search />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/trending" element={<Home />} />
          </Routes>
        </main>
        
        <footer className="py-12 px-4 md:px-8 bg-black/40 border-t border-white/5 mt-12">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col gap-2">
              <span className="text-xl font-display font-bold tracking-tighter">
                Anime<span className="gradient-text">Verse</span>
              </span>
              <p className="text-slate-500 text-sm">Your ultimate anime exploration companion.</p>
            </div>
            <div className="flex items-center gap-8 text-slate-400 text-sm font-medium">
               <a href="#" className="hover:text-brand-primary transition-colors">About</a>
               <a href="#" className="hover:text-brand-primary transition-colors">Privacy</a>
               <a href="#" className="hover:text-brand-primary transition-colors">Terms</a>
               <a href="#" className="hover:text-brand-primary transition-colors">Contact</a>
            </div>
            <div className="text-slate-600 text-xs text-center md:text-right">
              Powered by Jikan API. Data provided by MyAnimeList.
              <br />
              © 2026 AnimeVerse. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}
