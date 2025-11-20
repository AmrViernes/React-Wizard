import { createContext, useContext, ReactNode } from 'react';
import { WizardContextType } from './types';

const WizardContext = createContext<WizardContextType<any, any> | undefined>(
  undefined
);

export const useWizardContext = <T, S extends string>(): WizardContextType<
  T,
  S
> => {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizardContext must be used within a Wizard component');
  }
  return context;
};

export interface WizardProviderProps<T, S extends string> {
  value: WizardContextType<T, S>;
  children: ReactNode;
  'data-testid'?: string;
}

export const WizardProvider = <T, S extends string>({
  value,
  children,
  ...props
}: WizardProviderProps<T, S>) => {
  const parentTestId = props['data-testid'] || 'wizard-provider';
  
  return (
    <WizardContext.Provider
      value={value}
      data-testid={`${parentTestId}-provider`}
    >
      {children}
    </WizardContext.Provider>
  );
};