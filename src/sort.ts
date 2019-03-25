import { dirname, extname } from 'path';

import { TextDocument, window, Range } from 'vscode';

import importSort from 'import-sort';
import { DEFAULT_CONFIGS, getConfig } from 'import-sort-config';
import * as importSortParserBabylon from 'import-sort-parser-babylon';

import { importSortStyleFunction } from './import-sort-style-function';
import { Logger } from './logger';
import { getConfiguration } from './extension';

const defaultLanguages = [
  'javascript',
  'typescript',
];

let cachedOptions: object;

export function sortCurrentDocument() {
  Logger.info('sortCurrentDocument start');

  const activeTextEditor = window.activeTextEditor;

  if (activeTextEditor) {
    const sortedText = sort(activeTextEditor.document);

    if (!sortedText) {
      return;
    }

    return activeTextEditor.edit(edit => edit.replace(getMaxRange(), sortedText));
  }
}

export function sort(document: TextDocument): string | undefined{
  if (!isValidLanguage(document)) {
    return;
  }

  try {
    const fileName = document.fileName;
    const extensionConfig = clone(DEFAULT_CONFIGS);

    const extension = extname(fileName);
    const directory = dirname(fileName);

    const sortConfig = getConfig(extension, directory, extensionConfig);

    if (sortConfig) {
      cachedOptions = sortConfig.config.options || {};
    }

    console.info('cachedOptions', cachedOptions);

    const importSortStyle = importSortStyleFunction(getConfiguration<string[][]>('sort-groups') || []);

    const result = importSort(document.getText(), importSortParserBabylon, importSortStyle, fileName, cachedOptions);

    Logger.info('sortCurrentDocument end');

    return result.code;
  } catch (exception) {
    window.showWarningMessage(`Error sorting imports: ${exception}`);
    Logger.info(`Error sorting imports: ${exception}`);

    return;
  }
}

function isValidLanguage(document: TextDocument): boolean {
  return defaultLanguages.some((language) => document.languageId.includes(language));
}

function getMaxRange(): Range {
  return new Range(0, 0, Number.MAX_VALUE, Number.MAX_VALUE);
}

function clone(object: Object) {
  return JSON.parse(JSON.stringify(object));
}
