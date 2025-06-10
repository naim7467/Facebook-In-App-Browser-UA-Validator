
        document.getElementById('validateBtn').addEventListener('click', function() {
            const userAgent = document.getElementById('userAgent').value.trim();
            const resultDiv = document.getElementById('result');
            const detailsDiv = document.getElementById('details');
            const detailsContent = document.getElementById('detailsContent');
            
            if (!userAgent) {
                resultDiv.className = 'result invalid';
                resultDiv.textContent = 'Please enter a User Agent string to validate.';
                detailsDiv.style.display = 'none';
                return;
            }
            
            // Reset UI
            resultDiv.className = 'result';
            detailsDiv.style.display = 'none';
            detailsContent.innerHTML = '';
            
            // Validate the User Agent
            const validation = validateFacebookUserAgent(userAgent);
            
            // Display results
            if (validation.isValid) {
                resultDiv.className = 'result valid';
                resultDiv.textContent = '✓ Valid Facebook In-App Browser User Agent';
            } else {
                resultDiv.className = 'result invalid';
                resultDiv.textContent = '✗ Invalid Facebook In-App Browser User Agent';
            }
            
            // Show details
            detailsDiv.style.display = 'block';
            
            // Add validation details
            for (const [key, value] of Object.entries(validation.details)) {
                const item = document.createElement('div');
                item.className = 'detail-item';
                
                const title = document.createElement('div');
                title.className = 'detail-title';
                title.textContent = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) + ':';
                
                const val = document.createElement('div');
                val.className = 'detail-value';
                
                if (typeof value === 'boolean') {
                    val.textContent = value ? '✓ Present' : '✗ Missing';
                    val.style.color = value ? 'var(--success-color)' : 'var(--error-color)';
                } else {
                    val.textContent = value || 'N/A';
                }
                
                item.appendChild(title);
                item.appendChild(val);
                detailsContent.appendChild(item);
            }
        });
        
        function validateFacebookUserAgent(ua) {
            // Common patterns in Facebook In-App Browser user agents
            const fbPatterns = [
                /\[FBAN\/.+\]/,      // Standard Facebook pattern
                /\[FB_IAB\/.+\]/,    // Facebook Instant Articles pattern
                /FBAV\/\d+\.\d+\.\d+\.\d+/ // Facebook App Version
            ];
            
            // Chrome components that should be present
            const chromePatterns = [
                /Chrome\/\d+\.\d+\.\d+\.\d+/,
                /AppleWebKit\/\d+\.\d+/,
                /Mobile Safari\/\d+\.\d+/
            ];
            
            // Android components
            const androidPatterns = [
                /Android \d+/,
                /Linux; Android/
            ];
            
            // Check for Facebook patterns
            const hasFBPrefix = /^Mozilla\/5\.0 \(Linux; Android/.test(ua);
            const hasFBAN = fbPatterns.some(pattern => pattern.test(ua));
            const hasChromeComponents = chromePatterns.every(pattern => pattern.test(ua));
            const hasAndroidComponents = androidPatterns.every(pattern => pattern.test(ua));
            const hasMobileIdentifier = /Mobile|mobile/.test(ua);
            
            // Extract specific components for details
            const fbVersionMatch = ua.match(/FBAV\/([\d\.]+)/);
            const chromeVersionMatch = ua.match(/Chrome\/([\d\.]+)/);
            const androidVersionMatch = ua.match(/Android ([\d\.]+)/);
            const deviceModelMatch = ua.match(/; ([^;)]+) Build\//);
            
            // Determine if valid
            const isValid = hasFBPrefix && hasFBAN && hasChromeComponents && hasAndroidComponents && hasMobileIdentifier;
            
            return {
                isValid,
                details: {
                    fbPrefix: hasFBPrefix,
                    fbIdentifier: hasFBAN,
                    chromeComponents: hasChromeComponents,
                    androidComponents: hasAndroidComponents,
                    mobileIdentifier: hasMobileIdentifier,
                    fbVersion: fbVersionMatch ? fbVersionMatch[1] : false,
                    chromeVersion: chromeVersionMatch ? chromeVersionMatch[1] : false,
                    androidVersion: androidVersionMatch ? androidVersionMatch[1] : false,
                    deviceModel: deviceModelMatch ? deviceModelMatch[1] : false,
                    fullUA: ua
                }
            };
        }
   