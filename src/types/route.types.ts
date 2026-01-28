import React from 'react';

type AuthRequirement = 'public' | 'guest' | 'authenticated';

type BaseRoute = {
  element?: React.ComponentType | React.LazyExoticComponent<React.ComponentType<unknown>>;
  name?: string;
  children?: RouteConfig[];
  auth: AuthRequirement;
};

type LayoutRoute = BaseRoute & {
  isLayout: true;
  path?: string;
  index?: never;
};

type PathRoute = BaseRoute & {
  isLayout?: never;
  path?: string;
  index?: boolean;
};

export type RouteConfig = LayoutRoute | PathRoute;
