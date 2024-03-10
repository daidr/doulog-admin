import type { RouterLinkProps } from "vue-router/auto";

export type NavCategory = {
  name: string;
  add: (item: NavItem) => void;
  items: NavItem[];
} & (
    {
      locale_key: string;
      root: false;
    } |
    {
      root: true;
    }
  )

export interface NavItem {
  name: string;
  locale_key: string;
  to: typeof RouterLinkProps['to']
  icon: string;
}

export function createRootCategory(): NavCategory {
  const items: NavItem[] = [];
  return {
    name: '',
    root: true,
    add: (item: NavItem) => items.push(item),
    items: items
  }
}

export function createNavCategory(name: string, locale_key: string): NavCategory {
  const items: NavItem[] = [];
  return {
    name,
    locale_key,
    root: false,
    add: (item: NavItem) => items.push(item),
    items: items
  }
}

export function createNavItem(name: string, locale_key: string, to: typeof RouterLinkProps['to'], icon: string) {
  return { name, locale_key, to, icon }
}

export function mergeNavCategory(...categories: NavCategory[]) {
  return categories.reduce((acc, category) => {
    acc.push(category);
    return acc;
  }, [] as NavCategory[])
}
