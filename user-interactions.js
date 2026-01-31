document.addEventListener('DOMContentLoaded', () => {
    // modal elements
    const newListingBtn = document.getElementById('new-listing-btn');
    const modal = document.getElementById('new-listing-modal');
    const modalCard = document.getElementById('new-listing-modal-card');
    const closeModalBtn = document.getElementById('close-listing-modal-btn');
    const confirmListingBtn = document.getElementById('confirm-new-listing');

    // chat elements
    const chatInput = document.getElementById('chat-input');
    const sendMsgBtn = document.getElementById('send-msg-btn');
    const chatMessages = document.getElementById('chat-messages');

    // invoice/settings elements
    const downloadBtns = document.querySelectorAll('.download-inv-btn');
    const payNowBtn = document.getElementById('pay-now-btn');
    const saveSettingsBtn = document.getElementById('save-user-settings');
    const analyticsRange = document.getElementById('analytics-range');

    // --- Modal Logic ---
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
        document.getElementById('listing-name').value = '';
        document.getElementById('listing-bid').value = '';
    };

    if (newListingBtn) newListingBtn.addEventListener('click', openModal);
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    if (confirmListingBtn) {
        confirmListingBtn.addEventListener('click', () => {
            const name = document.getElementById('listing-name').value;
            if (!name) return alert('Please enter an item name.');

            confirmListingBtn.innerText = 'Listed!';
            confirmListingBtn.style.background = 'var(--success-color)';
            setTimeout(() => {
                confirmListingBtn.innerText = 'List Item';
                confirmListingBtn.style.background = 'var(--primary-color)';
                closeModal();
                alert(`Success! "${name}" has been listed.`);
            }, 1000);
        });
    }

    // --- Messenger Logic ---
    const sendMessage = () => {
        const text = chatInput.value.trim();
        if (!text) return;

        const msgDiv = document.createElement('div');
        msgDiv.style.cssText = `
            align-self: flex-end; 
            background: var(--primary-color); 
            color: white; 
            padding: 0.8rem 1.2rem; 
            border-radius: 15px 15px 0 15px; 
            max-width: 80%; 
            font-size: 0.9rem;
            opacity: 0;
            transform: translateY(10px);
            transition: all 0.3s ease;
        `;
        msgDiv.innerText = text;
        chatMessages.appendChild(msgDiv);

        // Trigger animation
        setTimeout(() => {
            msgDiv.style.opacity = '1';
            msgDiv.style.transform = 'translateY(0)';
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 10);

        chatInput.value = '';

        // Bot Auto-reply
        setTimeout(() => {
            const replyDiv = document.createElement('div');
            replyDiv.style.cssText = `
                align-self: flex-start; 
                background: var(--bg-color); 
                padding: 0.8rem 1.2rem; 
                border-radius: 15px 15px 15px 0; 
                max-width: 80%; 
                font-size: 0.9rem;
                opacity: 0;
                transform: translateY(10px);
                transition: all 0.3s ease;
            `;
            replyDiv.innerText = "I've received your message and will get back to you shortly!";
            chatMessages.appendChild(replyDiv);
            setTimeout(() => {
                replyDiv.style.opacity = '1';
                replyDiv.style.transform = 'translateY(0)';
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 10);
        }, 1500);
    };

    if (sendMsgBtn) sendMsgBtn.addEventListener('click', sendMessage);
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }

    // --- Action Button Logic (Simulation) ---
    downloadBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const originalText = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                    btn.disabled = false;
                    btn.innerHTML = originalText;
                }, 1500);
            }, 1000);
        });
    });

    if (payNowBtn) {
        payNowBtn.addEventListener('click', () => {
            const originalText = payNowBtn.innerText;
            payNowBtn.disabled = true;
            payNowBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            setTimeout(() => {
                payNowBtn.innerHTML = '<i class="fas fa-check"></i> Success!';
                payNowBtn.style.background = 'var(--success-color)';
                setTimeout(() => {
                    payNowBtn.disabled = false;
                    payNowBtn.innerText = originalText;
                    payNowBtn.style.background = 'var(--primary-color)';
                }, 2000);
            }, 1500);
        });
    }

    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', () => {
            const originalText = saveSettingsBtn.innerText;
            saveSettingsBtn.disabled = true;
            saveSettingsBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
            setTimeout(() => {
                saveSettingsBtn.innerHTML = '<i class="fas fa-check"></i> Settings Saved';
                saveSettingsBtn.style.background = 'var(--success-color)';
                setTimeout(() => {
                    saveSettingsBtn.disabled = false;
                    saveSettingsBtn.innerText = originalText;
                    saveSettingsBtn.style.background = 'var(--primary-color)';
                }, 2000);
            }, 1000);
        });
    }

    // --- Analytics Range Logic ---
    if (analyticsRange) {
        analyticsRange.addEventListener('change', (e) => {
            const val = e.target.value;
            // Simulated chart update (jitter existing data)
            if (window.userCharts) {
                Object.values(window.userCharts).forEach(chart => {
                    if (chart && chart.data && chart.data.datasets) {
                        chart.data.datasets.forEach(dataset => {
                            dataset.data = dataset.data.map(d => {
                                if (Array.isArray(d)) return [d[0] * (val / 30), d[1] * (val / 30)];
                                if (typeof d === 'object') return { x: d.x * (val / 30), y: d.y * (val / 30) };
                                return Math.round(d * (val / 30));
                            });
                        });
                        chart.update();
                    }
                });
            }
        });
    }
});
