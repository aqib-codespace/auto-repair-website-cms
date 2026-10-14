import "server-only";

const seen = new Set();

/**
 * Logs a configuration problem once per process instead of on every request.
 *
 * A misconfigured deploy renders the same page hundreds of times a minute; one
 * clear line per distinct problem is readable, five hundred identical ones bury
 * everything else in the log.
 */
export function reportOnce(key, message) {
  if (seen.has(key)) return;
  seen.add(key);
  console.error(message);
}
