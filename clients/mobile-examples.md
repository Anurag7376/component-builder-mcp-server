# Mobile Device Usage Examples

## 📱 React Native Integration

### Installation
```bash
npm install axios  # or use fetch directly
```

### React Native Component
```javascript
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';

const ComponentGeneratorScreen = () => {
  const [componentName, setComponentName] = useState('');
  const [componentType, setComponentType] = useState('button');
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);

  const API_BASE = 'https://your-app-name.railway.app';

  const generateComponent = async () => {
    if (!componentName.trim()) {
      Alert.alert('Error', 'Please enter a component name');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/generate-component`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: componentName,
          type: componentType,
          variant: 'default',
          description: `A ${componentType} component for mobile app`
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setGeneratedCode(result.data.code);
        Alert.alert('Success', 'Component generated successfully!');
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      Alert.alert('Network Error', 'Could not connect to the server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Component Generator
      </Text>
      
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          marginBottom: 10,
          borderRadius: 5
        }}
        placeholder="Component Name (e.g., MyButton)"
        value={componentName}
        onChangeText={setComponentName}
      />
      
      <TouchableOpacity
        style={{
          backgroundColor: loading ? '#ccc' : '#007AFF',
          padding: 15,
          borderRadius: 5,
          alignItems: 'center',
          marginBottom: 20
        }}
        onPress={generateComponent}
        disabled={loading}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>
          {loading ? 'Generating...' : 'Generate Component'}
        </Text>
      </TouchableOpacity>
      
      {generatedCode ? (
        <View>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
            Generated Code:
          </Text>
          <ScrollView 
            style={{
              backgroundColor: '#f5f5f5',
              padding: 10,
              borderRadius: 5,
              maxHeight: 300
            }}
          >
            <Text style={{ fontFamily: 'monospace', fontSize: 12 }}>
              {generatedCode}
            </Text>
          </ScrollView>
        </View>
      ) : null}
    </ScrollView>
  );
};

export default ComponentGeneratorScreen;
```

## 🌐 Progressive Web App (PWA)

### HTML Interface
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Component Builder Mobile</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        input, select, textarea {
            width: 100%;
            padding: 12px;
            margin: 10px 0;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 16px;
        }
        button {
            width: 100%;
            padding: 15px;
            background: #007AFF;
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
        }
        button:disabled {
            background: #ccc;
            cursor: not-allowed;
        }
        .code-output {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 5px;
            padding: 15px;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 12px;
            overflow-x: auto;
            white-space: pre-wrap;
            max-height: 400px;
            overflow-y: auto;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔧 Component Builder</h1>
        
        <form id="componentForm">
            <input 
                type="text" 
                id="componentName" 
                placeholder="Component Name (e.g., MyButton)"
                required
            >
            
            <select id="componentType">
                <option value="button">Button</option>
                <option value="input">Input</option>
                <option value="card">Card</option>
                <option value="modal">Modal</option>
            </select>
            
            <input 
                type="text" 
                id="description" 
                placeholder="Description (optional)"
            >
            
            <button type="submit" id="generateBtn">
                Generate Component
            </button>
        </form>
        
        <div id="output" style="display: none;">
            <h3>Generated Component:</h3>
            <div id="codeOutput" class="code-output"></div>
            <button onclick="copyToClipboard()" style="margin-top: 10px;">
                📋 Copy Code
            </button>
        </div>
    </div>

    <script>
        const API_BASE = 'https://your-app-name.railway.app';
        let generatedCode = '';

        document.getElementById('componentForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('componentName').value;
            const type = document.getElementById('componentType').value;
            const description = document.getElementById('description').value;
            const btn = document.getElementById('generateBtn');
            
            btn.disabled = true;
            btn.textContent = 'Generating...';
            
            try {
                const response = await fetch(`${API_BASE}/api/generate-component`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name,
                        type,
                        variant: 'default',
                        description: description || `A ${type} component`
                    })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    generatedCode = result.data.code;
                    document.getElementById('codeOutput').textContent = generatedCode;
                    document.getElementById('output').style.display = 'block';
                } else {
                    alert('Error: ' + result.error);
                }
            } catch (error) {
                alert('Network error: Could not connect to server');
            } finally {
                btn.disabled = false;
                btn.textContent = 'Generate Component';
            }
        });

        async function copyToClipboard() {
            try {
                await navigator.clipboard.writeText(generatedCode);
                alert('Code copied to clipboard!');
            } catch (err) {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = generatedCode;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                alert('Code copied to clipboard!');
            }
        }
    </script>
</body>
</html>
```

## 📋 HTTP Client App Configuration

### iOS HTTP Client App
1. Download **HTTP Client** from App Store
2. Create new request with these settings:
   - **Method**: POST
   - **URL**: `https://your-app-name.railway.app/api/generate-component`
   - **Headers**: 
     ```
     Content-Type: application/json
     ```
   - **Body**:
     ```json
     {
       "name": "MobileButton",
       "type": "button",
       "variant": "primary",
       "description": "A button for mobile app"
     }
     ```

### Android REST Client
1. Download **HTTP Request** from Play Store
2. Set up POST request:
   - **URL**: `https://your-app-name.railway.app/api/generate-component`
   - **Method**: POST
   - **Content-Type**: application/json
   - **Request Body**:
     ```json
     {
       "name": "AppCard",
       "type": "card", 
       "variant": "elevated",
       "description": "Card component for mobile"
     }
     ```

## 🔧 Quick Mobile Testing

### Using Mobile Browser
1. Open mobile browser
2. Go to: `https://your-app-name.railway.app/health`
3. Should see: `{"status":"healthy",...}`
4. Go to: `https://your-app-name.railway.app/api/component-types`
5. Should see list of available component types

### Using cURL on Terminal Apps
For iOS/Android terminal apps:
```bash
curl -X POST https://your-app-name.railway.app/api/generate-component \
  -H "Content-Type: application/json" \
  -d '{"name":"QuickButton","type":"button","variant":"default"}'
```

## 💡 Mobile Tips

1. **Bookmark the API**: Save the health endpoint in browser bookmarks
2. **Create Shortcuts**: Use iOS Shortcuts or Android Tasker to create quick API calls
3. **Offline Caching**: Cache generated components locally for offline use
4. **Share Results**: Use device sharing to send generated code to development machine
5. **Team Collaboration**: Share the PWA link with team members for easy access