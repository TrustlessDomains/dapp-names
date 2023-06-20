import { ROUTE_PATH } from '@/constants/route-path';

export const MENU_HEADER = [
  // {
  //   id: 'menu-1',
  //   name: 'Build',
  //   route: ROUTE_PATH.HOME,
  //   activePath: '',
  // },
  // {
  //   id: 'menu-2',
  //   name: 'Use',
  //   route: ROUTE_PATH.USE_TRUSTLESS,
  //   activePath: 'use-trustless-computer',
  // },
  // {
  //   id: 'menu-3',
  //   name: 'Dapp Store',
  //   route: ROUTE_PATH.DAPPS,
  //   activePath: 'dapps',
  // }
  {
    id: 'menu-1',
    name: 'Manage BNS',
    route: ROUTE_PATH.SETTING,
    activePath: 'setting',
  },
  {
    id: 'menu-2',
    name: 'Get Started',
    route: ROUTE_PATH.GET_STARTED,
    activePath: 'get-started',
  },
];

export const MENU_MOBILE = [...MENU_HEADER];
