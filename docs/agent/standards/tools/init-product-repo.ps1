param(
  [Parameter(Mandatory=$true)]
  [string]$ProductRepoPath,

  [Parameter(Mandatory=$true)]
  [string]$StandardsRepoUrl,

  [Parameter(Mandatory=$false)]
  [switch]$BackupExistingRules
)

$ErrorActionPreference = "Stop"

function Assert-Repo($path) {
  if (!(Test-Path $path)) { throw "Path not found: $path" }
  if (!(Test-Path (Join-Path $path ".git"))) { throw "Not a git repository: $path" }
}

function Run($path, $cmd) {
  Push-Location $path
  try {
    & powershell -NoProfile -Command $cmd
    if ($LASTEXITCODE -ne 0) {
      throw "Command failed (exit $LASTEXITCODE): $cmd"
    }
  }
  finally { Pop-Location }
}

Assert-Repo $ProductRepoPath

$cursorDir = Join-Path $ProductRepoPath ".cursor"
if (!(Test-Path $cursorDir)) {
  New-Item -ItemType Directory -Path $cursorDir -Force | Out-Null
}

$rulesPath = Join-Path $ProductRepoPath ".cursor\\rules"

if (Test-Path $rulesPath) {
  Write-Host "Found existing .cursor/rules path: $rulesPath"
  if (Test-Path (Join-Path $rulesPath ".git")) {
    Write-Host "Standards submodule already present at .cursor/rules"
  } else {
    $items = @(Get-ChildItem -Path $rulesPath -Force)
    if ($items.Count -gt 0) {
      if (-not $BackupExistingRules) {
        throw "'.cursor/rules' exists but is not a submodule. Rename or remove it, or re-run with -BackupExistingRules to move it to .cursor/rules.pre-threewill-backup-<timestamp>."
      }
      $stamp = Get-Date -Format "yyyyMMdd-HHmmss"
      $newLeaf = "rules.pre-threewill-backup-$stamp"
      Write-Host "Backing up existing .cursor/rules to .cursor/$newLeaf ..."
      Rename-Item -Path $rulesPath -NewName $newLeaf
    } else {
      Remove-Item -Path $rulesPath -Force -Recurse
    }
  }
}

if (!(Test-Path (Join-Path $rulesPath ".git"))) {
  Write-Host "Adding standards submodule at .cursor/rules ..."
  Run $ProductRepoPath "git submodule add `"$StandardsRepoUrl`" `".cursor/rules`""
}

Write-Host "Initializing submodules ..."
Run $ProductRepoPath "git submodule update --init --recursive"

$readmePath = Join-Path $ProductRepoPath "README.md"
$snippetPath = Join-Path $PSScriptRoot "..\\templates\\README.prerequisites.snippet.md"

if (Test-Path $readmePath -and Test-Path $snippetPath) {
  $readme = Get-Content $readmePath -Raw
  $snippet = Get-Content $snippetPath -Raw

  $start = "<!-- TW:PREREQS:START -->"
  $end = "<!-- TW:PREREQS:END -->"

  if ($readme -match [regex]::Escape($start) -and $readme -match [regex]::Escape($end)) {
    $pattern = [regex]::Escape($start) + "[\\s\\S]*?" + [regex]::Escape($end)
    $updated = [regex]::Replace($readme, $pattern, $snippet.Trim())
  } else {
    $updated = ($readme.TrimEnd() + "`r`n`r`n" + $snippet.Trim() + "`r`n")
  }

  Set-Content -Path $readmePath -Value $updated -Encoding UTF8
  Write-Host "Updated README prerequisites block."
} else {
  Write-Host "README.md not found or snippet missing; skipping README update."
}

Write-Host "Done. Next: commit the submodule pointer + README changes in the product repo."
Write-Host "Tip: add root AGENTS.md for product-only Cursor context (see threewill-engineering-standards README)."
