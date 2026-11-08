import os
import sys
import subprocess
import shutil

ROOT_DIR = r"C:\Users\rohit\.gemini\antigravity\scratch\skillbridge-campus"
BUILDER_DIR = os.path.join(ROOT_DIR, "standalone-builder")

JAVA_HOME = r"C:\Program Files\Microsoft\jdk-17.0.20.101-hotspot"
JAVAC = os.path.join(JAVA_HOME, "bin", "javac.exe")
JAR = os.path.join(JAVA_HOME, "bin", "jar.exe")

SDK_ROOT = r"C:\Users\rohit\AppData\Local\Android\Sdk"
BUILD_TOOLS = os.path.join(SDK_ROOT, "build-tools", "35.0.0")
AAPT2 = os.path.join(BUILD_TOOLS, "aapt2.exe")
ZIPALIGN = os.path.join(BUILD_TOOLS, "zipalign.exe")
D8_BAT = os.path.join(BUILD_TOOLS, "d8.bat")
APKSIGNER_BAT = os.path.join(BUILD_TOOLS, "apksigner.bat")
ANDROID_JAR = os.path.join(SDK_ROOT, "platforms", "android-34", "android.jar")

KEYSTORE = os.path.join(BUILDER_DIR, "skillbridge-release.keystore")
KEYSTORE_PASS = "campus123"
KEY_ALIAS = "skillbridge"

PUBLIC_DOWNLOADS_APK = os.path.join(ROOT_DIR, "public", "downloads", "skillbridge-campus-v3.0.0.apk")

def run_cmd(cmd, desc):
    print(f"\n==========================================")
    print(f"STEP: {desc}")
    print(f"COMMAND: {' '.join(cmd) if isinstance(cmd, list) else cmd}")
    print(f"==========================================")
    result = subprocess.run(cmd, cwd=BUILDER_DIR, capture_output=True, text=True, shell=True)
    if result.stdout:
        print(result.stdout.strip())
    if result.stderr:
        print("STDERR:", result.stderr.strip())
    if result.returncode != 0:
        print(f"FAILED (Exit Code {result.returncode})")
        sys.exit(result.returncode)
    print("SUCCESS.")

def main():
    os.chdir(BUILDER_DIR)

    # 1. Clean build directories
    gen_dir = os.path.join(BUILDER_DIR, "gen")
    bin_dir = os.path.join(BUILDER_DIR, "bin")
    for d in [gen_dir, bin_dir]:
        if os.path.exists(d):
            shutil.rmtree(d)
        os.makedirs(d, exist_ok=True)

    compiled_res_zip = os.path.join(BUILDER_DIR, "compiled_res.zip")
    if os.path.exists(compiled_res_zip):
        os.remove(compiled_res_zip)

    unaligned_apk = os.path.join(BUILDER_DIR, "unaligned.apk")
    if os.path.exists(unaligned_apk):
        os.remove(unaligned_apk)

    final_apk = os.path.join(BUILDER_DIR, "skillbridge-campus-v3.0.0.apk")
    if os.path.exists(final_apk):
        os.remove(final_apk)

    # 2. Compile Android resources
    run_cmd(
        f'"{AAPT2}" compile --dir res -o "{compiled_res_zip}"',
        "Compiling Android Resources (aapt2 compile)"
    )

    # 3. Link Android resources and generate R.java
    run_cmd(
        f'"{AAPT2}" link -I "{ANDROID_JAR}" --manifest AndroidManifest.xml -o "{unaligned_apk}" "{compiled_res_zip}" -A assets --java gen',
        "Linking Android Package and Generating R.java (aapt2 link)"
    )

    # 4. Compile Java Sources
    r_java = os.path.join(gen_dir, "com", "studybridge", "campus", "R.java")
    main_java = os.path.join(BUILDER_DIR, "src", "com", "studybridge", "campus", "MainActivity.java")
    run_cmd(
        f'"{JAVAC}" -cp "{ANDROID_JAR}" -d "{bin_dir}" "{r_java}" "{main_java}"',
        "Compiling Java Sources (javac)"
    )

    # 5. Convert Java Class Files to Dalvik Executable (classes.dex)
    classes_list = []
    for root, _, files in os.walk(bin_dir):
        for f in files:
            if f.endswith(".class"):
                classes_list.append(f'"{os.path.join(root, f)}"')
    classes_arg = " ".join(classes_list)

    run_cmd(
        f'cmd.exe /c ""{D8_BAT}" --release --min-api 24 --output "{bin_dir}" {classes_arg}"',
        "Generating Dalvik Bytecode (d8)"
    )

    # 6. Add classes.dex into unaligned.apk
    dex_path = os.path.join(bin_dir, "classes.dex")
    if not os.path.exists(dex_path):
        print(f"Error: classes.dex was not generated in {bin_dir}!")
        sys.exit(1)

    run_cmd(
        f'"{JAR}" uf "{unaligned_apk}" -C "{bin_dir}" classes.dex',
        "Injecting classes.dex into APK container (jar uf)"
    )

    # 7. ZipAlign the APK (4-byte alignment)
    run_cmd(
        f'"{ZIPALIGN}" -p -f 4 "{unaligned_apk}" "{final_apk}"',
        "ZipAligning APK (zipalign -p -f 4)"
    )

    # 8. Sign APK with release keystore (v1, v2, v3 scheme)
    run_cmd(
        f'cmd.exe /c ""{APKSIGNER_BAT}" sign --ks "{KEYSTORE}" --ks-key-alias "{KEY_ALIAS}" --ks-pass pass:{KEYSTORE_PASS} --key-pass pass:{KEYSTORE_PASS} --min-sdk-version 21 --v1-signing-enabled true --v2-signing-enabled true --v3-signing-enabled true "{final_apk}""',
        "Signing APK with v1 + v2 + v3 schemes (apksigner sign)"
    )

    # 9. Verify APK Signature
    run_cmd(
        f'cmd.exe /c ""{APKSIGNER_BAT}" verify --verbose "{final_apk}""',
        "Verifying APK Signature (apksigner verify)"
    )

    # 10. Copy APK to public downloads
    os.makedirs(os.path.dirname(PUBLIC_DOWNLOADS_APK), exist_ok=True)
    shutil.copy2(final_apk, PUBLIC_DOWNLOADS_APK)
    print(f"\nCopied verified APK to: {PUBLIC_DOWNLOADS_APK}")

    # Check file size
    size_bytes = os.path.getsize(final_apk)
    size_mb = size_bytes / (1024 * 1024)
    print("\n==========================================")
    print(f"BUILD SUCCESSFUL!")
    print(f"APK Path: {final_apk}")
    print(f"Public Download Path: {PUBLIC_DOWNLOADS_APK}")
    print(f"APK Size: {size_bytes:,} bytes ({size_mb:.2f} MB)")
    print("==========================================")

if __name__ == "__main__":
    main()
