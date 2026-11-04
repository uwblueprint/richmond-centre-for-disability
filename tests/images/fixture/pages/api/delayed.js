export default async function delayed(_req, res) {
  await new Promise(resolve => setTimeout(resolve, 50));
  res.status(404).send('Synthetic delayed missing image');
}
