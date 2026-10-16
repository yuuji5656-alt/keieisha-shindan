# 朗読動画・Chrome拡張の探索スクリプト（読み取り専用。変更・削除・送信は一切しない）
# 使い方: PowerShell で  powershell -ExecutionPolicy Bypass -File .\朗読探索.ps1
# 結果は デスクトップの「朗読探索結果.txt」 に出る。その中身を貼ってください。

$out = Join-Path ([Environment]::GetFolderPath('Desktop')) '朗読探索結果.txt'
$roots = @($env:USERPROFILE, 'C:\Users') | Select-Object -Unique
$skip = '\\node_modules\\|\\AppData\\Local\\(Temp|Microsoft|Packages|Google\\Chrome\\User Data\\.*\\(Cache|Code Cache|Service Worker))'

function Section($t) { "`r`n===== $t =====" | Out-File $out -Append -Encoding utf8 }
"探索日時: $(Get-Date)" | Out-File $out -Encoding utf8

Section '1. manifest.json（Chrome拡張の候補。新しい順）'
foreach ($r in $roots) {
  Get-ChildItem $r -Recurse -Filter manifest.json -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -notmatch $skip } |
    Sort-Object LastWriteTime -Descending | Select-Object -First 40 |
    ForEach-Object { "$($_.LastWriteTime)  $($_.FullName)" } | Out-File $out -Append -Encoding utf8
}

Section '2. 朗読/TTS/音声/動画っぽいファイル名（新しい順）'
foreach ($r in $roots) {
  Get-ChildItem $r -Recurse -File -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -notmatch $skip -and ($_.Name -match '朗読|読み上げ|tts|narrat|voice|reading' -or $_.Extension -in '.mp3','.wav','.mp4') } |
    Sort-Object LastWriteTime -Descending | Select-Object -First 80 |
    ForEach-Object { "$($_.LastWriteTime)  $([math]::Round($_.Length/1KB))KB  $($_.FullName)" } | Out-File $out -Append -Encoding utf8
}

Section '3. ソース内で texttospeech / speechSynthesis を使っているファイル'
foreach ($r in $roots) {
  Get-ChildItem $r -Recurse -File -Include *.js,*.ts,*.py,*.html,*.json,*.ps1,*.md -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -notmatch $skip -and $_.Length -lt 2MB } |
    Select-String -Pattern 'texttospeech|speechSynthesis|text-to-speech|朗読' -List -ErrorAction SilentlyContinue |
    Select-Object -First 60 | ForEach-Object { $_.Path } | Out-File $out -Append -Encoding utf8
}

Section '4. Chromeに読み込み済みの拡張（Preferencesから、フォルダ読込のもの）'
Get-ChildItem "$env:LOCALAPPDATA\Google\Chrome\User Data" -Directory -ErrorAction SilentlyContinue |
  Where-Object { Test-Path "$($_.FullName)\Preferences" } | ForEach-Object {
    "--- プロファイル: $($_.Name)" | Out-File $out -Append -Encoding utf8
    try {
      $p = Get-Content "$($_.FullName)\Preferences" -Raw -Encoding utf8 | ConvertFrom-Json
      $p.extensions.settings.PSObject.Properties | ForEach-Object {
        $e = $_.Value
        if ($e.path -and $e.location -eq 4) { "$($_.Name)  $($e.manifest.name)  $($e.path)" }
      } | Out-File $out -Append -Encoding utf8
    } catch { '読めなかった' | Out-File $out -Append -Encoding utf8 }
  }

Section '5. ごみ箱の中の該当ファイル'
try {
  $sh = New-Object -ComObject Shell.Application
  $sh.Namespace(10).Items() | Where-Object { $_.Name -match '朗読|tts|manifest|ai-honbu|narrat|\.mp3|\.mp4' } |
    ForEach-Object { "$($_.Name)  $($_.Path)" } | Out-File $out -Append -Encoding utf8
} catch { '確認できず' | Out-File $out -Append -Encoding utf8 }

Section '6. git管理フォルダの未push変更（Documents配下）'
Get-ChildItem "$env:USERPROFILE\Documents" -Recurse -Directory -Filter .git -Force -ErrorAction SilentlyContinue |
  ForEach-Object {
    $d = $_.Parent.FullName
    "--- $d" | Out-File $out -Append -Encoding utf8
    git -C $d status -sb 2>&1 | Select-Object -First 8 | Out-File $out -Append -Encoding utf8
    git -C $d stash list 2>&1 | Out-File $out -Append -Encoding utf8
  }

"`r`n完了。$out を開いて中身を貼ってください。" | Out-File $out -Append -Encoding utf8
Write-Host "完了: $out"
