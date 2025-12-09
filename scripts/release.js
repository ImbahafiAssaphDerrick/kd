const { execSync } = require('child_process');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function release() {
  try {
    // Check for uncommitted changes
    const status = execSync('git status --porcelain').toString();
    if (status) {
      console.error('❌ Error: You have uncommitted changes. Please commit or stash them first.');
      process.exit(1);
    }

    // Get current version
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const currentVersion = packageJson.version;
    console.log(`Current version: ${currentVersion}`);

    // Ask for release type
    const releaseType = await question('Release type (major/minor/patch): ');
    if (!['major', 'minor', 'patch'].includes(releaseType)) {
      console.error('❌ Invalid release type');
      process.exit(1);
    }

    // Bump version
    execSync(`npm run version:${releaseType}`, { stdio: 'inherit' });
    
    // Get new version
    const newPackageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const newVersion = newPackageJson.version;
    console.log(`New version: ${newVersion}`);

    // Confirm release
    const confirm = await question(`Create release v${newVersion}? (yes/no): `);
    if (confirm.toLowerCase() !== 'yes') {
      console.log('Release cancelled');
      process.exit(0);
    }

    // Commit version bump
    execSync('git add package.json package-lock.json', { stdio: 'inherit' });
    execSync(`git commit -m "chore: bump version to ${newVersion}"`, { stdio: 'inherit' });

    // Create and push tag
    execSync(`git tag -a v${newVersion} -m "Release version ${newVersion}"`, { stdio: 'inherit' });
    execSync('git push origin main', { stdio: 'inherit' });
    execSync(`git push origin v${newVersion}`, { stdio: 'inherit' });

    console.log(`✅ Release v${newVersion} created successfully!`);
    console.log(`   - GitHub Release: https://github.com/YOUR_USERNAME/YOUR_REPO/releases/tag/v${newVersion}`);
    console.log(`   - Docker Image: ghcr.io/YOUR_USERNAME/YOUR_REPO:${newVersion}`);

  } catch (error) {
    console.error('❌ Release failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

release();
