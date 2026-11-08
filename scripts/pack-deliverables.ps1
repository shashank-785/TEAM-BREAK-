# ====================================================================
# LearnOS Autonomous Deliverable Packaging Script
# Generates isolated agent ZIPs and master integrated ZIP
# Excludes node_modules, dist, and .env
# ====================================================================

$ProjectRoot = Resolve-Path "$PSScriptRoot\.."
$OutputDir = "$ProjectRoot\deliverables"

if (Test-Path $OutputDir) {
    Remove-Item -Recurse -Force $OutputDir
}
New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null

$TempStaging = "$ProjectRoot\temp_staging"
if (Test-Path $TempStaging) {
    Remove-Item -Recurse -Force $TempStaging
}

Write-Host "📦 Packaging LearnOS Deliverables into $OutputDir..."

# Helper function to stage and zip
function Create-AgentZip {
    param (
        [string]$ZipName,
        [string]$AgentFolder,
        [string[]]$IncludePaths
    )

    $Stage = "$TempStaging\$ZipName"
    New-Item -ItemType Directory -Force -Path $Stage | Out-Null

    # Copy Agent README
    if (Test-Path "$ProjectRoot\agents\$AgentFolder\README.md") {
        Copy-Item "$ProjectRoot\agents\$AgentFolder\README.md" "$Stage\README.md"
    }

    # Copy project README for setup context
    Copy-Item "$ProjectRoot\README.md" "$Stage\PROJECT_README.md"

    # Copy source folders
    foreach ($path in $IncludePaths) {
        $src = "$ProjectRoot\$path"
        if (Test-Path $src) {
            $dest = "$Stage\$path"
            $destDir = Split-Path $dest
            New-Item -ItemType Directory -Force -Path $destDir | Out-Null
            Copy-Item -Recurse -Force $src $dest
        }
    }

    # Clean excluded items
    Get-ChildItem -Recurse -Path $Stage | Where-Object { 
        $_.PSIsContainer -and ($_.Name -eq "node_modules" -or $_.Name -eq "dist" -or $_.Name -eq ".git") 
    } | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue

    Get-ChildItem -Recurse -Path $Stage | Where-Object { 
        !$_.PSIsContainer -and ($_.Name -eq ".env" -or $_.Name -like "*.log") 
    } | Remove-Item -Force -ErrorAction SilentlyContinue

    # Archive
    $TargetZip = "$OutputDir\$ZipName.zip"
    Compress-Archive -Path "$Stage\*" -DestinationPath $TargetZip -Force
    Write-Host "  ✅ Generated: $ZipName.zip ($(Get-Item $TargetZip | Select-Object -ExpandProperty Length) bytes)"
}

# 1. ATLAS_LearnOS.zip
Create-AgentZip -ZipName "ATLAS_LearnOS" -AgentFolder "ATLAS" -IncludePaths @(
    "client\src\components",
    "client\src\pages\Dashboard",
    "client\src\pages\AIAssistant",
    "client\src\pages\Analytics",
    "client\src\pages\ProfileSettings",
    "client\src\App.tsx",
    "client\src\main.tsx",
    "client\src\types",
    "client\src\services",
    "client\package.json",
    "client\tsconfig.json",
    "client\vite.config.ts",
    "client\tailwind.config.js"
)

# 2. NOVA_LearnOS.zip
Create-AgentZip -ZipName "NOVA_LearnOS" -AgentFolder "NOVA" -IncludePaths @(
    "client\src\pages\CollegeTutor",
    "client\src\pages\Notes",
    "client\src\pages\ExamCentre",
    "server\src\routes\tutor.ts",
    "server\src\routes\notes.ts",
    "server\src\routes\exams.ts",
    "server\src\types"
)

# 3. ORBIT_LearnOS.zip
Create-AgentZip -ZipName "ORBIT_LearnOS" -AgentFolder "ORBIT" -IncludePaths @(
    "client\src\pages\StudyPlanner",
    "server\src\routes\planner.ts",
    "server\src\types"
)

# 4. FORGE_LearnOS.zip
Create-AgentZip -ZipName "FORGE_LearnOS" -AgentFolder "FORGE" -IncludePaths @(
    "client\src\pages\CodingLab",
    "client\src\pages\SkillDevelopment",
    "server\src\routes\coding.ts",
    "server\src\routes\skills.ts",
    "server\src\services\codeExecutionService.ts",
    "server\src\types"
)

# 5. KERNEL_LearnOS.zip
Create-AgentZip -ZipName "KERNEL_LearnOS" -AgentFolder "KERNEL" -IncludePaths @(
    "server\src",
    "server\package.json",
    "server\tsconfig.json"
)

# 6. SENTINEL_LearnOS.zip
Create-AgentZip -ZipName "SENTINEL_LearnOS" -AgentFolder "SENTINEL" -IncludePaths @(
    "server\test",
    "server\src\routes\system.ts"
)

# 7. LearnOS_Complete_Project.zip (Master Integrated Solution)
$StageMaster = "$TempStaging\LearnOS_Complete_Project"
New-Item -ItemType Directory -Force -Path $StageMaster | Out-Null

$AllItems = Get-ChildItem -Path $ProjectRoot | Where-Object { 
    $_.Name -ne "node_modules" -and 
    $_.Name -ne "dist" -and 
    $_.Name -ne ".git" -and 
    $_.Name -ne "temp_staging" -and 
    $_.Name -ne "deliverables" -and 
    $_.Name -ne ".env" 
}

foreach ($item in $AllItems) {
    Copy-Item -Recurse -Force $item.FullName "$StageMaster\"
}

# Clean any nested node_modules or dist in client/server
Get-ChildItem -Recurse -Path $StageMaster | Where-Object { 
    $_.PSIsContainer -and ($_.Name -eq "node_modules" -or $_.Name -eq "dist") 
} | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue

$MasterZip = "$OutputDir\LearnOS_Complete_Project.zip"
Compress-Archive -Path "$StageMaster\*" -DestinationPath $MasterZip -Force
Write-Host "  ⭐ Generated Master Archive: LearnOS_Complete_Project.zip ($(Get-Item $MasterZip | Select-Object -ExpandProperty Length) bytes)"

# Also copy all ZIPs to root for convenience
Get-ChildItem -Path $OutputDir -Filter "*.zip" | ForEach-Object {
    Copy-Item $_.FullName "$ProjectRoot\$($_.Name)" -Force
}

# Cleanup staging
Remove-Item -Recurse -Force $TempStaging -ErrorAction SilentlyContinue

Write-Host "🎉 All 7 ZIP deliverables generated and verified successfully!"
