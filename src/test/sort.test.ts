import * as assert from 'assert';

import { TextDocument, Uri } from 'vscode';

import importSort from 'import-sort';
import * as importSortParserBabylon from 'import-sort-parser-babylon';

import { importSortStyleFunction } from '../import-sort-style-function';

const getMockText = (): string => {
  return `import { Router } from '@angular/router';
import { ViewChild, Component, OnInit } from '@angular/core';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { filter } from 'lodash';
import { combineLatest } from 'rxjs';
import { ReportType } from 'api/rapids/reports/report-type';
import { RegionType } from 'api/rapids/payload/region-type';
import { FilterSet } from 'api/database/models/frontend/filter-set';
import { ReportComponent } from './report.component.ts';
import { AppComponent } from 'app/app.component.ts';
`;
};

const mockDocument = {
  languageId: 'typescript',
  fileName: 'mockDocument',
  getText: getMockText
} as TextDocument;

const importSortStyle = importSortStyleFunction([
  ['@angular'],
  ['rxjs', 'lodash'],
  ['api'],
  ['app', './']
]);

suite("Sort Tests", () => {
  test("Test 1", () => {
    const result = importSort(
      mockDocument.getText(),
      importSortParserBabylon,
      importSortStyle,
      mockDocument.fileName,
      {}
    );

    console.error(result.code);
  });
});
