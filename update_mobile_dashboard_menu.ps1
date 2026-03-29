$files = Get-ChildItem -Path "d:\online auction website" -Filter "*.html"
foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw
    
    # We use (?s) for dotall mode so `.*` matches newlines, or better just use a regex that matches variations of whitespaces.
    $pattern = '(?s)<div class="flex flex-col items-center gap-2">\s*<span class="text-slate-500 text-sm uppercase tracking-widest">Dashboard</span>\s*<a href="user-dashboard\.html" class="mobile-link hover:text-indigo-400 text-lg transition-colors">\s*User\s*Dashboard</a>\s*<a href="admin-dashboard\.html" class="mobile-link hover:text-indigo-400 text-lg transition-colors">\s*Admin\s*Dashboard</a>\s*</div>'
    
    $replacement = @'
<div class="flex flex-col items-center gap-2 w-full">
                <button onclick="toggleMobileDropdown('dashboard-mobile-dropdown', 'dashboard-mobile-dropdown-icon')" class="flex items-center gap-2 text-slate-500 text-sm uppercase tracking-widest hover:text-indigo-400 transition-colors">
                    Dashboard <i data-lucide="chevron-down" class="w-4 h-4 transition-transform duration-300" id="dashboard-mobile-dropdown-icon"></i>
                </button>
                <div id="dashboard-mobile-dropdown" class="flex flex-col items-center gap-3 overflow-hidden transition-all duration-300 max-h-0 opacity-0">
                    <a href="user-dashboard.html" class="mobile-link hover:text-indigo-400 text-lg transition-colors mt-2">User Dashboard</a>
                    <a href="admin-dashboard.html" class="mobile-link hover:text-indigo-400 text-lg transition-colors">Admin Dashboard</a>
                </div>
            </div>
'@

    $newContent = [regex]::Replace($content, $pattern, $replacement)
    
    if ($newContent -cne $content) {
        Write-Host "Updated $($file.Name)"
        Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8
    }
}
