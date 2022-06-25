
	//Blockly
	var mostrar = "nada aqui";
	  
    var workspace = Blockly.inject('blocklyDiv',
		{
		  media: 'https://unpkg.com/blockly/media/',
		  grid:{spacing: 20,length: 3,colour: '#ccc',snap: true},   
		  zoom:{controls: true, wheel: true, startScale: 1.0, maxScale: 3, minScale: 0.3, scaleSpeed: 1.2, pinch: true},
		  toolbox: xml_toolbox
		});
	
	Blockly.Xml.domToWorkspace(xml_startBlocks, workspace);
	
	
	
	function showCodePY() {
      // Generate Python code and display it.
      Blockly.Python.INFINITE_LOOP_TRAP = null;
      var code = Blockly.Python.workspaceToCode(workspace);
      alert(code);
    }
	
	function update(event) {
		Blockly.Python.INFINITE_LOOP_TRAP = null;
		var code = new String(Blockly.Python.workspaceToCode(workspace));
		if (code != "") {
			mostrar = code;
			document.getElementById("codigogerado").innerHTML = mostrar;
			document.getElementById("codigogeradoeditor").innerHTML = mostrar;
		}
	}

	workspace.addChangeListener(update);