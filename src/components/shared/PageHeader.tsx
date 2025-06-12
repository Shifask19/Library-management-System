import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <div className={`mb-6 sm:mb-8 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-headline font-bold text-primary tracking-tight">{title}</h1>
          {description && <p className="mt-1 text-sm sm:text-base text-muted-foreground font-body">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 self-start sm:self-center">{actions}</div>}
      </div>
    </div>
  );
}
