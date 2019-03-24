import { IStyleAPI, IStyleItem } from "import-sort-style";
import { IImport } from 'import-sort-parser';
import { Logger } from './logger';

export default function (styleApi: IStyleAPI): IStyleItem[] {
  const {
    always,
    and,
    isRelativeModule,
    member,
    name,
    not,
    or,
    unicode,
  } = styleApi;

  return [
    // import {…} from "angular";
    {
      match: isAngular,
      sort: member(unicode),
      sortNamedMembers: name(unicode),
    },
    { separator: true },

    // import {…} from "rxjs" || "@ng-bootstrap" || "moment";
    {
      match: and(
        not(isRelativeModule),
        not(isApi),
        not(isApp),
      ),
      sort: member(unicode),
      sortNamedMembers: name(unicode),
    },
    { separator: true },

    // import {…} from "api";
    {
      match: isApi,
      sort: member(unicode),
      sortNamedMembers: name(unicode),
    },
    { separator: true },

    // import {…} from "../*" || "./*"" || "app/*";
    {
      match: or(
        isRelativeModule,
        isApp,
      ),
      sort: member(unicode),
      sortNamedMembers: name(unicode),
    },
    { separator: true },

    // Catch all, nothing should make it this far
    {
      match: always,
      sort: member(unicode),
      sortNamedMembers: name(unicode),
    },
    { separator: true },
  ];
}

function isAngular(imported: IImport): boolean {
  console.error('isAngular', imported.moduleName, imported.moduleName.startsWith('angular'));
  return imported.moduleName.startsWith('angular');
}

function isApi(imported: IImport): boolean {
  console.error('isApi', imported.moduleName, imported.moduleName.startsWith('api'));
  return imported.moduleName.startsWith('api');
}

function isApp(imported: IImport): boolean {
  console.error('isApp', imported.moduleName, imported.moduleName.startsWith('app'));
  return imported.moduleName.startsWith('app');
}
