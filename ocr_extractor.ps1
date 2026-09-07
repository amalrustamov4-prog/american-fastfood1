[Windows.Globalization.Language,Windows.Foundation.UniversalApiContract,ContentType=WindowsRuntime] | Out-Null
[Windows.Media.Ocr.OcrEngine,Windows.Foundation.UniversalApiContract,ContentType=WindowsRuntime] | Out-Null
[Windows.Graphics.Imaging.BitmapDecoder,Windows.Foundation.UniversalApiContract,ContentType=WindowsRuntime] | Out-Null
[Windows.Storage.StorageFile,Windows.Foundation.UniversalApiContract,ContentType=WindowsRuntime] | Out-Null

$engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages()
if ($null -eq $engine) {
    $engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromLanguage([Windows.Globalization.Language]::new('ru'))
}
if ($null -eq $engine) {
    $engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromLanguage([Windows.Globalization.Language]::new('en-US'))
}

$files = Get-ChildItem "new_menu_raw\*.jpg" | Sort-Object Name
$results = @()

foreach ($f in $files) {
    try {
        $file = [Windows.Storage.StorageFile]::GetFileFromPathAsync($f.FullName).GetAwaiter().GetResult()
        $stream = $file.OpenAsync([Windows.Storage.FileAccessMode]::Read).GetAwaiter().GetResult()
        $decoder = [Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream).GetAwaiter().GetResult()
        $bitmap = $decoder.GetSoftwareBitmapAsync().GetAwaiter().GetResult()
        $ocrResult = $engine.RecognizeAsync($bitmap).GetAwaiter().GetResult()
        $results += [PSCustomObject]@{
            Name = $f.Name
            Text = $ocrResult.Text
        }
    } catch {
        $results += [PSCustomObject]@{
            Name = $f.Name
            Error = $_.Exception.Message
        }
    }
}

$results | ConvertTo-Json -Depth 3 | Out-File -FilePath "ocr_menu_results.json" -Encoding utf8
Write-Output "OCR finished! Processed: $($results.Count)"
