// ==UserScript==
// @name         Auto-Click Save Button with Draggable Control Panel
// @namespace    http://tampermonkey.net/
// @version      2.4
// @match        https://map-making.app/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let isRunning = false;
    let animationFrameId = null;

    const panel = document.createElement('div');
    panel.style.position = 'fixed';
    panel.style.top = '20px';
    panel.style.left = '50%';
    panel.style.transform = 'translateX(-50%)';
    panel.style.zIndex = '999999';
    panel.style.backgroundColor = 'rgba(30, 30, 30, 0.9)';
    panel.style.color = '#fff';
    panel.style.padding = '12px 16px';
    panel.style.borderRadius = '10px';
    panel.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
    panel.style.fontFamily = 'system-ui, sans-serif';
    panel.style.fontSize = '14px';
    panel.style.display = 'flex';
    panel.style.flexDirection = 'column';
    panel.style.gap = '10px';
    panel.style.userSelect = 'none';
    panel.style.cursor = 'move';

    const title = document.createElement('div');
    title.innerText = '🗺️ Turbo Auto-Clicker';
    title.style.fontWeight = 'bold';
    title.style.marginBottom = '2px';
    panel.appendChild(title);

    const statusText = document.createElement('div');
    statusText.innerText = 'Status: Stopped';
    statusText.style.fontSize = '12px';
    statusText.style.color = '#aaa';
    panel.appendChild(statusText);

    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '8px';

    const startButton = document.createElement('button');
    startButton.innerText = 'Start';
    startButton.style.backgroundColor = '#10B981';
    startButton.style.color = 'white';
    startButton.style.border = 'none';
    startButton.style.padding = '6px 12px';
    startButton.style.borderRadius = '6px';
    startButton.style.cursor = 'pointer';
    startButton.style.fontWeight = 'bold';

    const stopButton = document.createElement('button');
    stopButton.innerText = 'Stop';
    stopButton.style.backgroundColor = '#EF4444';
    stopButton.style.color = 'white';
    stopButton.style.border = 'none';
    stopButton.style.padding = '6px 12px';
    stopButton.style.borderRadius = '6px';
    stopButton.style.fontWeight = 'bold';
    stopButton.style.opacity = '0.6';
    stopButton.style.cursor = 'not-allowed';

    buttonContainer.appendChild(startButton);
    buttonContainer.appendChild(stopButton);
    panel.appendChild(buttonContainer);

    document.body.appendChild(panel);

    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    panel.addEventListener('mousedown', (e) => {
        if (e.target.tagName.toLowerCase() === 'button') return;

        isDragging = true;

        const rect = panel.getBoundingClientRect();
        panel.style.transform = 'none';
        panel.style.left = rect.left + 'px';
        panel.style.top = rect.top + 'px';

        startX = e.clientX;
        startY = e.clientY;
        initialLeft = rect.left;
        initialTop = rect.top;

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    function onMouseMove(e) {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        panel.style.left = `${initialLeft + dx}px`;
        panel.style.top = `${initialTop + dy}px`;
    }

    function onMouseUp() {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }

    function turboLoop() {
        if (!isRunning) return;

        const saveButton = document.querySelector('button[data-qa="location-save"].button--primary');
        if (saveButton) {
            saveButton.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            saveButton.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
            saveButton.click();
        }

        animationFrameId = requestAnimationFrame(turboLoop);
    }

    startButton.addEventListener('click', () => {
        if (isRunning) return;
        isRunning = true;

        statusText.innerText = 'Status: Running...';
        statusText.style.color = '#34D399';

        startButton.style.opacity = '0.6';
        startButton.style.cursor = 'not-allowed';
        stopButton.style.opacity = '1';
        stopButton.style.cursor = 'pointer';

        turboLoop();
        console.log('[TurboAutoClicker] Started.');
    });

    stopButton.addEventListener('click', () => {
        if (!isRunning) return;
        isRunning = false;

        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }

        statusText.innerText = 'Status: Stopped';
        statusText.style.color = '#aaa';

        stopButton.style.opacity = '0.6';
        stopButton.style.cursor = 'not-allowed';
        startButton.style.opacity = '1';
        startButton.style.cursor = 'pointer';

        console.log('[TurboAutoClicker] Stopped.');
    });

    console.log('[TurboAutoClicker] Draggable control panel loaded.');
})();
