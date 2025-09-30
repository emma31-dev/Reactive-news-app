// Preload script to log uncaught exceptions and unhandled rejections
// Required with `node -r ./scripts/preload-errors.js ./node_modules/next/dist/bin/next dev`
process.on('uncaughtException', (err) => {
  try {
    console.error('== UNCAUGHT EXCEPTION ==');
    console.error(err && err.stack ? err.stack : err);
  } catch (e) {
    // swallow
  }
  // keep process alive for Next to show its own diagnostics where possible
});

process.on('unhandledRejection', (reason) => {
  try {
    console.error('== UNHANDLED REJECTION ==');
    console.error(reason && reason.stack ? reason.stack : reason);
  } catch (e) {}
});

// Helpful to signal that preload script loaded
console.error('[preload-errors] handler registered');
