import { createNavCategory, createNavItem, createRootCategory, mergeNavCategory } from "@/utils/nav-helper"

const root = createRootCategory();

root.add(createNavItem('仪表盘', 'nav.root.dashboard', { name: '/dashboard' }, 'i-mingcute-chart-line-line'));
root.add(createNavItem('文章', 'nav.root.posts', { name: '/posts' }, 'i-mingcute-paper-line'));
root.add(createNavItem('标签', 'nav.root.tags', { name: '/tags' }, 'i-mingcute-tag-2-line'));
root.add(createNavItem('媒体管理', 'nav.root.media', { name: '/media' }, 'i-mingcute-photo-album-line'));

const comment = createNavCategory('评论', 'nav.comments.title');
comment.add(createNavItem('评论管理', 'nav.comments.manage', { name: '/comments/manage' }, 'i-mingcute-comment-line'));
comment.add(createNavItem('评论审核', 'nav.comments.review', { name: '/comments/review' }, 'i-mingcute-report-line'));

const friend = createNavCategory('朋友', 'nav.friends.title');
friend.add(createNavItem('友链管理', 'nav.friends.manage', { name: '/friends/manage' }, 'i-mingcute-contacts-3-line'));
friend.add(createNavItem('友链审核', 'nav.friends.review', { name: '/friends/review' }, 'i-mingcute-report-line'));

const project = createNavCategory('项目', 'nav.projects.title');
project.add(createNavItem('项目管理', 'nav.projects.manage', { name: '/projects/manage' }, 'i-mingcute-box-2-line'));
project.add(createNavItem('项目分类', 'nav.projects.categories', { name: '/projects/categories' }, 'i-mingcute-tag-2-line'));

const system = createNavCategory('系统', 'nav.system.title');
system.add(createNavItem('用户管理', 'nav.system.users', { name: '/system/users' }, 'i-mingcute-user-3-line'));
system.add(createNavItem('站点设置', 'nav.system.settings', { name: '/system/settings' }, 'i-mingcute-settings-3-line'));

export const NAV_ITEMS = mergeNavCategory(
  root,
  comment,
  friend,
  project,
  system
);
