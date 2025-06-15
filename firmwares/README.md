# Template para Inclusão de Novo Firmware na Franzininho WiFi Play Store

## Estrutura do app no `apps.json`

```json
{
  "id": "nome_unico",
  "name": "Nome do App",
  "description": "Breve descrição do firmware.",
  "category": "Plataformas | Automação | Exemplos | Jogos",
  "tags": ["exemplos", "jogos", "sensores", "atuadores", "automação", "demo", "fabrica"],
  "boards": ["Franzininho WiFi", "Franzininho WiFi LAB01"],
  "soc": ["ESP32-S2", "ESP32-S3"],
  "image": "firmwares/nome_unico/imagem.png",
  "versions": [
    {
      "label": "1.0.0",
      "manifest": "firmwares/nome_unico/manifest.json"
    }
  ]
}
```

## Categorias

- **Plataformas:** Firmwares que rodam interpretadores ou ambientes de programação.
- **Automação:** Firmwares prontos para IoT, controle e sensores.
- **Exemplos:** Exemplos simples de uso de sensores, atuadores, etc.
- **Jogos:** Jogos ou demos interativos para a Franzininho.

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

## Instruções

1. Crie uma pasta para o firmware em `firmwares/nome_unico/`.
2. Adicione o(s) binário(s) e o(s) arquivo(s) de manifest.
3. Adicione uma imagem de capa (320x180px, PNG ou SVG).
4. Preencha o bloco acima no `apps.json`.
5. Atualize as listas de categorias, tags, placas e SoC se necessário.
