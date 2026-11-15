param(
    [Parameter(Mandatory=$true)][string]$WindowTitle,
    [Parameter(Mandatory=$true)][string]$BrowserProcess,
    [string]$OutputPath,
    [switch]$Zoom,
    [switch]$ZoomStep
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
Add-Type -TypeDefinition @'
using System;
using System.Runtime.InteropServices;
public static class Task3Window {
  [StructLayout(LayoutKind.Sequential)] public struct RECT { public int Left, Top, Right, Bottom; }
  [DllImport("user32.dll")] public static extern bool ShowWindowAsync(IntPtr window, int command);
  [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr window);
  [DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow();
  [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr window, IntPtr process);
  [DllImport("user32.dll")] public static extern bool AttachThreadInput(uint first, uint second, bool attach);
  [DllImport("kernel32.dll")] public static extern uint GetCurrentThreadId();
  [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr window, out RECT rect);
  [DllImport("user32.dll")] public static extern bool PrintWindow(IntPtr window, IntPtr dc, uint flags);
  [DllImport("user32.dll")] public static extern bool SetProcessDPIAware();
}
'@

$window = @(Get-Process -Name $BrowserProcess -ErrorAction SilentlyContinue | Where-Object {
    $_.MainWindowHandle -ne 0 -and $_.MainWindowTitle.Contains($WindowTitle)
})
if ($window.Count -ne 1) { throw "Expected one Task 3 browser window, found $($window.Count)." }
[void][Task3Window]::SetProcessDPIAware()
$handle = $window[0].MainWindowHandle
[void][Task3Window]::ShowWindowAsync($handle, 3)
if ($Zoom -or $ZoomStep) {
    $foreground=[Task3Window]::GetForegroundWindow()
    $from=[Task3Window]::GetCurrentThreadId()
    $to=[Task3Window]::GetWindowThreadProcessId($foreground,[IntPtr]::Zero)
    $attached=$false
    if($to -ne 0 -and $from -ne $to){$attached=[Task3Window]::AttachThreadInput($from,$to,$true)}
    [void][Task3Window]::SetForegroundWindow($handle)
    if($attached){[void][Task3Window]::AttachThreadInput($from,$to,$false)}
    $shell = New-Object -ComObject WScript.Shell
    for ($attempt=0; $attempt -lt 4 -and [Task3Window]::GetForegroundWindow() -ne $handle; $attempt++) {
        [void]$shell.AppActivate($WindowTitle)
        [void][Task3Window]::SetForegroundWindow($handle)
        Start-Sleep -Milliseconds 350
    }
    if ([Task3Window]::GetForegroundWindow() -ne $handle) { throw 'Task 3 window could not take focus.' }
    if ($Zoom) { [System.Windows.Forms.SendKeys]::SendWait('^0') }
    $steps = if ($ZoomStep) { 1 } else { 5 }
    1..$steps | ForEach-Object { [System.Windows.Forms.SendKeys]::SendWait('^{ADD}'); Start-Sleep -Milliseconds 300 }
    return
}
if (-not $OutputPath) { throw 'Missing output path.' }
Start-Sleep -Milliseconds 400
$rect=New-Object Task3Window+RECT
if(-not [Task3Window]::GetWindowRect($handle,[ref]$rect)){throw 'Cannot read window bounds.'}
$bitmap = New-Object System.Drawing.Bitmap ($rect.Right-$rect.Left), ($rect.Bottom-$rect.Top)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
try {
    $dc=$graphics.GetHdc()
    try { $captured=[Task3Window]::PrintWindow($handle,$dc,2) } finally { $graphics.ReleaseHdc($dc) }
    if(-not $captured){throw 'Windows did not capture the target browser window.'}
    $colors=New-Object 'System.Collections.Generic.HashSet[int]'
    for($y=16;$y -lt $bitmap.Height;$y+=32){
        for($x=16;$x -lt $bitmap.Width;$x+=32){[void]$colors.Add($bitmap.GetPixel($x,$y).ToArgb())}
    }
    if($colors.Count -lt 5){throw 'Target window returned a blank capture.'}
    $bitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
} finally {
    $graphics.Dispose()
    $bitmap.Dispose()
}
