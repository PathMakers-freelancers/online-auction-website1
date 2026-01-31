document.addEventListener('DOMContentLoaded', () => {
    const exportBtn = document.getElementById('export-products-btn');
    const addProductBtn = document.getElementById('add-product-btn');
    const modal = document.getElementById('add-product-modal');
    const modalCard = document.getElementById('add-product-modal-card');
    const closeModalBtn = document.getElementById('close-product-modal-btn');
    const confirmAddBtn = document.getElementById('confirm-add-product');
    const productsGrid = document.getElementById('products-grid');

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
        document.getElementById('new-product-name').value = '';
        document.getElementById('new-product-price').value = '';
        document.getElementById('new-product-stock').value = '100';
    };

    // Event Listeners
    addProductBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Export Logic
    exportBtn.addEventListener('click', () => {
        const products = [];
        const cards = productsGrid.querySelectorAll('.card');

        cards.forEach(card => {
            const name = card.querySelector('h4').innerText;
            const price = card.querySelector('span[style*="font-weight: 700"]').innerText;
            const category = card.querySelector('span[style*="text-transform: uppercase"]').innerText;
            const stock = card.querySelector('div[style*="justify-content: space-between"] span:last-child').innerText;
            products.push({ name, price, category, stock });
        });

        // Generate CSV
        const headers = ['Product Name', 'Price', 'Category', 'Stock Level'];
        const csvRows = [headers.join(',')];

        products.forEach(p => {
            csvRows.push(`"${p.name}","${p.price}","${p.category}","${p.stock}"`);
        });

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', 'admin_products_inventory.csv');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Feedback
        const originalText = exportBtn.innerText;
        exportBtn.innerHTML = '<i class="fas fa-check"></i> Exported';
        setTimeout(() => exportBtn.innerText = originalText, 2000);
    });

    // Add Product Logic
    confirmAddBtn.addEventListener('click', () => {
        const name = document.getElementById('new-product-name').value.trim();
        const price = document.getElementById('new-product-price').value.trim();
        const category = document.getElementById('new-product-category').value;
        const stock = document.getElementById('new-product-stock').value;

        if (!name || !price) {
            alert('Please enter product name and price.');
            return;
        }

        // Icon based on category
        let icon = 'fas fa-cube';
        let gradient = 'linear-gradient(135deg, rgba(67, 97, 238, 0.1), rgba(76, 201, 240, 0.1))';
        let iconColor = 'var(--primary-color)';
        let progressColor = 'var(--success-color)';

        if (category === 'Software') {
            icon = 'fas fa-laptop-code';
            gradient = 'linear-gradient(135deg, rgba(67, 97, 238, 0.1), rgba(76, 201, 240, 0.1))';
            iconColor = 'var(--primary-color)';
        } else if (category === 'Hardware') {
            icon = 'fas fa-microchip';
            gradient = 'linear-gradient(135deg, rgba(247, 37, 133, 0.1), rgba(114, 9, 183, 0.1))';
            iconColor = 'var(--accent-color)';
        } else if (category === 'Cloud') {
            icon = 'fas fa-satellite-dish';
            gradient = 'linear-gradient(135deg, rgba(76, 201, 240, 0.1), rgba(67, 97, 238, 0.1))';
            iconColor = 'var(--success-color)';
        }

        if (parseInt(stock) < 20) progressColor = 'var(--danger-color)';
        else if (parseInt(stock) < 50) progressColor = 'var(--warning-color)';

        const newCard = document.createElement('div');
        newCard.className = 'card';
        newCard.style.cssText = 'background: var(--card-bg); border-radius: 15px; border: 2px solid var(--primary-color); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3), 0 0 15px rgba(212, 175, 55, 0.1); overflow: hidden; opacity: 0; transform: translateY(20px); transition: all 0.5s ease;';

        newCard.innerHTML = `
            <div style="height: 180px; background: ${gradient}; display: flex; align-items: center; justify-content: center; font-size: 3rem; color: ${iconColor};">
                <i class="${icon}"></i>
            </div>
            <div style="padding: 1.5rem;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span style="font-size: 0.75rem; font-weight: 700; color: var(--accent-color); text-transform: uppercase;">${category}</span>
                    <span style="font-weight: 700; color: var(--text-body);">${price.startsWith('$') ? price : '$' + price}</span>
                </div>
                <h4 style="margin: 0 0 1rem 0;">${name}</h4>
                <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.5rem;">
                    <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--text-muted);">
                        <span>${category === 'Cloud' ? 'Capacity' : 'Stock Levels'}</span>
                        <span>${stock}%</span>
                    </div>
                    <div style="height: 6px; background: rgba(0,0,0,0.1); border-radius: 3px; overflow: hidden;">
                        <div style="width: ${stock}%; height: 100%; background: ${progressColor};"></div>
                    </div>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <button style="flex: 1; padding: 0.5rem; border: 1px solid var(--border-color); border-radius: 8px; background: transparent; color: var(--text-body); cursor: pointer;"><i class="fas fa-edit"></i> Edit</button>
                    <button style="padding: 0.5rem 0.8rem; border: 1px solid var(--border-color); border-radius: 8px; background: transparent; color: var(--text-muted); cursor: pointer;"><i class="fas fa-ellipsis-v"></i></button>
                </div>
            </div>
        `;

        productsGrid.prepend(newCard);

        setTimeout(() => {
            newCard.style.opacity = '1';
            newCard.style.transform = 'translateY(0)';
        }, 50);

        confirmAddBtn.innerText = 'Created!';
        confirmAddBtn.style.background = 'var(--success-color)';
        setTimeout(() => {
            confirmAddBtn.innerText = 'Create Product';
            confirmAddBtn.style.background = 'var(--primary-color)';
            closeModal();
        }, 1000);
    });
});
