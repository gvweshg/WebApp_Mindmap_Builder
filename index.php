<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black">

	<title>Mindmaps Tool</title>

	<link rel="stylesheet" type="text/css" href="style/style.css" />
	<link rel="stylesheet" type="text/css" href="style/colorpicker.css" />
	<link rel="stylesheet" type="text/css" href="style/jquery-ui.css" />
	<link rel="stylesheet" type="text/css" href="style/overlay.css" />
</head>

<script type="text/javascript" src="js/library/jquery.min.js"></script>
<script type="text/javascript" src="js/library/jquery-ui.min.js"></script>
<script type="text/javascript" src="js/library/jquery.ui.touch-punch.min.js"></script>
<script type="text/javascript" src="js/library/colorpicker.js"></script>
<script type="text/javascript" src="js/library/html2canvas.js"></script>
<script type="text/javascript" src="js/library/file_upload/jquery.iframe-transport.js"></script>
<script type="text/javascript" src="js/library/file_upload/jquery.ui.widget.js"></script>
<script type="text/javascript" src="js/library/file_upload/jquery.fileupload.js"></script>

<script type="text/javascript" src="js/mine/main.js"></script>
<script type="text/javascript" src="js/mine/node.js"></script>
<script type="text/javascript" src="js/mine/curve.js"></script>
<script type="text/javascript" src="js/mine/control.js"></script>
<script type="text/javascript" src="js/mine/action.js"></script>
<script type="text/javascript" src="js/mine/overlay.js"></script>

<body>
    <?php require_once("theme/overlay.html"); ?>
	<div id="main_menu">
		<div id="logo_area">Mindmaps</div>
        <ul id="menu_left">
            <li><button id="btn-menu-add">Add</button></li>
            <li class="mgn-right"><button id="btn-menu-del">Delete</button></li>
            <li><button id="btn-menu-undo" class="disabled" disabled="disabled">Undo</button></li>
            <li class="mgn-right"><button id="btn-menu-redo" class="disabled" disabled="disabled">Redo</button></li>
            <li><button id="btn-menu-copy">Copy</button></li>
            <li><button id="btn-menu-cut">Cut</button></li>
            <li><button id="btn-menu-paste" class="disabled" disabled="disabled">Paste</button></li>
        </ul>
        <ul id="menu_right">
            <li><button>Menu</button></li>
        </ul>
	</div>

    <div id="drop_menu">
		<ul id="drop_file">
			<li><span>Save</span></li>
			<li><span>Load</span></li>
            <li><span>Export</span></li>
            <li><span>Help</span></li>
            <li><span>Print</span></li>
            <li><span>Autosave</span></li>
		</ul>
	</div>

    <div id="inspect_area" class="popup-area">
        <div class="header-area">
            <span>Inspector</span>
            <p class="btn-min">&nbsp;</p>
        </div>
        <div class="body-area">
            <table cellpadding="0" cellspacing="0">
                <tr>
                    <td>Font size:</td>
                    <td>
                        <input type="button" value="A-" id='btn-fsize-dec'>
                        <input type="button" value="A+" id='btn-fsize-inc'>
                    </td>
                </tr>
                <tr>
                    <td>Font style:</td>
                    <td id="font-style-btns">
                        <input type="button" value="B" id='btn-font-bold'>
                        <input type="button" value="I" id='btn-font-italic'>
                        <input type="button" value="U" id='btn-font-underline'>
                        <input type="button" value="S" id='btn-font-midline'>
                    </td>
                </tr>
                <tr>
                    <td>Font Family:</td>
                    <td id="font-family-btns">
                        <select>
                            <option value="arial">Arial</option>
                            <option value="inherit">inherit</option>
                            <option value="cursive">Cursive</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>Font color:</td>
                    <td><p id="font-color"></p></td>
                </tr>
                <tr>
                    <td>Branch color:</td>
                    <td><p id="branch-color"></p></td>
                </tr>
            </table>
        </div>
    </div>

    <div id="zoom-area" class="popup-area">
        <div class="header-area">
            <span>Zoom Area</span>
            <p class="btn-min">&nbsp;</p>
        </div>
        <div class="body-area">
            <div id="slider-area"></div>
            <center>100%</center>
        </div>
    </div>

    <div id="clipboard-area"></div>

    <div id="navigator_area">
        <div class="header-area">
            <span>Inspector123</span>
            <p class="btn-min">&nbsp;</p>
        </div>
        <div class="body-area"></div>
    </div>

    <div id="ctrl-pointer">
        <div id="ctroller"></div>
        <canvas id="creator-canvas"></canvas>
    </div>

	<div id="canvas_area">
        <div id="center_point" class="node-item">
            <div id="center_title" class="node-title">Central Idea</div>
        </div>
    </div>

    <div id="addimg_area">
        <span>URL:</span>
        <input type="text" id="img_url">
        <input type="button" id="img_add_btn" value="Add">
    </div>

    <div id="hint-toolbar" class="hint-pup">
        <h2>This is your toolbar</h2>
        <p>Those buttons do what they say. You can use them or work with keyboard shortcuts. Hover over the buttons for the key combinations.</p>
        <img src="img/close.png" class="close-hint">
    </div>
    <div id="hint-inspector" class="hint-pup">
        <h2>This is the inspector</h2>
        <p>Use these controls to change the appearance of your ideas. Try clicking the icon in the upper right corner to minimize this panel.</p>
        <img src="img/close.png" class="close-hint">
    </div>
    <div id="hint-zoom" class="hint-pup">
        <h2>This is the zoom area</h2>
        <p>Use this panel to get an overview of your map. You can navigate around by dragging the red rectangle or change the zoom by clicking on the magnifier buttons.</p>
        <img src="img/close.png" class="close-hint">
    </div>
    <div id="hint-main" class="hint-pup">
        <h2>This is your main idea</h2>
        <p>Double click an idea to edit its text. Move the mouse over an idea and drag the red circle to create a new idea.</p>
        <img src="img/close.png" class="close-hint">
    </div>

    <span id="chk-width"></span>
	<div id="version_area"><center>Version 1.0  <br><span>(Last release 0.5 on 2015.1.10)</span></center></div>
</body>