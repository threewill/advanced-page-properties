param(
  [Parameter(Mandatory = $true)]
  [string]$ProductRepoPath
)

$ErrorActionPreference = "Stop"

function Copy-TextFile($src, $dest) {
  $destDir = Split-Path -Parent $dest
  if (!(Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir -Force | Out-Null }
  Copy-Item -Force $src $dest
}

$standardsRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path

# Canonical SPFx pattern destinations (per product repo)
$twDest = Join-Path $ProductRepoPath "src\\components\\threewill"

Copy-TextFile (Join-Path $standardsRoot "patterns\\ThreeWillFooter\\ThreeWillFooter.tsx") (Join-Path $twDest "ThreeWillFooter.tsx")
Copy-TextFile (Join-Path $standardsRoot "patterns\\ThreeWillFooter\\ThreeWillFooter.module.scss") (Join-Path $twDest "ThreeWillFooter.module.scss")

$logoSrc = Join-Path $standardsRoot "patterns\\ThreeWillFooter\\ThreeWill-headerLogo-onWhite.png"
if (Test-Path $logoSrc) {
  Copy-Item -Force $logoSrc (Join-Path $twDest "ThreeWill-headerLogo-onWhite.png")
} else {
  Write-Warning "Missing canonical logo: $logoSrc - add ThreeWill-headerLogo-onWhite.png to patterns/ThreeWillFooter in threewill-engineering-standards."
}

$assetTypesSrc = Join-Path $standardsRoot "templates\\spfx-asset-modules.d.ts"
$typesDir = Join-Path $ProductRepoPath "src\\types"
$assetTypesDest = Join-Path $typesDir "spfx-asset-modules.d.ts"
if (Test-Path $assetTypesSrc) {
  if (!(Test-Path $typesDir)) { New-Item -ItemType Directory -Path $typesDir -Force | Out-Null }
  if (!(Test-Path $assetTypesDest)) {
    Copy-Item -Force $assetTypesSrc $assetTypesDest
    Write-Host "Added TypeScript image module declarations: $assetTypesDest"
  } else {
    Write-Host "Skipped spfx-asset-modules.d.ts (already exists): $assetTypesDest"
  }
}

Write-Host "Synced SPFx patterns into: $ProductRepoPath"

