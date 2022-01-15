import * as vscode from 'vscode';
import * as os from 'os';
import * as path from 'path';
import { execSync } from 'child_process';


const DEBUG = false;
const LOG_PREFIX = "[GoWorkspace]";

interface Folder {
	path: string;
	name?: string;
}

interface WorkspaceFolder {
	uri: vscode.Uri;
	name?: string | undefined;
}


function log(message?: any, ...optionalParams: any[]): void {
	if (DEBUG) {
		console.log(LOG_PREFIX, message, ...optionalParams);
	}
}

function error(message?: any, ...optionalParams: any[]): void {
	console.error(LOG_PREFIX, message, ...optionalParams);
}

function getFromShell(cmd: string, defaultResult: string): string {
	try {
		return execSync(cmd).toString().trim();
	} catch (err) {
		error("" + err);
		return defaultResult;
	}
}

function foldersToAdd(): Folder[] {
	let goRoot = getFromShell("go env GOROOT", "/usr/local/go");
	let goPath = getFromShell("go env GOPATH", os.homedir() + "/go");
	// let goVersion = getFromShell("go env GOVERSION", "go").slice(2);	// prefix "go" removed. e.g. 1.17.6

	let folders: Folder[] = [
		{ path: path.join(goPath, "pkg/mod"), name: "Go Modules" },
		{ path: path.join(goRoot, "src"), name: "Go SDK" },
	];
	return folders;
}

function addLibFoldersToWorkspace(force: boolean): void {
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

	log("Add library folders to workspace. force=" + force);
	let workspaceFoldersToAdd: WorkspaceFolder[] = foldersToAdd().map((f) => {
		return { uri: vscode.Uri.file(f.path), name: f.name };
	});

	let folderCount = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders.length : 0;
	let ok = vscode.workspace.updateWorkspaceFolders(folderCount, 0, ...workspaceFoldersToAdd);
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
	let config = vscode.workspace.getConfiguration("goworkspace");
	var autoAdd = config.get("autoAddLibFolders");
	log("goworkspace.autoAddLibFolders=" + autoAdd);
	if (autoAdd) {
		addLibFoldersToWorkspace(false);
	}

	let disposable = vscode.commands.registerCommand('goworkspace.addLibFoldersToWorkspace', () => {
		// vscode.window.showInformationMessage('Hello World from goworkspace!');
		addLibFoldersToWorkspace(true);
	});
	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
	log("In deactivate");
}
