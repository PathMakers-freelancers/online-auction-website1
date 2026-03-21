$files = Get-ChildItem -Path "d:\online auction website" -Filter "*.html"
foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw
    
    # Matches 'Auction Services' even across newlines
    $pattern = '(?i)Auction\s+Services'
    $replacement = 'Services'
    $newContent = [regex]::Replace($content, $pattern, $replacement)
    
    if ($newContent -cne $content) {
        Write-Host "Updated $($file.Name)"
        Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8
    }
}
