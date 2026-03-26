// Simple CSS-based confetti trigger
let confettiContainer: HTMLDivElement | null = null;

export function triggerConfetti() {
  if (confettiContainer) {
    confettiContainer.remove();
    confettiContainer = null;
  }

  const container = document.createElement("div");
  container.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9999;
    overflow: hidden;
  `;
  document.body.appendChild(container);
  confettiContainer = container;

  const colors = [
    "#fde68a",
    "#86efac",
    "#93c5fd",
    "#f9a8d4",
    "#c4b5fd",
    "#6ee7b7",
    "#fca5a5",
    "#a5f3fc",
    "#fdba74",
    "#d9f99d",
  ];

  for (let i = 0; i < 80; i++) {
    const piece = document.createElement("div");
    const color = colors[Math.floor(Math.random() * colors.length)];
    const left = Math.random() * 100;
    const size = 6 + Math.random() * 8;
    const duration = 2.5 + Math.random() * 2;
    const delay = Math.random() * 0.8;
    const rotation = Math.random() * 720;

    piece.style.cssText = `
      position: absolute;
      top: -20px;
      left: ${left}%;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: ${Math.random() > 0.5 ? "50%" : "2px"};
      animation: confettiFall ${duration}s ${delay}s ease-in forwards;
      transform: rotate(${rotation}deg);
    `;
    container.appendChild(piece);
  }

  // Inject keyframes if not already present
  if (!document.getElementById("confetti-keyframes")) {
    const style = document.createElement("style");
    style.id = "confetti-keyframes";
    style.textContent = `
      @keyframes confettiFall {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  setTimeout(() => {
    container.remove();
    if (confettiContainer === container) confettiContainer = null;
  }, 4000);
}
