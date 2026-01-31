document.addEventListener('DOMContentLoaded', () => {
    const addUserBtn = document.getElementById('add-user-btn');
    const modal = document.getElementById('add-user-modal');
    const modalCard = document.getElementById('add-user-modal-card');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const confirmAddBtn = document.getElementById('confirm-add-user');
    const userTableBody = document.getElementById('user-table-body');

    // Modal Functions
    const openModal = () => {
        modal.style.display = 'flex';
        setTimeout(() => {
            modalCard.style.opacity = '1';
            modalCard.style.transform = 'scale(1)';
        }, 10);
    };

    const closeModal = () => {
        modalCard.style.opacity = '0';
        modalCard.style.transform = 'scale(0.9)';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);

        // Clear inputs
        document.getElementById('new-user-name').value = '';
        document.getElementById('new-user-email').value = '';
        document.getElementById('new-user-role').value = 'Member';
    };

    // Event Listeners
    addUserBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);

    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Add User Logic
    confirmAddBtn.addEventListener('click', () => {
        const name = document.getElementById('new-user-name').value.trim();
        const email = document.getElementById('new-user-email').value.trim();
        const role = document.getElementById('new-user-role').value;

        if (!name || !email) {
            alert('Please fill in all fields.');
            return;
        }

        // Get Initials
        const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

        // Define Gradient based on role
        let gradient = 'linear-gradient(135deg, #4cc9f0, #4895ef)'; // Default Member
        if (role === 'Super Admin') gradient = 'linear-gradient(135deg, #4361ee, #4cc9f0)';
        if (role === 'Editor') gradient = 'linear-gradient(135deg, #f72585, #7209b7)';

        // Create New Row
        const newRow = document.createElement('tr');
        newRow.style.borderBottom = '1px solid var(--border-color)';
        newRow.style.opacity = '0';
        newRow.style.transform = 'translateY(20px)';
        newRow.style.transition = 'all 0.5s ease';

        newRow.innerHTML = `
            <td style="padding: 1rem 1.5rem; display: flex; align-items: center; gap: 1rem;">
                <div style="width: 40px; height: 40px; border-radius: 50%; background: ${gradient}; display: flex; align-items: center; justify-content: center; color: white;">
                    ${initials}
                </div>
                <div>
                    <div style="font-weight: 600;">${name}</div>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">${email}</div>
                </div>
            </td>
            <td style="padding: 1rem 1.5rem;">
                <span style="background: ${role === 'Super Admin' ? 'rgba(67, 97, 238, 0.1)' : role === 'Editor' ? 'rgba(247, 37, 133, 0.1)' : 'rgba(76, 201, 240, 0.1)'}; 
                             color: ${role === 'Super Admin' ? 'var(--primary-color)' : role === 'Editor' ? 'var(--accent-color)' : 'var(--success-color)'}; 
                             padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.75rem; font-weight: 600;">
                    ${role}
                </span>
            </td>
            <td style="padding: 1rem 1.5rem;">
                <span style="color: var(--success-color); font-size: 0.85rem;">
                    <i class="fas fa-circle" style="font-size: 0.5rem; margin-right: 0.5rem;"></i> Active
                </span>
            </td>
            <td style="padding: 1rem 1.5rem; color: var(--text-muted);">
                ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </td>
            <td style="padding: 1rem 1.5rem; text-align: right;">
                <button style="background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 0.5rem;"><i class="fas fa-edit"></i></button>
                <button class="delete-user-btn" style="background: none; border: none; color: var(--danger-color); cursor: pointer; padding: 0.5rem;"><i class="fas fa-trash"></i></button>
            </td>
        `;

        // Prepend to body
        userTableBody.prepend(newRow);

        // Animate Entry
        setTimeout(() => {
            newRow.style.opacity = '1';
            newRow.style.transform = 'translateY(0)';
        }, 50);

        // Success Feedback on the Add Button
        const originalText = confirmAddBtn.innerText;
        confirmAddBtn.innerText = 'User Added!';
        confirmAddBtn.style.background = 'var(--success-color)';

        setTimeout(() => {
            confirmAddBtn.innerText = originalText;
            confirmAddBtn.style.background = 'var(--primary-color)';
            closeModal();
        }, 1000);
    });
});
