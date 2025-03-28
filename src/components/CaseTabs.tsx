import { Tab } from '@headlessui/react';
import { classNames } from '@/utils/classNames';

interface CaseTabsProps {
  tabs: {
    name: string;
    current: boolean;
  }[];
  children: React.ReactNode;
}

export default function CaseTabs({ tabs, children }: CaseTabsProps) {
  return (
    <div className="w-full">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex" aria-label="Tabs">
          {tabs.map((tab) => (
            <Tab
              key={tab.name}
              className={({ selected }) =>
                classNames(
                  selected
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                  'w-1/4 border-b-2 py-4 px-1 text-center text-sm font-medium'
                )
              }
            >
              {tab.name}
            </Tab>
          ))}
        </nav>
      </div>
      <div className="mt-4">
        <Tab.Panels>
          {children}
        </Tab.Panels>
      </div>
    </div>
  );
} 