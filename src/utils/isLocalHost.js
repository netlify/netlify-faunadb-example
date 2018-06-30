
export default function isLocalHost() {
  const isLocalhostName = window.location.hostname === 'localhost';
  const isLocalhostIPv6 = window.location.hostname === '[::1]';
  const isLocalhostIPv4 = window.location.hostname.match(
    // 127.0.0.1/8
    /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
  );

  return isLocalhostName || isLocalhostIPv6 || isLocalhostIPv4;
}
