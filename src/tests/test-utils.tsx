import { render as rtlRender, type RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement, ReactNode } from 'react';
import type { SWRConfiguration } from 'swr';
import { vi } from 'vitest';

import { AllProviders } from './AllProviders';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  withProviders?: boolean;
  swrConfig?: SWRConfiguration;
}

export function render(
  ui: ReactElement,
  options?: CustomRenderOptions
): ReturnType<typeof rtlRender> {
  return renderWithProviders(ui, options);
}

export function renderWithProviders(
  ui: ReactElement,
  options?: CustomRenderOptions
): ReturnType<typeof rtlRender> {
  const { withProviders = true, swrConfig, ...renderOptions } = options ?? {};

  return rtlRender(ui, {
    wrapper: withProviders
      ? (props: { children: ReactNode }): React.ReactElement => (
          <AllProviders {...props} swrConfig={swrConfig} />
        )
      : undefined,
    ...renderOptions,
  });
}

// Re-export commonly used testing utilities
export { fireEvent, screen, waitFor, within } from '@testing-library/react';
export { userEvent };

// Helper for async operations in tests
export async function waitForNextTick(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 0));
}

// Helper to mock window.matchMedia
export function mockMatchMedia(): void {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}
