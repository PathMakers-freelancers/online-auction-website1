import os

file_path = "d:/online auction website/login.html"
signup_path = "d:/online auction website/signup.html"

with open(file_path, "r", encoding="utf-8") as f:
    original_html = f.read()

# For login.html: We need to remove signup hero background, signup hero content, signup form, signupForm listener, and toggleAuthMode
login_html = original_html

# Left Side substitutions
login_bg_match = '<div class="absolute inset-0 z-0 transition-opacity duration-700 opacity-100" id="hero-bg-login">'
login_bg_replace = '<div class="absolute inset-0 z-0" id="hero-bg-login">'
login_html = login_html.replace(login_bg_match, login_bg_replace)

login_content_match = '<div class="absolute inset-0 flex flex-col items-center justify-center p-20 z-10 w-full h-full transition-all duration-700 transform translate-y-0 opacity-100" id="hero-content-login">'
login_content_replace = '<div class="absolute inset-0 flex flex-col items-center justify-center p-20 z-10 w-full h-full" id="hero-content-login">'
login_html = login_html.replace(login_content_match, login_content_replace)

import re

# Remove signup bg
login_html = re.sub(r'<div class="absolute inset-0 z-0 transition-opacity duration-700 opacity-0" id="hero-bg-signup">.*?</div>\n\s*<!-- Login Content -->', '<!-- Login Content -->', login_html, flags=re.DOTALL)

# Remove signup hero content
login_html = re.sub(r'<!-- Signup Content -->.*?<!-- Floating Cyber Lines -->', '<!-- Floating Cyber Lines -->', login_html, flags=re.DOTALL)

# Right Side substitutions
# The form container should not be toggleable
form_container_match = '<div id="login-form-container"\n                        class="glass-v2 p-8 sm:p-10 rounded-[2.5rem] border border-white/10 shadow-2xl relative z-20 backdrop-blur-3xl transition-all duration-500 opacity-100 scale-100">'
form_container_replace = '<div id="login-form-container"\n                        class="glass-v2 p-8 sm:p-10 rounded-[2.5rem] border border-white/10 shadow-2xl relative z-20 backdrop-blur-3xl">'
login_html = login_html.replace(form_container_match, form_container_replace)

# Change "Request Invitation" button to a link
login_html = re.sub(r'<button onclick="toggleAuthMode\(\)"\n.*?class="(.*?)">Request\n\s*Invitation</button>', r'<a href="signup.html" class="\1">Request Invitation</a>', login_html, flags=re.DOTALL)

# Remove signup form container
login_html = re.sub(r'<!-- Sign Up Form \(Shifted via JS\) -->.*?</div>\n\s*</div>\n\s*</div>\n\s*</main>', '</div>\n            </div>\n    </main>', login_html, flags=re.DOTALL)

# Remove toggleAuthMode from script
login_html = re.sub(r'// Toggle between Login and Sign Up.*?function toggleAuthMode.*?} // end toggle auth if necessary, actually we just match till next comment', '', login_html, flags=re.DOTALL)
# Actually better to just match specifically:
login_html = re.sub(r'// Toggle between Login and Sign Up.*?lucide\.createIcons\(\);\n\s*}', '', login_html, flags=re.DOTALL)

# Remove signupForm event listener
login_html = re.sub(r'document\.getElementById\(\'signupForm\'\)\.addEventListener.*?}\);', '', login_html, flags=re.DOTALL)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(login_html)


# For signup.html: We keep signup hero, signup form.
signup_html = original_html
signup_html = signup_html.replace("<title>Login | LuxeBid</title>", "<title>Sign Up | LuxeBid</title>")

# Left Side
signup_bg_match = '<div class="absolute inset-0 z-0 transition-opacity duration-700 opacity-0" id="hero-bg-signup">'
signup_bg_replace = '<div class="absolute inset-0 z-0" id="hero-bg-signup">'
signup_html = signup_html.replace(signup_bg_match, signup_bg_replace)

signup_content_match = '<div class="absolute inset-0 flex flex-col items-center justify-center p-20 z-10 w-full h-full transition-all duration-700 transform translate-y-8 opacity-0 pointer-events-none" id="hero-content-signup">'
signup_content_replace = '<div class="absolute inset-0 flex flex-col items-center justify-center p-20 z-10 w-full h-full" id="hero-content-signup">'
signup_html = signup_html.replace(signup_content_match, signup_content_replace)

# Remove login bg and login content
signup_html = re.sub(r'<div class="absolute inset-0 z-0 transition-opacity duration-700 opacity-100" id="hero-bg-login">.*?</div>\n\s*<div class="absolute', '<div class="absolute', signup_html, flags=re.DOTALL)
signup_html = re.sub(r'<!-- Login Content -->.*?<!-- Signup Content -->', '<!-- Signup Content -->', signup_html, flags=re.DOTALL)

# Right Side
form_container_match = '<div id="signup-form-container"\n                        class="glass-v2 p-8 sm:p-10 rounded-[2.5rem] border border-white/10 shadow-2xl absolute inset-0 z-10 backdrop-blur-3xl transition-all duration-500 opacity-0 pointer-events-none scale-95">'
form_container_replace = '<div id="signup-form-container"\n                        class="glass-v2 p-8 sm:p-10 rounded-[2.5rem] border border-white/10 shadow-2xl relative z-20 backdrop-blur-3xl">'
signup_html = signup_html.replace(form_container_match, form_container_replace)

# Change "Enter Vault" button to a link
signup_html = re.sub(r'<button onclick="toggleAuthMode\(\)"\n.*?class="(.*?)">Enter\n\s*Vault</button>', r'<a href="login.html" class="\1">Enter Vault</a>', signup_html, flags=re.DOTALL)

# Remove login form container
signup_html = re.sub(r'<div id="login-form-container".*?<!-- Sign Up Form \(Shifted via JS\) -->', '<!-- Sign Up Form -->', signup_html, flags=re.DOTALL)

# Remove toggleAuthMode from script
signup_html = re.sub(r'// Toggle between Login and Sign Up.*?lucide\.createIcons\(\);\n\s*}', '', signup_html, flags=re.DOTALL)

# Remove loginForm event listener
signup_html = re.sub(r'document\.getElementById\(\'loginForm\'\)\.addEventListener.*?}\);', '', signup_html, flags=re.DOTALL)

with open(signup_path, "w", encoding="utf-8") as f:
    f.write(signup_html)
