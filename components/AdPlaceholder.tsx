
import React, { useEffect, useRef } from 'react';
import { TRANSLATIONS } from '../constants';
import { useData } from '../contexts/DataContext';

interface AdPlaceholderProps {
  id: string; // positionId matching Admin Panel
  type: 'banner' | 'sidebar' | 'mobile-banner' | 'in-feed' | 'article-ad';
  lang: 'bn' | 'en';
  children?: React.ReactNode;
}

const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ id, type, lang, children }) => {
  const t = TRANSLATIONS[lang];
  const { ads } = useData();
  const scriptRef = useRef<HTMLDivElement>(null);

  const activeAd = ads.find(a => a.positionId === id && a.active);
  
  // Tailwind classes based on type
  let containerClasses = "bg-gray-100 border border-gray-200 text-gray-400 flex flex-col items-center justify-center text-center p-0 my-4 relative overflow-hidden";
  
  if (type === 'banner') containerClasses += " w-full h-24 md:h-32 rounded-lg";
  if (type === 'sidebar') containerClasses += " w-full h-64 md:h-96 rounded-lg";
  if (type === 'mobile-banner') containerClasses += " w-full h-16 rounded-lg md:hidden";
  if (type === 'in-feed') containerClasses += " w-full h-32 rounded-lg";
  if (type === 'article-ad') containerClasses += " w-full h-48 rounded-lg float-none md:float-right md:w-1/3 md:ml-4 mb-4";

  // Handle AdSense script injection
  useEffect(() => {
    if (activeAd?.type === 'adsense' && scriptRef.current) {
      scriptRef.current.innerHTML = ''; // Clear previous
      const range = document.createRange();
      const fragment = range.createContextualFragment(activeAd.content);
      scriptRef.current.appendChild(fragment);
    }
  }, [activeAd]);

  return (
    <div id={id} className={containerClasses} aria-label="Advertisement">
      <span className="absolute top-1 right-2 z-10 text-[8px] uppercase tracking-wider bg-white/80 px-1 rounded border border-gray-200">
        {t.adLabel}
      </span>
      
      {activeAd ? (
          activeAd.type === 'image' ? (
              activeAd.link ? (
                  <a href={activeAd.link} target="_blank" rel="noopener noreferrer" className="w-full h-full">
                      <img src={activeAd.content} className="w-full h-full object-cover" alt="Advertisement" />
                  </a>
              ) : (
                  <img src={activeAd.content} className="w-full h-full object-cover" alt="Advertisement" />
              )
          ) : (
              <div ref={scriptRef} className="w-full h-full flex items-center justify-center overflow-hidden">
                  {/* Script will be injected here via useEffect */}
              </div>
          )
      ) : (
          <>
            <div className="font-semibold text-xs opacity-50 px-4">{children || "Google AdSense or Custom Ad"}</div>
            <div className="text-[10px] mt-1 opacity-40">{id}</div>
          </>
      )}
    </div>
  );
};

export default AdPlaceholder;
