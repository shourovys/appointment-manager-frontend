import type { ReactNode } from 'react';
import type { SWRConfiguration } from 'swr';
import { SWRConfig } from 'swr';

import { Providers } from '@/app/providers';

interface AllProvidersProps {
  children: ReactNode;
  swrConfig?: SWRConfiguration;
}

export function AllProviders({ children, swrConfig }: AllProvidersProps): React.ReactElement {
  return (
    <SWRConfig value={swrConfig ?? { provider: () => new Map() }}>
      <Providers>{children}</Providers>
    </SWRConfig>
  );
}
