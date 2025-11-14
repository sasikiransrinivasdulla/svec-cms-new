const fs = require('fs');

try {
  const content = fs.readFileSync('.github/workflows/docker-build-push.yml', 'utf8');
  const lines = content.split('\n');
  
  console.log('🔍 Comprehensive GitHub Actions Workflow Validation\n');
  
  let errors = 0;
  let warnings = 0;
  
  // 1. Basic YAML structure validation
  console.log('📋 Basic Structure Checks:');
  
  const requiredSections = {
    'name:': 'Workflow name',
    'on:': 'Trigger events', 
    'jobs:': 'Jobs definition',
    'runs-on:': 'Runner specification',
    'steps:': 'Job steps',
    'uses: actions/checkout': 'Repository checkout'
  };
  
  Object.entries(requiredSections).forEach(([key, desc]) => {
    if (content.includes(key)) {
      console.log(`  ✅ ${desc}`);
    } else {
      console.log(`  ❌ Missing: ${desc}`);
      errors++;
    }
  });
  
  // 2. Check for common YAML issues
  console.log('\n🔧 YAML Syntax Checks:');
  
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    
    // Check for tabs (should use spaces)
    if (line.includes('\t')) {
      console.log(`  ❌ Line ${lineNum}: Contains tabs (use spaces)`);
      errors++;
    }
    
    // Check for inconsistent indentation
    if (line.match(/^[ ]+/) && line.match(/^[ ]+/).input) {
      const spaces = line.match(/^[ ]*/)[0].length;
      if (spaces % 2 !== 0 && line.trim() !== '') {
        console.log(`  ⚠️  Line ${lineNum}: Odd indentation (${spaces} spaces)`);
        warnings++;
      }
    }
    
    // Check for malformed expressions
    if (line.includes('{{') && !line.includes('}}')) {
      console.log(`  ❌ Line ${lineNum}: Unclosed expression`);
      errors++;
    }
    
    // Check for problematic characters
    if (/[^\x00-\x7F]/.test(line) && !line.includes('✅') && !line.includes('❌')) {
      console.log(`  ⚠️  Line ${lineNum}: Contains non-ASCII characters`);
      warnings++;
    }
  });
  
  if (errors === 0 && warnings === 0) {
    console.log('  ✅ All syntax checks passed');
  }
  
  // 3. Check GitHub Actions specific requirements
  console.log('\n🐙 GitHub Actions Validation:');
  
  // Check for secrets usage
  if (content.includes('secrets.DOCKER_USERNAME') && content.includes('secrets.DOCKER_PASSWORD')) {
    console.log('  ✅ Docker Hub secrets configured');
  } else {
    console.log('  ❌ Missing Docker Hub secrets');
    errors++;
  }
  
  // Check for proper action versions
  const actionVersions = {
    'actions/checkout@v4': 'Checkout action (latest)',
    'actions/setup-node@v4': 'Node.js setup (latest)',
    'docker/setup-buildx-action@v3': 'Docker Buildx setup',
    'docker/login-action@v3': 'Docker Hub login',
    'docker/build-push-action@v5': 'Docker build and push'
  };
  
  Object.entries(actionVersions).forEach(([action, desc]) => {
    if (content.includes(action)) {
      console.log(`  ✅ ${desc}`);
    } else {
      console.log(`  ⚠️  Outdated or missing: ${desc}`);
      warnings++;
    }
  });
  
  // 4. Check workflow triggers
  console.log('\n🚀 Trigger Configuration:');
  
  if (content.includes('push:') && content.includes('branches:')) {
    console.log('  ✅ Push triggers configured');
  } else {
    console.log('  ❌ Push triggers missing');
    errors++;
  }
  
  if (content.includes('workflow_dispatch:')) {
    console.log('  ✅ Manual trigger enabled');
  } else {
    console.log('  ⚠️  Manual trigger not configured');
    warnings++;
  }
  
  // 5. Summary
  console.log('\n📊 Validation Summary:');
  console.log(`  Lines: ${lines.length}`);
  console.log(`  Errors: ${errors}`);
  console.log(`  Warnings: ${warnings}`);
  
  if (errors === 0) {
    console.log('\n🎉 Workflow should run successfully!');
    if (warnings > 0) {
      console.log('💡 Consider addressing warnings for better reliability');
    }
  } else {
    console.log('\n⚠️  Please fix errors before running the workflow');
  }
  
} catch (error) {
  console.log('❌ Error reading workflow file:', error.message);
}