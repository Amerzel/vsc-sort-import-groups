import { importSortStyleFunction } from '../import-sort-style-function';

suite("Import Sort Style Function Tests", () => {
  test("Test 1", () => {
    const result = importSortStyleFunction([
      ['@angular'],
      ['@rxjs', 'lodash'],
      ['api']
    ]);

    // console.error(JSON.stringify(result(StyleApi.default)), null, 2);
  });
});
