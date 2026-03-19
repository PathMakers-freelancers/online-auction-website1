import os
import glob
import re

html_files = glob.glob("d:/online auction website/*.html")

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We replace <a href="login.html"...>Sign Up</a> with signup.html
    # We need to match <a href="login.html" [any classes/attributes]>Sign Up</a>
    # Note: text might be "Sign\n                Up"
    
    # We can use a regex that looks for href="login.html" followed by some attributes, then ">Sign\s*Up</a>"
    # Actually, a safer way:
    # 1. Split by <a href="login.html"
    # 2. Check if the text before </a> is "Sign\s*Up"
    
    def replacer(match):
        attrs = match.group(1)
        text = match.group(2)
        if re.search(r'Sign\s*Up', text, flags=re.IGNORECASE):
            return f'<a href="signup.html"{attrs}>{text}</a>'
        return match.group(0)
    
    new_content = re.sub(r'<a href="login\.html"([^>]*?)>(.*?)</a>', replacer, content, flags=re.DOTALL)
    
    if new_content != content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated links in {os.path.basename(file)}")
