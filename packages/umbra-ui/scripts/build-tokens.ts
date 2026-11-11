import { writeFileSync } from 'node:fs';
import { tokensToCss } from '../src/tokens/tokens';

writeFileSync(new URL('../src/styles/tokens.css', import.meta.url), tokensToCss());
console.log('tokens → src/styles/tokens.css');
