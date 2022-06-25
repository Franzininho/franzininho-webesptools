var xml_text_toolbox = `
<xml xmlns="https://developers.google.com/blockly/xml" id="toolbox" style="display: none">
	<category name="Logic" colour="%{BKY_LOGIC_HUE}">
	  <block type="controls_if"></block>
	  <block type="logic_compare"></block>
	  <block type="logic_operation"></block>
	  <block type="logic_negate"></block>
	  <block type="logic_boolean"></block>
	</category>
	<category name="Loops" colour="%{BKY_LOOPS_HUE}">
	  <block type="controls_repeat_ext">
		<value name="TIMES">
		  <block type="math_number">
			<field name="NUM">10</field>
		  </block>
		</value>
	  </block>
	  <block type="controls_whileUntil"></block>
	</category>
	<category name="Math" colour="%{BKY_MATH_HUE}">
	  <block type="math_number">
		<field name="NUM">123</field>
	  </block>
	  <block type="math_arithmetic"></block>
	  <block type="math_single"></block>
	</category>
	<category name="Text" colour="%{BKY_TEXTS_HUE}">
	  <block type="text"></block>
	  <block type="text_length"></block>
	  <block type="text_print"></block>
	</category>
	<sep></sep>
	<category name="Franzininho" colour="135">
	  <block type="importarboard"></block>
	  <block type="import_time"></block>
	  <block type="importardigitalio"></block>
	  <block type="importar_neopixel_write"></block>
	  <block type="importar_configurar_neopixel"></block>
	  <block type="acender_neopixel"></block>
	  <block type="pausa"></block>
	  <block type="rainbow_effect"></block>
	</category>
</xml> `;

var xml_toolbox = Blockly.Xml.textToDom(xml_text_toolbox);