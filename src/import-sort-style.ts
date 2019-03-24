import { IStyleAPI, IStyleItem } from "import-sort-style";

export default function (styleApi: IStyleAPI): IStyleItem[] {
  const {
    always,
    isRelativeModule,
    member,
    moduleName,
    name,
    or,
    startsWith,
    unicode,
  } = styleApi;

  return [
    // import {…} from "angular";
    {
      match: or(
        moduleName(startsWith('@angular'))
      ),
      sort: member(unicode),
      sortNamedMembers: name(unicode),
    },
    { separator: true },

    // import {…} from "rxjs" || "@ng-bootstrap" || "moment";
    {
      match: or(
        moduleName(startsWith('rxjs'))
      ),
      sort: member(unicode),
      sortNamedMembers: name(unicode),
    },
    { separator: true },

    // import {…} from "api";
    {
      match: or(
        moduleName(startsWith('api'))
      ),
      sort: member(unicode),
      sortNamedMembers: name(unicode),
    },
    { separator: true },

    // import {…} from "../*" || "./*"" || "app/*";
    {
      match: or(
        isRelativeModule,
        moduleName(startsWith('app')),
      ),
      sort: member(unicode),
      sortNamedMembers: name(unicode),
    },
    { separator: true },

    // Catch all, nothing should make it this far
    {
      match: always,
      sort: moduleName(unicode),
      sortNamedMembers: name(unicode),
    },
    { separator: true },
  ];
}
