var xml_text_startBlocks = `
<xml>
	<block type="importarboard" inline="false" x="20" y="20">
	<next><block type="importardigitalio" inline="true">
	<next><block type="import_time">
	<next><block type="importar_neopixel_write">
	<next><block type="importar_configurar_neopixel">
	<next><block type="controls_whileUntil">
		<field name="MODE">WHILE</field>
		<value name="BOOL">
			<block type="logic_boolean"><field name="BOOL">TRUE</field></block>
		</value>
		<statement name="DO">
			<block type="acender_neopixel"><field name="R">0</field><field name="G">0</field><field name="B">0</field>
			<next><block type="pausa"><field name="P">1</field>
			<next><block type="acender_neopixel"><field name="R">128</field><field name="G">128</field><field name="B">128</field>
			<next><block type="pausa"><field name="P">1</field></block>
			</next></block>
			</next></block>
			</next></block>
		</statement>
		</block></next>
		</block></next>
		</block></next>
		</block></next>
		</block></next>
	</block>
</xml> `;

var xml_startBlocks = Blockly.Xml.textToDom(xml_text_startBlocks);