import Link from 'next/link';
import { Interest } from '../services/interests.service';

interface InterestTagsProps {
  interests: Interest[];
  clickable?: boolean;
  className?: string;
}

export default function InterestTags({ 
  interests, 
  clickable = true, 
  className = '' 
}: InterestTagsProps) {
  if (!interests || interests.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {interests.map(interest => (
        clickable ? (
          <Link 
            key={interest.id} 
            href={`/events/search?interest=${interest.id}`}
            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition-colors"
          >
            {interest.name}
          </Link>
        ) : (
          <span 
            key={interest.id} 
            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
          >
            {interest.name}
          </span>
        )
      ))}
    </div>
  );
}