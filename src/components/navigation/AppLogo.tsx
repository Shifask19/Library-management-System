import Link from 'next/link';
import Image from 'next/image'; // Import next/image
import { APP_NAME } from '@/lib/constants';

interface AppLogoProps {
  className?: string;
  iconSize?: number; // This will now be used for width and height of the Image
  textSize?: string;
}

export function AppLogo({ className, iconSize = 32, textSize = "text-xl" }: AppLogoProps) {
  const logoUrl = "http://pescoe.ac.in/assets/images/PES_Logo.png";
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <Image
        src={logoUrl}
        alt={`${COLLEGE_NAME} Logo`}
        width={iconSize}
        height={iconSize}
        className="object-contain" // Ensure the logo scales nicely
        priority // Prioritize loading the main logo
      />
      <span className={`font-headline font-bold ${textSize} text-primary`}>{APP_NAME}</span>
    </Link>
  );
}

// Added COLLEGE_NAME import for alt text
import { COLLEGE_NAME } from '@/lib/constants';
