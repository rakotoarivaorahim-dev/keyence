import { spawn, execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const distIndex = path.join(root, 'dist', 'index.html');

if (!fs.existsSync(distIndex)) {
  console.log('Premier lancement : construction de l\'application...');
  execSync('npm run build', { cwd: root, stdio: 'inherit' });
}

const PORT = process.env.PORT || 3001;
const url = `http://localhost:${PORT}`;

const server = spawn(process.execPath, [path.join(root, 'server', 'index.js')], {
  cwd: root,
  stdio: 'inherit',
});

server.on('exit', (code) => process.exit(code ?? 0));
process.on('SIGINT', () => server.kill('SIGINT'));
process.on('SIGTERM', () => server.kill('SIGTERM'));

async function waitForServer(target, timeoutMs = 20000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      await fetch(target);
      return true;
    } catch {
      await new Promise((r) => setTimeout(r, 300));
    }
  }
  return false;
}

function openBrowser(target) {
  const platform = process.platform;
  const [cmd, args] =
    platform === 'darwin' ? ['open', [target]] :
    platform === 'win32' ? ['cmd', ['/c', 'start', '""', target]] :
    ['xdg-open', [target]];
  try {
    const opener = spawn(cmd, args, { stdio: 'ignore', detached: true });
    opener.on('error', () => {
      console.log(`Ouvre manuellement ton navigateur sur ${target}`);
    });
    opener.unref();
  } catch {
    console.log(`Ouvre manuellement ton navigateur sur ${target}`);
  }
}

const ready = await waitForServer(url);
if (ready) {
  console.log(`CRM prêt : ${url}`);
  openBrowser(url);
} else {
  console.log(`Le serveur met du temps à démarrer, ouvre manuellement ${url}`);
}
