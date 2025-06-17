const axios = require('axios');
const fs = require('fs');
const path = require('path');

class SecurityScanner {
  constructor() {
    this.vulnerabilities = [];
    this.config = {
      snykApiKey: process.env.SNYK_API_KEY,
      owaspZapUrl: process.env.OWASP_ZAP_URL || 'http://localhost:8080',
    };
  }

  async scanWithSnyk() {
    if (!this.config.snykApiKey) {
      console.warn('⚠️  Snyk API key not found. Skipping Snyk scan.');
      return;
    }

    try {
      console.log('🔍 Running Snyk vulnerability scan...');
      
      // Read package.json to get dependencies
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      
      const response = await axios.post(
        'https://api.snyk.io/v1/test/npm',
        {
          encoding: 'plain',
          files: {
            target: {
              contents: JSON.stringify(packageJson)
            }
          }
        },
        {
          headers: {
            'Authorization': `token ${this.config.snykApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.issues && response.data.issues.vulnerabilities) {
        this.vulnerabilities.push(...response.data.issues.vulnerabilities.map(vuln => ({
          source: 'Snyk',
          severity: vuln.severity,
          title: vuln.title,
          package: vuln.package,
          version: vuln.version,
          description: vuln.description,
          remediation: vuln.remediation
        })));
      }

      console.log(`✅ Snyk scan completed. Found ${response.data.issues?.vulnerabilities?.length || 0} vulnerabilities.`);
    } catch (error) {
      console.error('❌ Snyk scan failed:', error.message);
    }
  }

  async scanWithOwaspZap() {
    try {
      console.log('🔍 Running OWASP ZAP scan...');
      
      // Start a new session
      await axios.get(`${this.config.owaspZapUrl}/JSON/core/action/newSession/`);
      
      // Spider the application
      const spiderResponse = await axios.get(
        `${this.config.owaspZapUrl}/JSON/spider/action/scan/`,
        { params: { url: 'http://localhost:5173' } }
      );
      
      const scanId = spiderResponse.data.scan;
      
      // Wait for spider to complete
      let spiderProgress = 0;
      while (spiderProgress < 100) {
        const progressResponse = await axios.get(
          `${this.config.owaspZapUrl}/JSON/spider/view/status/`,
          { params: { scanId } }
        );
        spiderProgress = parseInt(progressResponse.data.status);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Run active scan
      const activeScanResponse = await axios.get(
        `${this.config.owaspZapUrl}/JSON/ascan/action/scan/`,
        { params: { url: 'http://localhost:5173' } }
      );
      
      const activeScanId = activeScanResponse.data.scan;
      
      // Wait for active scan to complete
      let activeScanProgress = 0;
      while (activeScanProgress < 100) {
        const progressResponse = await axios.get(
          `${this.config.owaspZapUrl}/JSON/ascan/view/status/`,
          { params: { scanId: activeScanId } }
        );
        activeScanProgress = parseInt(progressResponse.data.status);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      // Get alerts
      const alertsResponse = await axios.get(
        `${this.config.owaspZapUrl}/JSON/core/view/alerts/`
      );
      
      if (alertsResponse.data.alerts) {
        this.vulnerabilities.push(...alertsResponse.data.alerts.map(alert => ({
          source: 'OWASP ZAP',
          severity: alert.risk,
          title: alert.name,
          url: alert.url,
          description: alert.description,
          solution: alert.solution,
          reference: alert.reference
        })));
      }

      console.log(`✅ OWASP ZAP scan completed. Found ${alertsResponse.data.alerts?.length || 0} alerts.`);
    } catch (error) {
      console.error('❌ OWASP ZAP scan failed:', error.message);
      console.log('💡 Make sure OWASP ZAP is running on http://localhost:8080');
    }
  }

  async runStaticAnalysis() {
    console.log('🔍 Running static security analysis...');
    
    const securityIssues = [];
    const srcDir = path.join(__dirname, '../src');
    
    // Check for common security issues
    const checkFile = (filePath) => {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check for dangerous patterns
      const patterns = [
        {
          regex: /eval\s*\(/g,
          message: 'Use of eval() detected - potential XSS vulnerability',
          severity: 'High'
        },
        {
          regex: /innerHTML\s*=/g,
          message: 'Use of innerHTML detected - potential XSS vulnerability',
          severity: 'Medium'
        },
        {
          regex: /document\.write\s*\(/g,
          message: 'Use of document.write() detected - potential XSS vulnerability',
          severity: 'Medium'
        },
        {
          regex: /window\.location\s*=/g,
          message: 'Direct window.location assignment - potential open redirect',
          severity: 'Medium'
        },
        {
          regex: /localStorage\.setItem\s*\([^,]*,\s*[^)]*password[^)]*\)/gi,
          message: 'Storing password in localStorage - security risk',
          severity: 'High'
        }
      ];
      
      patterns.forEach(pattern => {
        const matches = content.match(pattern.regex);
        if (matches) {
          securityIssues.push({
            source: 'Static Analysis',
            severity: pattern.severity,
            title: pattern.message,
            file: filePath,
            occurrences: matches.length
          });
        }
      });
    };
    
    // Recursively check all files
    const walkDir = (dir) => {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
          walkDir(filePath);
        } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
          checkFile(filePath);
        }
      });
    };
    
    if (fs.existsSync(srcDir)) {
      walkDir(srcDir);
    }
    
    this.vulnerabilities.push(...securityIssues);
    console.log(`✅ Static analysis completed. Found ${securityIssues.length} potential issues.`);
  }

  generateReport() {
    console.log('\n📊 Security Scan Report');
    console.log('========================\n');
    
    if (this.vulnerabilities.length === 0) {
      console.log('✅ No vulnerabilities found!');
      return;
    }
    
    // Group by severity
    const bySeverity = this.vulnerabilities.reduce((acc, vuln) => {
      const severity = vuln.severity.toLowerCase();
      if (!acc[severity]) acc[severity] = [];
      acc[severity].push(vuln);
      return acc;
    }, {});
    
    ['high', 'medium', 'low'].forEach(severity => {
      if (bySeverity[severity]) {
        console.log(`🔴 ${severity.toUpperCase()} SEVERITY (${bySeverity[severity].length})`);
        console.log('─'.repeat(50));
        
        bySeverity[severity].forEach((vuln, index) => {
          console.log(`${index + 1}. ${vuln.title}`);
          console.log(`   Source: ${vuln.source}`);
          if (vuln.package) console.log(`   Package: ${vuln.package}@${vuln.version}`);
          if (vuln.file) console.log(`   File: ${vuln.file}`);
          if (vuln.url) console.log(`   URL: ${vuln.url}`);
          if (vuln.description) console.log(`   Description: ${vuln.description.substring(0, 100)}...`);
          console.log('');
        });
      }
    });
    
    // Save detailed report
    const reportPath = path.join(__dirname, '../security-report.json');
    fs.writeFileSync(reportPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      summary: {
        total: this.vulnerabilities.length,
        high: bySeverity.high?.length || 0,
        medium: bySeverity.medium?.length || 0,
        low: bySeverity.low?.length || 0
      },
      vulnerabilities: this.vulnerabilities
    }, null, 2));
    
    console.log(`📄 Detailed report saved to: ${reportPath}`);
  }

  async run() {
    console.log('🚀 Starting comprehensive security scan...\n');
    
    await this.runStaticAnalysis();
    await this.scanWithSnyk();
    await this.scanWithOwaspZap();
    
    this.generateReport();
    
    // Exit with error code if high severity vulnerabilities found
    const highSeverityCount = this.vulnerabilities.filter(v => 
      v.severity.toLowerCase() === 'high'
    ).length;
    
    if (highSeverityCount > 0) {
      console.log(`\n❌ Found ${highSeverityCount} high severity vulnerabilities!`);
      process.exit(1);
    } else {
      console.log('\n✅ Security scan completed successfully!');
    }
  }
}

// Run the scanner
const scanner = new SecurityScanner();
scanner.run().catch(console.error);