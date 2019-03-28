import { IStyleAPI, IStyle, IStyleItem, IPredicateFunction } from "import-sort-style";

function matches(regExp: string): IPredicateFunction {
  const re = new RegExp(`^${regExp}(\/|$)`);

  return (text) => {
    return re.test(text);
  };
}

export function importSortStyleFunction(sortGroups: string[][]): IStyle {
  return (styleApi: IStyleAPI) => {
    const {
      always,
      member,
      moduleName,
      name,
      or,
      unicode,
    } = styleApi;

    function sortCaseInsensitiveComparator(first: string, second: string): number {
      return unicode(first.toLowerCase(), second.toLowerCase());
    }

    const styleItems: IStyleItem[] = [];

    sortGroups.forEach((sortGroup) => {
      const matchers = sortGroup.map((module) => {
        return moduleName(matches(module));
      });

      styleItems.push(
        {
          separator: false,
          match: or(
            ...matchers
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
  };
}
