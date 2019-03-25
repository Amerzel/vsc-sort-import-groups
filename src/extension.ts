import { commands, ExtensionContext, window, workspace } from 'vscode';

import { sortCurrentDocument } from './sort';
import { Logger } from './logger';

export const EXTENSION_NAME = 'vsc-sort-imports-groups';

export function activate(context: ExtensionContext) {
	console.log(`"${EXTENSION_NAME}" activated.`);

	registerCommands();
	addSubscriptions(context);

	context.subscriptions.push();
}

export function deactivate() {
	console.log(`"${EXTENSION_NAME}" deactivated.`);
}

function registerCommands() {
	commands.registerCommand(`${EXTENSION_NAME}.helloWorld`, () => {
		window.showInformationMessage('Hello World!');
	});
	commands.registerCommand(`${EXTENSION_NAME}.sortDocument`, sortCurrentDocument);
}

function addSubscriptions(context: ExtensionContext) {
	context.subscriptions.push(Logger.getChannel());
}

export function getConfiguration<T>(key: string): T | undefined{
	return workspace.getConfiguration(EXTENSION_NAME).get<T>(key);
}
