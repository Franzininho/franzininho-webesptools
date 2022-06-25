//SERIAL	
	var port;		
	var writer; 
	var reader
	var grafico = '';
	const textEncoder = new TextEncoderStream();
	const textDecoder = new TextDecoderStream();	
	
	$("#connectar").click(async function() {
	
		if ("serial" in navigator) {
			port = await navigator.serial.requestPort();
			await port.open({ baudRate: 115200 });				
			$("#status").text("  CONECTADO!");				
			console.log("Connection the 115200 baunds");			
			
			//Escrita
			const writableStreamClosed = textEncoder.readable.pipeTo(port.writable);
			writer = textEncoder.writable.getWriter();
			
			//await writer.write("REPL");
			console.log("Start REPL!!!");
			//await writer.write(" \r\n");
			await writer.write("\x03\r\n"); //CTRL+C para iniciar REPL do CircuitPython
			
			//writer.releaseLock();		
			
			//Leitura
			const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
			reader = textDecoder.readable.getReader();

			// Listen to data coming from the serial device.
			while (true) {
			  const { value, done } = await reader.read();
			  if (done) {
				// Allow the serial port to be closed later.
				reader.releaseLock();
				break;
			  }
			  // value is a string.
			  const temp = $("#receiver_lines").val();
			  $("#receiver_lines").text( temp + value);			  
			  
			  const valor = Number(value);
			  if( valor != NaN ){
				config_line.data.datasets[0].data.push(valor);
				config_line.data.labels.push(config_line.data.datasets[0].data.length + 1);
				window.myLine.update();
			  }
			  
			  console.log("Receiver: " + value);
			}
			
		}else{
			console.log("Browser not accept WebSerial!!!");
		}
		
	});
	
	$("#connectarGrafico").click(async function() {
	
		if ("serial" in navigator) {
			port = await navigator.serial.requestPort();
			await port.open({ baudRate: 115200 });				
			$("#status").text("  CONECTADO!");				
			console.log("Connection the 115200 baunds");			
			
			//Escrita
			const writableStreamClosed = textEncoder.readable.pipeTo(port.writable);
			writer = textEncoder.writable.getWriter();
			
			//await writer.write("REPL");
			console.log("Start REPL!!!");
			//await writer.write(" \r\n");
			await writer.write("\x03\r\n"); //CTRL+C para iniciar REPL do CircuitPython
			
			//writer.releaseLock();		
			
			//Leitura
			const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
			reader = textDecoder.readable.getReader();

			// Listen to data coming from the serial device.
			while (true) {
			  const { value, done } = await reader.read();
			  if (done) {
				// Allow the serial port to be closed later.
				reader.releaseLock();
				break;
			  }
			  // value is a string.
			  const temp = $("#receiver_lines").val();
			  $("#receiver_lines").text( temp + value);			  
			  
			  grafico = grafico + value;
			  
			  if(value.indexOf('\n') !== -1){
			  
				  const valor = Number(grafico);
				  
				  if( valor !== NaN ){
					config_line.data.datasets[0].data.push(valor);
					config_line.data.labels.push(Date.now() );
					window.myLine.update();
										
					if(config_line.data.datasets[0].data.length > 50){
						config_line.data.datasets[0].data.shift();
						config_line.data.labels.shift();
				    }
					console.log("Graphic Update! " + valor);
				  }
				  
				  grafico = '';
				  
			  }
			  
			  console.log("Receiver: " + value);
			}
			
		}else{
			console.log("Browser not accept WebSerial!!!");
		}
		
	});
	
	$("#desconnectar").click(async function() {
	
		if (port != null) {				
			await writer.releaseLock();				
			await reader.releaseLock();
			await port.close();
			$("#status").text("");
			console.log("Conection closed.");
		}else{
			console.log("Not found device!");
		}
		
	});
	
	$("#send").click(async function() {
	
		await writer.write("\x03"); //CTRL+C para iniciar REPL do CircuitPython
		const cmd = $("#command_line").val();
		await writer.write(cmd + "\r\n");
		$("#command_line").val('');	
		console.log("Send command: " + cmd);				
		
	});
	
	$("#sendall").click(async function() {	
		
		const cmd = Blockly.Python.workspaceToCode(workspace);
		var comandos = cmd.split("\n");
		await writer.write("\x03\r\n"); //CTRL+C para iniciar REPL do CircuitPython
		
		console.log('--- Send Script ---');
		for (x in comandos) {	  
		  if (comandos[x][0] == ' '){	
			await writer.write(comandos[x] + "\n\r");
		  }else{
		    await writer.write(comandos[x] + "\n\r");
		  }
		  console.log(x + ' - ' + comandos[x] + '\n');	
		}	
		await writer.write("\n\r\n\r");	
		console.log('--- Send finally ---');		
		
	});
	
	$("#enviartudoGrafico").click(async function() {
	
		const cmd = Blockly.Python.workspaceToCode(workspace);
		var comandos = cmd.split("\n");
		
		console.log('--- Send Script ---');
		for (x in comandos) {	  
		  if (comandos[x][0] == ' '){	
			await writer.write(comandos[x] + "\n\r");
		  }else{
		    await writer.write("\n\r\n\r" + comandos[x] + "\n\r");
		  }
		  console.log(x + ' - ' + comandos[x] + '\n');	
		}		
		console.log('--- Send finally ---');		
		
	});
	
	$("#enter").click(async function() {
	
		await writer.write("\r\n\r\n");
		console.log("Enviado: [ENTER][ENTER]");		
		
	});
	
	$("#clear").click( function() {
	
		$("#receiver_lines").text('>>>');
		console.log("Console Limpo!");		
		
	});
	
	$("#salvarblocos").click( function(){
	
		var xml = Blockly.Xml.workspaceToDom(workspace);
		var xml_text = Blockly.Xml.domToText(xml);
	
	});