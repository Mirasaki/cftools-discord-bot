import { writeFileSync } from 'fs';
import { createGenerator } from 'ts-json-schema-generator';

const generatorOptions = {
  path: './src/config/types.ts',
  tsconfig: './tsconfig.json',
  type: 'UserConfigOptions',
};

const schema = createGenerator(generatorOptions).createSchema(generatorOptions.type);
const schemaString = JSON.stringify(schema);

writeFileSync('./config/config.schema.json', schemaString);
