import * as vscode from 'vscode';
import * as os from 'os';


const DEBUG = true;
const LOG_PREFIX = "[GoWorkspace]";

function log(message?: any, ...optionalParams: any[]): void {
	if (DEBUG) {
		console.log(LOG_PREFIX, message, ...optionalParams);
	}
}

function addFoldersToWorkspace(force: boolean): void {
	if (!force) {
		// do nothing if not in folder or workspace (i.e. single files)
		if (vscode.workspace.workspaceFolders === undefined) {
			return;
		}
		// do nothing if it's already a workspace
		if (vscode.workspace.workspaceFile !== undefined) {
			log("It's already a workspace:", vscode.workspace.workspaceFile.path);
			return;
		}
	}

	log("Add folders to workspace. force=" + force);
	let folderCount = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders.length : 0;
	let ok = vscode.workspace.updateWorkspaceFolders(
		folderCount, 0,
		{ uri: vscode.Uri.file("/usr/local/go/src"), name: "Go Source" },
		{ uri: vscode.Uri.file(os.homedir() + "/go/pkg/mod"), name: "Go Mod" }
	);

	if (ok) {
		// vscode.commands.executeCommand("workbench.action.saveWorkspaceAs")
	} else {
		let errMessage = "Failed to add workspace folders.";
		log(errMessage);
		vscode.window.showErrorMessage(errMessage);
	}
}


// this method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
	log('In activate!');
	addFoldersToWorkspace(false);

	let disposable = vscode.commands.registerCommand('goworkspace.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from goworkspace!');
		addFoldersToWorkspace(true);
	});
	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
	log("In deactivate");
}
