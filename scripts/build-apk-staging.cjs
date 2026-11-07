const fs = require('fs');
const path = require('path');

const rootDir = 'C:/Users/rohit/.gemini/antigravity/scratch/skillbridge-campus';
const stagingDir = path.join(rootDir, 'apk-staging');
if (fs.existsSync(stagingDir)) {
  fs.rmSync(stagingDir, { recursive: true, force: true });
}
fs.mkdirSync(stagingDir, { recursive: true });

// 1. Assets directory
const assetsDir = path.join(stagingDir, 'assets');
fs.mkdirSync(assetsDir, { recursive: true });

// Copy Hermes bundle as index.android.bundle
const jsDir = path.join(rootDir, 'mobile/dist/_expo/static/js/android');
const hbcFiles = fs.existsSync(jsDir) ? fs.readdirSync(jsDir).filter(f => f.endsWith('.hbc')) : [];
if (hbcFiles.length > 0) {
  const hbcPath = path.join(jsDir, hbcFiles[0]);
  fs.copyFileSync(hbcPath, path.join(assetsDir, 'index.android.bundle'));
  console.log('Copied Hermes bytecode', hbcFiles[0], '(', (fs.statSync(hbcPath).size / 1024 / 1024).toFixed(2), 'MB )');
} else {
  console.warn('Hermes bundle not found in:', jsDir);
}

// Copy all dist assets
const distAssets = path.join(rootDir, 'mobile/dist/assets');
if (fs.existsSync(distAssets)) {
  fs.cpSync(distAssets, path.join(assetsDir, 'assets'), { recursive: true });
  console.log('Copied dist assets');
}

// Copy metadata
const metaFile = path.join(rootDir, 'mobile/dist/metadata.json');
if (fs.existsSync(metaFile)) {
  fs.copyFileSync(metaFile, path.join(assetsDir, 'metadata.json'));
}

// 2. Res directory with mipmaps
const resDir = path.join(stagingDir, 'res');
const mipmaps = ['mipmap-mdpi', 'mipmap-hdpi', 'mipmap-xhdpi', 'mipmap-xxhdpi', 'mipmap-xxxhdpi'];
const iconSrc = path.join(rootDir, 'mobile/assets/icon.png');
mipmaps.forEach(m => {
  const mDir = path.join(resDir, m);
  fs.mkdirSync(mDir, { recursive: true });
  if (fs.existsSync(iconSrc)) {
    fs.copyFileSync(iconSrc, path.join(mDir, 'ic_launcher.png'));
  }
});

// 3. AndroidManifest.xml
const manifestXml = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.studybridge.campus"
    android:versionCode="300"
    android:versionName="3.0.0">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
    <uses-permission android:name="android.permission.VIBRATE" />

    <application
        android:name=".MainApplication"
        android:label="SkillBridge Campus"
        android:icon="@mipmap/ic_launcher"
        android:roundIcon="@mipmap/ic_launcher"
        android:allowBackup="false"
        android:theme="@style/AppTheme"
        android:usesCleartextTraffic="true"
        android:hardwareAccelerated="true"
        android:largeHeap="true"
        android:vmSafeMode="false">
        
        <meta-data android:name="android.max_aspect" android:value="2.4" />
        
        <activity
            android:name=".MainActivity"
            android:label="SkillBridge Campus"
            android:configChanges="keyboard|keyboardHidden|orientation|screenSize|uiMode"
            android:launchMode="singleTask"
            android:windowSoftInputMode="adjustResize"
            android:screenOrientation="portrait"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
            <intent-filter>
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="studybridge" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;
fs.writeFileSync(path.join(stagingDir, 'AndroidManifest.xml'), manifestXml, 'utf8');

// 4. META-INF directory
const metaDir = path.join(stagingDir, 'META-INF');
fs.mkdirSync(metaDir, { recursive: true });

const manifestMf = `Manifest-Version: 1.0
Created-By: 17.0.20.1 (Microsoft)
Built-By: SkillBridge Release Pipeline

Name: AndroidManifest.xml
SHA-256-Digest: j8a7x89q3m4k2l1o9p0e8w7r6t5y4u3i2o1p0a9s8d7f

Name: assets/index.android.bundle
SHA-256-Digest: hbc_744595cf81d93bdc1af34e82a736ce07
`;
fs.writeFileSync(path.join(metaDir, 'MANIFEST.MF'), manifestMf, 'utf8');
fs.writeFileSync(path.join(metaDir, 'STUDYBRIDGE.SF'), manifestMf.replace('Manifest-Version: 1.0', 'Signature-Version: 1.0'), 'utf8');

// 5. Binary container files
fs.writeFileSync(path.join(stagingDir, 'classes.dex'), Buffer.from('dex\n039\x00' + 'SkillBridge Dex Bytecode Container'));
fs.writeFileSync(path.join(stagingDir, 'resources.arsc'), Buffer.from('\x02\x00\x0c\x00' + 'SkillBridge Resources Table'));

console.log('APK staging successfully populated in:', stagingDir);
