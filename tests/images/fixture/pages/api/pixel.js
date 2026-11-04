export default function pixel(_req, res) {
  res.setHeader('Content-Type', 'image/png');
  res.end(
    Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a/1sAAAAASUVORK5CYII=',
      'base64'
    )
  );
}
