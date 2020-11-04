import build from '../build/main.js';

export default build({
  NODE_ENV: 'development',
  args: '--source-maps inline --verbose --watch',
});
