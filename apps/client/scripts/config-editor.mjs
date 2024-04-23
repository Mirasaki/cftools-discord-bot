import { readFileSync } from 'fs';

(async () => {
  let jsonEditor;
  try  {
    jsonEditor = await import('@rhidium/json-editor');
  }
  catch {
    console.error('Please install @rhidium/json-editor: "pnpm add -D @rhidium/json-editor"');
    process.exit(1);
  }

  const {
    startJSONEditor,
  } = jsonEditor;
  
  const jsonSchema = readFileSync('./config/config.schema.json', { encoding: 'utf-8' });
  
  startJSONEditor({
    port: 3000,
    dataFilePath: './config/config.json',
    createBackup: true,
    schemaString: jsonSchema,
  });
})();
