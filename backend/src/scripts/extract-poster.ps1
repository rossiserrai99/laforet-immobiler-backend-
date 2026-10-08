param(
    [string]$ZipPath = "C:\Users\pc\Downloads\_MConverter.eu_Video Project (1).zip",
    [string]$OutputPath = "C:\Users\pc\Desktop\website REALESTATE la foret\backend\src\scripts\hero_video_poster.png"
)

Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead($ZipPath)
$entry = $zip.Entries | Where-Object { $_.FullName -eq '00001.png' }
if ($entry) {
    if (Test-Path $OutputPath) { Remove-Item $OutputPath }
    [System.IO.Compression.ZipFileExtensions]::ExtractToFile($entry, $OutputPath)
    Write-Host "Extracted successfully: $((Get-Item $OutputPath).Length) bytes"
} else {
    Write-Error "00001.png not found in zip"
}
$zip.Dispose()
