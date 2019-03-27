import { IStyleAPI, IStyle, IStyleItem } from "import-sort-style";

export function importSortStyleFunction(sortGroups: string[][]): IStyle {
  return (styleApi: IStyleAPI) => {
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

    function sortCaseInsensitiveComparator(first: string, second: string): number {
      return unicode(first.toLowerCase(), second.toLowerCase());
    }

    const styleItems: IStyleItem[] = [];

    sortGroups.forEach((sortGroup) => {
      styleItems.push(
        {
          separator: false,
          match: or(
            moduleName(startsWith(...sortGroup))
          ),
          sort: member(sortCaseInsensitiveComparator),
          sortNamedMembers: name(sortCaseInsensitiveComparator)
        },
        {
          separator: true
        }
      );
    });

    styleItems.push(
      // Catch all, anything left over would get sorted here
      {
        match: always,
        sort: moduleName(sortCaseInsensitiveComparator),
        sortNamedMembers: name(sortCaseInsensitiveComparator),
      },
      { separator: true },
    );

    console.error(styleItems);

    return styleItems;

    return [
      // import {…} from "angular";
      {
        match: or(
          moduleName(startsWith(...['@angular']))
        ),
        sort: member(sortCaseInsensitiveComparator),
        sortNamedMembers: name(sortCaseInsensitiveComparator),
      },
      { separator: true },

      // import {…} from "rxjs" || "@ng-bootstrap" || "moment";
      {
        match: or(
          moduleName(startsWith('rxjs', 'lodash')),
        ),
        sort: member(sortCaseInsensitiveComparator),
        sortNamedMembers: name(sortCaseInsensitiveComparator),
      },
      { separator: true },

      // import {…} from "api";
      {
        match: or(
          moduleName(startsWith('api')),
        ),
        sort: member(sortCaseInsensitiveComparator),
        sortNamedMembers: name(sortCaseInsensitiveComparator),
      },
      { separator: true },

      // import {…} from "app/" || "./";
      {
        match: or(
          moduleName(startsWith('app')),
          isRelativeModule
        ),
        sort: member(sortCaseInsensitiveComparator),
        sortNamedMembers: name(sortCaseInsensitiveComparator),
      },
      { separator: true },

      // Catch all, nothing should make it this far
      {
        match: always,
        sort: moduleName(sortCaseInsensitiveComparator),
        sortNamedMembers: name(sortCaseInsensitiveComparator),
      },
      { separator: true },
    ];
  };
}
