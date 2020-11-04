import build from '../build/main.js';

export default build({
  NODE_ENV: 'production',
  args: '--source-maps',
});
