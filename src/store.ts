import { atom } from 'nanostores';

declare type PkgManeger = 'npm' | 'yarn' | 'pnpm';

export const $pkgManeger = atom<PkgManeger>('npm');

