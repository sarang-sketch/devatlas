# Kill every node process whose command line references "next" in this project
Get-CimInstance Win32_Process -Filter "Name='node.exe'" |
  Where-Object { $_.CommandLine -like '*next*' -and $_.CommandLine -like '*Free-Tool-And-Roadmap*' } |
  ForEach-Object {
    Write-Output ("Killing PID {0}" -f $_.ProcessId)
    Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
  }
Write-Output "done"
