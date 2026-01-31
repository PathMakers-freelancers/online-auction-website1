document.addEventListener('DOMContentLoaded', () => {
    const saveBtn = document.getElementById('save-settings');
    const resetBtn = document.getElementById('reset-settings');
    const toggles = document.querySelectorAll('.toggle-switch');

    // Default values for reset
    const defaults = {
        'site-title': 'BidNexus',
        'admin-email': 'admin@bidnexus.com',
        'site-description': 'A modern, colorful, and responsive dashboard for managing your digital ecosystem.',
        'toggle-maintenance': true,
        'toggle-autoupdate': false
    };

    // Toggle logic
    toggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const isActive = toggle.classList.toggle('active');
            const circle = toggle.querySelector('.toggle-circle');

            if (isActive) {
                toggle.style.background = 'var(--primary-color)';
                circle.style.right = '3px';
                circle.style.left = 'auto';
            } else {
                toggle.style.background = '#ccc';
                circle.style.left = '3px';
                circle.style.right = 'auto';
            }
        });
    });

    // Save logic
    saveBtn.addEventListener('click', async () => {
        const originalContent = saveBtn.innerHTML;

        // Show loading state
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        saveBtn.style.opacity = '0.8';

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Show success state
        saveBtn.innerHTML = '<i class="fas fa-check"></i> Saved!';
        saveBtn.style.background = 'var(--success-color)';

        // Reset button after 2 seconds
        setTimeout(() => {
            saveBtn.disabled = false;
            saveBtn.innerHTML = originalContent;
            saveBtn.style.background = 'var(--primary-color)';
            saveBtn.style.opacity = '1';
        }, 2000);
    });

    // Reset logic
    resetBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all settings to defaults?')) {
            document.getElementById('site-title').value = defaults['site-title'];
            document.getElementById('admin-email').value = defaults['admin-email'];
            document.getElementById('site-description').value = defaults['site-description'];

            // Reset toggles
            toggles.forEach(toggle => {
                const id = toggle.id;
                const shouldBeActive = defaults[id];
                const circle = toggle.querySelector('.toggle-circle');

                if (shouldBeActive) {
                    toggle.classList.add('active');
                    toggle.style.background = 'var(--primary-color)';
                    circle.style.right = '3px';
                    circle.style.left = 'auto';
                } else {
                    toggle.classList.remove('active');
                    toggle.style.background = '#ccc';
                    circle.style.left = '3px';
                    circle.style.right = 'auto';
                }
            });

            // Brief flash of success
            const originalText = resetBtn.innerText;
            resetBtn.innerText = 'Reset Done!';
            setTimeout(() => resetBtn.innerText = originalText, 1500);
        }
    });
});
