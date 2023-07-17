
const vscode = require('vscode');
const path = require('path')
const fs = require('fs');
function getFilesAndFoldersInDir(path) {
	const items = fs.readdirSync(path);
	const result = [];
	items.forEach(item => {
	  const itemPath = `${path}/${item}`;
	  const stat = fs.statSync(itemPath);
	  if (stat.isDirectory()) {
		let data = {
		  // 文件夹
		  type: 'folder',
		  name: item
		}
		let children = getFilesAndFoldersInDir(itemPath)
		if (children && children.length) {
		  data.children = children
		}
		result.push(data);
	  } else {
		// 文件
		result.push({
		  type: 'file',
		  name: item
		});
	  }
	});
	return result;
  }

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "3dtile-viewer" is now active!');

	
	const list = getFilesAndFoldersInDir(path.join(context.extensionPath , "dist" , "assets")).filter((item)=>{
		return item.name.includes('index')
	})

	let isDispose = true
	let panel
	
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('3dtile-viewer.helloWorld', function (uri) {
		console.log(uri)
		let type = '3dtile'
		if (uri.path.endsWith('.b3dm')) {
			type = 'b3dm'
		}

		if (uri.path.endsWith('.i3dm')) {
			type = 'i3dm'
		}

		if (uri.path.endsWith('.pnts')) {
			type = 'pnts'
		}

		if (uri.path.endsWith('.cmpt')) {
			type = "cmpt"
		}

	 	const title =  uri.path.split("/").pop()

		vscode.window.showInformationMessage(`Hello Visitor from 3dtile-viewer! This is a ${type} file`)
		if (isDispose) {
			panel = vscode.window.createWebviewPanel("webview" , "3dtile-viewer" , vscode.ViewColumn.One , {enableScripts : true, })
			const testDataUrl = panel.webview.asWebviewUri(
				uri
			) || panel.webview.asWebviewUri(
				vscode.Uri.file(path.join(context.extensionPath , 'test' , '3dtile' ,'tileset.json'))
			)
			const dracoPath = panel.webview.asWebviewUri(
				vscode.Uri.file(path.join(context.extensionPath, 'assets' , 'draco/' ,
				))
			)
			console.log(testDataUrl.toString())
			panel.webview.onDidReceiveMessage((message )=>{
				if (message.command === 'webviewLoaded') {
					console.log('webview 加载完成')
					panel.webview.postMessage({ 
						url : testDataUrl.toString(),
						dracoPath : dracoPath.toString(),
						type : type
					})
				}
			})
			panel.title = title
			panel.onDidDispose(()=>{
				isDispose = true
			})
			isDispose = false
			const bundleScriptPathJs = panel.webview.asWebviewUri(
				vscode.Uri.file(path.join(context.extensionPath,  'dist' , 'assets' ,list.find((item)=>{
					return item.name.includes('js')
				  }).name
				))
			  )
			const bundleScriptPathCss = panel.webview.asWebviewUri(
			vscode.Uri.file(path.join(context.extensionPath, 'dist' , 'assets' ,list.find((item)=>{
				return item.name.includes('css')
			  }).name))
			)
			panel.webview.html = `
			<!DOCTYPE html>
				<html lang="en">
				<head>
					<meta charset="UTF-8" />
					<link rel="icon" type="image/svg+xml" href="/vite.svg" />
					<meta name="viewport" content="width=device-width, initial-scale=1.0" />
					<title>Vite + Vue</title>
				</head>
				<body>
				    <script>
					var vscode = acquireVsCodeApi();
					vscode.postMessage({
						command : 'webviewLoaded'
					})
					</script>
					<div id="app"></div>
					<script type="module" crossorigin src=${bundleScriptPathJs}></script>
					<link rel="stylesheet" href=${bundleScriptPathCss}>
				</body>
				</html>
			`;

			console.log(dracoPath.toString())
			return 
		}

		if (!panel.visible) {
			panel.reveal()
		}
		const testDataUrl = panel.webview.asWebviewUri(
			uri
		) || panel.webview.asWebviewUri(
			vscode.Uri.file(path.join(context.extensionPath , 'test' , '3dtile' ,'tileset.json'))
		)
		console.log(testDataUrl.toString())
		panel.webview.postMessage({ 
			url : testDataUrl.toString(),
			type : type
		});
		panel.title = title
	});
	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
