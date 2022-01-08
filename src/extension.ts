import * as vscode from 'vscode';


// this method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "goworkspace" is now active!');

	let disposable = vscode.commands.registerCommand('goworkspace.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from goworkspace!');
	});
	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
