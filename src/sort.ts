import * as importSortParserBabylon from 'import-sort-parser-babylon';

import { DEFAULT_CONFIGS, getConfig } from 'import-sort-config';
import { Range, TextDocument, window } from 'vscode';
import { dirname, extname } from 'path';

import { Logger } from './logger';
import { getConfiguration } from './extension';
import importSort from 'import-sort';
import { importSortStyleFunction } from './import-sort-style-function';

const defaultLanguages = [
  'javascript',
  'typescript',
];

let cachedOptions: object;

export function sortModules() {
  Logger.info('sortModules start');

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

    cachedOptions = {
      ...cachedOptions,
      sampleOption: ['Sample One']
    };

    console.error('sortConfig', sortConfig);
    console.error('cachedOptions', cachedOptions);

    const importSortStyle = importSortStyleFunction(getConfiguration<string[][]>('sort-groups') || []);

    console.error(document.getText());
    const result = importSort(document.getText(), importSortParserBabylon, importSortStyle, fileName, cachedOptions);

    Logger.info('sortModules end');

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
