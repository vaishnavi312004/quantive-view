import { cn } from '@/lib/utils';

export interface InsightCard {
  icon: React.ElementType;
  title: string;
  value?: string;
  description: string;
  type: 'positive' | 'warning' | 'neutral' | 'info';
}

export interface AISectionBlock {
  heading: string;
  icon: React.ElementType;
  items: InsightCard[];
}

const typeColors: Record<string, string> = {
  positive: 'bg-success/5 border-success/20',
  warning: 'bg-warning/5 border-warning/20',
  neutral: 'bg-muted/50 border-border',
  info: 'bg-primary/5 border-primary/20',
};

const typeIconColors: Record<string, string> = {
  positive: 'text-success',
  warning: 'text-warning',
  neutral: 'text-muted-foreground',
  info: 'text-primary',
};

const SafeIcon = ({ icon: Icon, className }: { icon: React.ElementType; className?: string }) => {
  if (Icon && (typeof Icon === 'function' || (typeof Icon === 'object' && '$$typeof' in Icon))) {
    return <Icon className={className} />;
  }
  return null;
};

const AIMessageContent = ({ sections }: { sections: AISectionBlock[] }) => (
  <div className="space-y-4">
    {sections.map((section, si) => (
      <div key={si}>
        <div className="flex items-center gap-2 mb-2">
          <SafeIcon icon={section.icon} className="w-4 h-4 text-primary" />
          <h4 className="text-sm font-semibold text-foreground">{section.heading}</h4>
        </div>
        <div className="space-y-2">
          {section.items.map((item, ii) => (
            <div key={ii} className={cn('flex items-start gap-3 p-3 rounded-lg border', typeColors[item.type])}>
              <SafeIcon icon={item.icon} className={cn('w-4 h-4 mt-0.5 flex-shrink-0', typeIconColors[item.type])} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{item.title}</span>
                  {item.value && (
                    <span className="text-sm font-bold text-foreground">{item.value}</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default AIMessageContent;
