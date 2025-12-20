import React from 'react';
import { TRANSLATIONS } from '../constants';

interface AdPlaceholderProps {
  id: string;
  type: 'banner' | 'sidebar' | 'mobile-banner' | 'in-feed' | 'article-ad';
  lang: 'bn' | 'en';
  children?: React.ReactNode;
}

const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ id, type, lang, children }) => {
  const t = TRANSLATIONS[lang];
  
  // Tailwind classes based on type
  let containerClasses = "bg-gray-200 border border-gray-300 text-gray-500 flex flex-col items-center justify-center text-center p-4 my-4 relative overflow-hidden";
  
  if (type === 'banner') containerClasses += " w-full h-24 md:h-32 rounded-lg";
  if (type === 'sidebar') containerClasses += " w-full h-64 md:h-96 rounded-lg";
  if (type === 'mobile-banner') containerClasses += " w-full h-16 rounded-lg md:hidden";
  if (type === 'in-feed') containerClasses += " w-full h-32 rounded-lg";
  if (type === 'article-ad') containerClasses += " w-full h-48 rounded-lg float-none md:float-right md:w-1/3 md:ml-4 mb-4";

  return (
    <div id={id} className={containerClasses} aria-label="Advertisement">
      <span className="absolute top-1 right-2 text-[10px] uppercase tracking-wider bg-white px-1 rounded border border-gray-300">
        {t.adLabel}
      </span>
      <div className="font-semibold text-sm">{children || "Google AdSense Placeholder"}</div>
      <div className="text-xs mt-1 opacity-75">{id} - {type}</div>
    </div>
  );
};

export default AdPlaceholder;