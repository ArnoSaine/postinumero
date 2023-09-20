import { join } from 'path';
import fs from 'fs-extra';
import template from '../template.js';

export default async function (name) {
  await fs.ensureDir(join(process.cwd(), name));
  await fs.writeJson(
    join(process.cwd(), name, 'package.json'),
    template(name),
    { spaces: 2 }
  );
}
