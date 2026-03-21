$files = Get-ChildItem -Path "d:\online auction website" -Filter "*.html"
foreach ($file in $files) {
    if ($file.Name -eq "signup.html") { continue }
    # Also ignore the split.py, update_links.py etc, but the filter "*.html" already does that.
    
    $content = Get-Content -Path $file.FullName -Raw
    
    # We want to replace <a href="login.html" [attrs]>Sign\s*Up</a> with <a href="signup.html" [attrs]>Sign Up</a>
    # The regex matches <a href="login.html" then any non-'>' characters, then >
    # then any whitespace/newline, then Sign, then whitespace/newline, then Up, then anything, then </a>
    $pattern = '(?i)<a\s+href="login\.html"([^>]*?)>\s*Sign\s*Up\s*</a>'
    $replacement = '<a href="signup.html"$1>Sign Up</a>'
    
    $newContent = [regex]::Replace($content, $pattern, $replacement)
    
    # Also handle some buttons in contact.html / services.html that might just have other texts like Register, but let's stick to Sign Up first.
    if ($newContent -cne $content) {
        Write-Host "Updated $($file.Name)"
        Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8
    }
}
