# Template de Novo Firmware para Franzininho WiFi Play Store

## Estrutura sugerida para apps.json

```json
{
  "id": "template-firmware",
  "name": "Nome do Firmware",
  "description": "Breve descrição do firmware.",
  "category": "Plataformas | Automação | Exemplos | Jogos",
  "tags": ["sensores", "atuadores", "automação", "demo", "fabrica"],
  "boards": ["Franzininho WiFi", "Franzininho WiFi LAB01"],
  "soc": ["ESP32-S2", "ESP32-S3"],
  "image": "firmwares/template-firmware/template.png",
  "versions": [
    {
      "label": "1.0.0",
      "manifest": "firmwares/template-firmware/manifest.json"
    }
  ]
}
```

- Adicione o(s) binário(s) do firmware nesta pasta.
- Adicione uma imagem de capa (320x180px, PNG ou SVG) como `template.png`.
- Preencha o bloco acima no `apps.json`.
- Atualize as listas de categorias, tags, boards e soc se necessário.

## Como configurar manifest.json para múltiplos binários

Se sua aplicação precisa de mais de um binário (ex: bootloader, partition table, firmware principal), utilize o campo `parts` dentro de `builds` no `manifest.json`:

```json
{
  "name": "ESP-IDF - Wroom",
  "new_install_prompt_erase": true,
  "builds": [
    {
      "chipFamily": "ESP32-S2",
      "parts": [
        { "path": "bootloaderWroom.bin", "offset": 4096 },
        { "path": "partition-tableWroom.bin", "offset": 32768 },
        { "path": "hello-worldWroom.bin", "offset": 65536 }
      ]
    }
  ]
}
```

- Cada item em `parts` representa um binário a ser gravado, com o caminho do arquivo e o offset correspondente na memória flash.
- O nome do arquivo deve estar presente na mesma pasta do manifest.
- O campo `chipFamily` deve corresponder ao SoC suportado.


## Categorias

- Plataformas: Firmwares que rodam interpretadores ou ambientes de programação.
- Automação: Firmwares prontos para IoT, controle e sensores.
- Exemplos: Exemplos simples de uso de sensores, atuadores, etc.
- Jogos: Jogos ou demos interativos para a Franzininho.


## Tags sugeridas

- exemplos
- jogos
- sensores
- atuadores
- automação
- demo
- fabrica


## Placas suportadas

- Franzininho WiFi
- Franzininho WiFi LAB01


## SoC suportados

- ESP32-S2
- ESP32-S3
