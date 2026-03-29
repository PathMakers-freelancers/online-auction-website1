$files = Get-ChildItem -Path "d:\online auction website" -Filter "*.html"
foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw
    
    $pattern = '(?s)<div class="flex flex-col items-center gap-2">\s*<span class="text-slate-500 text-sm uppercase tracking-widest">Home</span>\s*<a href="index\.html" class="mobile-link hover:text-indigo-400 text-lg transition-colors">Home 1</a>\s*<a href="index-2\.html" class="mobile-link hover:text-indigo-400 text-lg transition-colors">Home 2</a>\s*</div>'
    
    $replacement = @'
<div class="flex flex-col items-center gap-2 w-full">
                <button onclick="toggleMobileDropdown('home-mobile-dropdown', 'home-mobile-dropdown-icon')" class="flex items-center gap-2 text-slate-500 text-sm uppercase tracking-widest hover:text-indigo-400 transition-colors">
                    Home <i data-lucide="chevron-down" class="w-4 h-4 transition-transform duration-300" id="home-mobile-dropdown-icon"></i>
                </button>
                <div id="home-mobile-dropdown" class="flex flex-col items-center gap-3 overflow-hidden transition-all duration-300 max-h-0 opacity-0">
                    <a href="index.html" class="mobile-link hover:text-indigo-400 text-lg transition-colors mt-2">Home 1</a>
                    <a href="index-2.html" class="mobile-link hover:text-indigo-400 text-lg transition-colors">Home 2</a>
                </div>
            </div>
'@

    $newContent = [regex]::Replace($content, $pattern, $replacement)
    
    if ($newContent -cne $content) {
        Write-Host "Updated $($file.Name)"
        Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8
    }
}
