import { commands, ExtensionContext, window } from 'vscode';

import { sortCurrentDocument } from './sort';
import { Logger } from './logger';

export const EXTENSION_NAME = 'sort-imports-comscore';

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
