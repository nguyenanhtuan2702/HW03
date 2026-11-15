param(
    [ValidateSet('shared', 'dashboard', 'categories', 'coupons')]
    [string]$Group,
    [ValidatePattern('^[SDCP]-\d{2}$')]
    [string[]]$CaseId,
    [switch]$RetryBlocked,
    [switch]$Live
)

$ErrorActionPreference = 'Stop'
if ($Group -and $CaseId) { throw 'Choose either Group or CaseId.' }
if ($Live -and ($Group -or $CaseId -or $RetryBlocked)) { throw 'Live opens a separate manual session.' }
$runner = Join-Path $PSScriptRoot 'run.cjs'
node -e "require.resolve('selenium-webdriver'); require.resolve('playwright/test')" 2>$null
if ($LASTEXITCODE -ne 0) {
    throw 'Set NODE_PATH to the directory containing selenium-webdriver and Playwright.'
}
if (-not $Live -and -not $env:SAUCE_USERNAME) { $env:SAUCE_USERNAME = Read-Host 'Sauce username' }
$temporaryKey = -not $Live -and -not $env:SAUCE_ACCESS_KEY
if ($temporaryKey) {
    $secureKey = Read-Host 'Sauce Access Key' -AsSecureString
    $env:SAUCE_ACCESS_KEY = [System.Net.NetworkCredential]::new('', $secureKey).Password
    $secureKey.Dispose()
}
foreach ($field in @(@('HW03_STUDENT_NAME','Student full name'), @('HW03_STUDENT_ID','Student ID'), @('HW03_STUDENT_EMAIL','Student email'))) {
    if (-not [Environment]::GetEnvironmentVariable($field[0])) {
        [Environment]::SetEnvironmentVariable($field[0], (Read-Host $field[1]))
    }
}
try {
    $flags = @()
    if ($Group) { $flags += "--group=$Group" }
    if ($CaseId) { $flags += $CaseId }
    if ($RetryBlocked) { $flags += '--retry-blocked' }
    $mode = if ($Live) { 'safari-live' } else { 'safari' }
    node $runner $mode @flags
    $suiteExit = $LASTEXITCODE
} finally {
    if ($temporaryKey) { Remove-Item Env:SAUCE_ACCESS_KEY -ErrorAction SilentlyContinue }
}
exit $suiteExit
