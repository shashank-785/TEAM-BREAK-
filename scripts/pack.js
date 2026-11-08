import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const deliverablesDir = path.join(projectRoot, 'deliverables');
const stagingDir = path.join(projectRoot, 'temp_staging');

console.log('🚀 LearnOS Autonomous Deliverable Packaging Engine');
console.log(`Root: ${projectRoot}`);

if (fs.existsSync(deliverablesDir)) {
  fs.rmSync(deliverablesDir, { recursive: true, force: true });
}
fs.mkdirSync(deliverablesDir, { recursive: true });

if (fs.existsSync(stagingDir)) {
  fs.rmSync(stagingDir, { recursive: true, force: true });
}
fs.mkdirSync(stagingDir, { recursive: true });

function copyFiltered(src, dest) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    const base = path.basename(src);
    if (base === 'node_modules' || base === 'dist' || base === '.git' || base === 'temp_staging' || base === 'deliverables') {
      return;
    }
    fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src);
    for (const entry of entries) {
      copyFiltered(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    const base = path.basename(src);
    if (base === '.env' || base.endsWith('.log') || base.endsWith('.zip')) {
      return;
    }
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

function makeZip(zipName, stageSubdir) {
  const sourcePath = path.join(stagingDir, stageSubdir);
  const targetZip = path.join(deliverablesDir, `${zipName}.zip`);
  
  // Use PowerShell Compress-Archive with ProgressPreference SilentlyContinue
  const cmd = `powershell -NoProfile -Command "$ProgressPreference = 'SilentlyContinue'; Compress-Archive -Path '${sourcePath}\\*' -DestinationPath '${targetZip}' -Force"`;
  execSync(cmd, { stdio: 'inherit' });
  
  // Copy to root as well
  fs.copyFileSync(targetZip, path.join(projectRoot, `${zipName}.zip`));
  const sizeKb = Math.round(fs.statSync(targetZip).size / 1024);
  console.log(`  ✅ ${zipName}.zip (${sizeKb} KB)`);
}

// 1. ATLAS_LearnOS.zip
console.log('📦 Building ATLAS_LearnOS.zip...');
const atlasStage = path.join(stagingDir, 'ATLAS');
fs.mkdirSync(atlasStage, { recursive: true });
copyFiltered(path.join(projectRoot, 'agents/ATLAS/README.md'), path.join(atlasStage, 'README.md'));
copyFiltered(path.join(projectRoot, 'README.md'), path.join(atlasStage, 'PROJECT_README.md'));
const atlasPaths = [
  'client/src/components',
  'client/src/pages/Dashboard',
  'client/src/pages/AIAssistant',
  'client/src/pages/Analytics',
  'client/src/pages/ProfileSettings',
  'client/src/App.tsx',
  'client/src/main.tsx',
  'client/src/types',
  'client/src/services',
  'client/package.json',
  'client/tsconfig.json',
  'client/vite.config.ts',
  'client/tailwind.config.js'
];
for (const p of atlasPaths) {
  copyFiltered(path.join(projectRoot, p), path.join(atlasStage, p));
}
makeZip('ATLAS_LearnOS', 'ATLAS');

// 2. NOVA_LearnOS.zip
console.log('📦 Building NOVA_LearnOS.zip...');
const novaStage = path.join(stagingDir, 'NOVA');
fs.mkdirSync(novaStage, { recursive: true });
copyFiltered(path.join(projectRoot, 'agents/NOVA/README.md'), path.join(novaStage, 'README.md'));
copyFiltered(path.join(projectRoot, 'README.md'), path.join(novaStage, 'PROJECT_README.md'));
const novaPaths = [
  'client/src/pages/CollegeTutor',
  'client/src/pages/Notes',
  'client/src/pages/ExamCentre',
  'server/src/routes/tutor.ts',
  'server/src/routes/notes.ts',
  'server/src/routes/exams.ts',
  'server/src/types'
];
for (const p of novaPaths) {
  copyFiltered(path.join(projectRoot, p), path.join(novaStage, p));
}
makeZip('NOVA_LearnOS', 'NOVA');

// 3. ORBIT_LearnOS.zip
console.log('📦 Building ORBIT_LearnOS.zip...');
const orbitStage = path.join(stagingDir, 'ORBIT');
fs.mkdirSync(orbitStage, { recursive: true });
copyFiltered(path.join(projectRoot, 'agents/ORBIT/README.md'), path.join(orbitStage, 'README.md'));
copyFiltered(path.join(projectRoot, 'README.md'), path.join(orbitStage, 'PROJECT_README.md'));
const orbitPaths = [
  'client/src/pages/StudyPlanner',
  'server/src/routes/planner.ts',
  'server/src/types'
];
for (const p of orbitPaths) {
  copyFiltered(path.join(projectRoot, p), path.join(orbitStage, p));
}
makeZip('ORBIT_LearnOS', 'ORBIT');

// 4. FORGE_LearnOS.zip
console.log('📦 Building FORGE_LearnOS.zip...');
const forgeStage = path.join(stagingDir, 'FORGE');
fs.mkdirSync(forgeStage, { recursive: true });
copyFiltered(path.join(projectRoot, 'agents/FORGE/README.md'), path.join(forgeStage, 'README.md'));
copyFiltered(path.join(projectRoot, 'README.md'), path.join(forgeStage, 'PROJECT_README.md'));
const forgePaths = [
  'client/src/pages/CodingLab',
  'client/src/pages/SkillDevelopment',
  'server/src/routes/coding.ts',
  'server/src/routes/skills.ts',
  'server/src/services/codeExecutionService.ts',
  'server/src/types'
];
for (const p of forgePaths) {
  copyFiltered(path.join(projectRoot, p), path.join(forgeStage, p));
}
makeZip('FORGE_LearnOS', 'FORGE');

// 5. KERNEL_LearnOS.zip
console.log('📦 Building KERNEL_LearnOS.zip...');
const kernelStage = path.join(stagingDir, 'KERNEL');
fs.mkdirSync(kernelStage, { recursive: true });
copyFiltered(path.join(projectRoot, 'agents/KERNEL/README.md'), path.join(kernelStage, 'README.md'));
copyFiltered(path.join(projectRoot, 'README.md'), path.join(kernelStage, 'PROJECT_README.md'));
copyFiltered(path.join(projectRoot, 'server/src'), path.join(kernelStage, 'server/src'));
copyFiltered(path.join(projectRoot, 'server/package.json'), path.join(kernelStage, 'server/package.json'));
copyFiltered(path.join(projectRoot, 'server/tsconfig.json'), path.join(kernelStage, 'server/tsconfig.json'));
makeZip('KERNEL_LearnOS', 'KERNEL');

// 6. SENTINEL_LearnOS.zip
console.log('📦 Building SENTINEL_LearnOS.zip...');
const sentinelStage = path.join(stagingDir, 'SENTINEL');
fs.mkdirSync(sentinelStage, { recursive: true });
copyFiltered(path.join(projectRoot, 'agents/SENTINEL/README.md'), path.join(sentinelStage, 'README.md'));
copyFiltered(path.join(projectRoot, 'README.md'), path.join(sentinelStage, 'PROJECT_README.md'));
copyFiltered(path.join(projectRoot, 'server/test'), path.join(sentinelStage, 'server/test'));
copyFiltered(path.join(projectRoot, 'server/src/routes/system.ts'), path.join(sentinelStage, 'server/src/routes/system.ts'));
makeZip('SENTINEL_LearnOS', 'SENTINEL');

// 7. LearnOS_Complete_Project.zip (Master Project)
console.log('⭐ Building LearnOS_Complete_Project.zip...');
const masterStage = path.join(stagingDir, 'Master');
fs.mkdirSync(masterStage, { recursive: true });
copyFiltered(projectRoot, masterStage);
makeZip('LearnOS_Complete_Project', 'Master');

// Cleanup
fs.rmSync(stagingDir, { recursive: true, force: true });

console.log('\n🎉 Successfully created all 7 deliverable ZIP packages:');
for (const f of fs.readdirSync(deliverablesDir)) {
  const size = Math.round(fs.statSync(path.join(deliverablesDir, f)).size / 1024);
  console.log(`  - ${f} (${size} KB)`);
}
