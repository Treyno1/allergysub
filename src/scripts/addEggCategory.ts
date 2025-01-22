import 'dotenv/config';
import { moveEggsToNewCategory } from '../lib/database';

async function main() {
  console.log('Moving egg items to new category...');
  await moveEggsToNewCategory();
  console.log('Done!');
}

main().catch(console.error); 