import Link from 'next/link';
import { Library } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

interface AppLogoProps {
  className?: string;
  iconSize?: number;
  textSize?: string;
}

export function AppLogo({ className, iconSize = 24, textSize = "text-xl" }: AppLogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <Library className="text-primary" size={iconSize} />
      <span className={`font-headline font-bold ${textSize} text-primary`}>{APP_NAME}</span>
    </Link>
  );
}
