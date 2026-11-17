param(
  [Parameter(Mandatory=$true)]
  [string]$SolutionPath,

  [Parameter(Mandatory=$true)]
  [string]$StandardsRepoUrl,

  [Parameter(Mandatory=$false)]
  [string]$SolutionName,

  [Parameter(Mandatory=$false)]
  [string]$SpfxGeneratorTag = "latest"
)

$ErrorActionPreference = "Stop"

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

function Initialize-SolutionDirectory($path) {
  if (!(Test-Path $path)) {
    New-Item -ItemType Directory -Path $path -Force | Out-Null
    return
  }
  $items = Get-ChildItem -Path $path -Force
  if ($items.Count -gt 0) {
    throw "SolutionPath must be empty or not exist: $path"
  }
}

function Initialize-GitRepository($path) {
  if (!(Test-Path (Join-Path $path ".git"))) {
    Run $path "git init"
  }
}

function Initialize-StandardsSubmodule($path, $standardsUrl) {
  $rulesPath = Join-Path $path ".cursor\\rules"
  $cursorPath = Join-Path $path ".cursor"
  if (!(Test-Path $cursorPath)) {
    New-Item -ItemType Directory -Path $cursorPath -Force | Out-Null
  }

  if (Test-Path (Join-Path $rulesPath ".git")) {
    Write-Host "Standards submodule already present at .cursor/rules"
    return
  }

  if (Test-Path $rulesPath) {
    $items = Get-ChildItem -Path $rulesPath -Force
    if ($items.Count -gt 0) {
      throw "Path exists and is not empty: $rulesPath"
    }
    Remove-Item -Path $rulesPath -Force
  }

  Write-Host "Adding standards submodule at .cursor/rules ..."
  Run $path "git submodule add `"$standardsUrl`" `".cursor/rules`""
  Run $path "git submodule update --init --recursive"
}

function Write-Nvmrc($path, $nodeMajor) {
  $nvmrc = Join-Path $path ".nvmrc"
  Set-Content -Path $nvmrc -Value "v$nodeMajor" -Encoding UTF8
  Write-Host "Wrote .nvmrc => v$nodeMajor"
}

function Write-NextSteps($path) {
  Write-Host ""
  Write-Host "Next steps:"
  Write-Host "1) In your own terminal: switch Node to match SPFx (e.g. v22 for SPFx 1.22.x) using nvm or your tool of choice. Agents should not run nvm in Cursor."
  Write-Host "2) Open the repo in Cursor"
  Write-Host "3) Tell the agent: starting a new SPFx solution (blank web part, latest SPFx)"
  Write-Host "4) Follow the bootstrap checklist from .cursor/rules"
  Write-Host ""
  Write-Host "Repo path: $path"
}

Initialize-SolutionDirectory $SolutionPath
Initialize-GitRepository $SolutionPath
Initialize-StandardsSubmodule $SolutionPath $StandardsRepoUrl

if ([string]::IsNullOrWhiteSpace($SolutionName)) {
  $SolutionName = Split-Path -Leaf $SolutionPath
}

# Baseline: SPFx 1.22.x uses Node.js v22 (LTS) per Microsoft compatibility matrix.
# The agent/rules should still derive exact requirements from the matrix, but this file gives a safe default.
Write-Nvmrc $SolutionPath 22

Write-Host ""
Write-Host "Optional (manual) scaffold step:"
Write-Host "- Install generator: npm i -g @microsoft/generator-sharepoint@$SpfxGeneratorTag"
Write-Host "- Scaffold SPFx in this folder using the generator prompts"

Write-NextSteps $SolutionPath

