import * as vscode from 'vscode';
import * as os from 'os';

const LOG_PREFIX = "[GoWorkspace]";

function log(message?: any, ...optionalParams: any[]): void {
	console.log(LOG_PREFIX, message, ...optionalParams);
}

function addFoldersToWorkspace(): void {
	// do nothing if not in folder or workspace
	if (vscode.workspace.workspaceFolders === undefined) {
		return;
	}
	// in a workspace
	// if (vscode.workspace.workspaceFile !== undefined) {
	// 	log("In workspace:", vscode.workspace.workspaceFile.path);
	// 	return;
	// }

	log("Add folders to workspace");
	let folderCount = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders.length : 0;
	let ok = vscode.workspace.updateWorkspaceFolders(
		folderCount, 0,
		{ uri: vscode.Uri.file("/usr/local/go/src"), name: "Go Source" },
		{ uri: vscode.Uri.file(os.homedir() + "/go/pkg/mod"), name: "Go Mod" }
	);

	if (ok) {
		// vscode.commands.executeCommand("workbench.action.saveWorkspaceAs")
	} else {
		vscode.window.showErrorMessage("Failed to add workspace folders.");
	}
}


// this method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
	log('In activate!');
	addFoldersToWorkspace();

	let disposable = vscode.commands.registerCommand('goworkspace.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from goworkspace!');
		addFoldersToWorkspace();
	});
	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
	log("In deactivate");
}
