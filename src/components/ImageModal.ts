// Simple image zoom modal. No dependencies.
// Usage:
//   const modal = new ImageModal();
//   modal.open('https://example.com/big.jpg', 'Optional alt text');
//   modal.close();

export class ImageModal {
    private overlay: HTMLDivElement;
    private img: HTMLImageElement;
    private onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') this.close();
    };

    constructor() {
        this.overlay = document.createElement('div');
        Object.assign(this.overlay.style, {
            position: 'fixed',
            inset: '0',
            background: 'rgba(0,0,0,0.8)',
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '2147483647',
        } as Partial<CSSStyleDeclaration>);

        this.img = document.createElement('img');
        Object.assign(this.img.style, {
            maxWidth: '90vw',
            maxHeight: '90vh',
            objectFit: 'contain',
            boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
        } as Partial<CSSStyleDeclaration>);

        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.textContent = '✕';
        closeBtn.setAttribute('aria-label', 'Close');
        Object.assign(closeBtn.style, {
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '40px',
            height: '40px',
            border: 'none',
            borderRadius: '50%',
            background: '#fff',
            color: '#000',
            fontSize: '20px',
            cursor: 'pointer',
        } as Partial<CSSStyleDeclaration>);
        closeBtn.addEventListener('click', () => this.close());

        // Click on the dark backdrop (not the image) also closes.
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) this.close();
        });

        this.overlay.append(this.img, closeBtn);
        document.body.appendChild(this.overlay);
    }

    open(src: string, alt = ''): void {
        this.img.src = src;
        this.img.alt = alt;
        this.overlay.style.display = 'flex';
        document.addEventListener('keydown', this.onKey);
    }

    close(): void {
        this.overlay.style.display = 'none';
        this.img.removeAttribute('src');
        document.removeEventListener('keydown', this.onKey);
    }

    destroy(): void {
        this.close();
        this.overlay.remove();
    }
}
