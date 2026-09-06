(function () {
  'use strict';

  const copyButtons = document.querySelectorAll('[data-copy-target]');

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.setAttribute('readonly', '');
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    const copied = document.execCommand('copy');
    document.body.removeChild(textArea);
    if (!copied) throw new Error('Copy command failed');
  }

  copyButtons.forEach((button) => {
    const originalLabel = button.textContent;

    button.addEventListener('click', async () => {
      const target = document.getElementById(button.dataset.copyTarget);
      const status = document.getElementById(button.dataset.statusTarget);
      if (!target || !status) return;

      try {
        await copyText(target.innerText.trim());
        button.textContent = 'Copied';
        status.textContent = 'Prompt copied to your clipboard. Replace anything in [brackets] before you send it.';
        window.setTimeout(() => {
          button.textContent = originalLabel;
          status.textContent = '';
        }, 4000);
      } catch (error) {
        status.textContent = 'Copy did not work in this browser. Select the prompt text and copy it manually.';
      }
    });
  });
}());
