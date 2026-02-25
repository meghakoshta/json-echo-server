module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  return res.status(200).json({
    status: 'ok',
    maxPayloadSize: '15MB',
    endpoint: '/api/echo',
    timestamp: new Date().toISOString()
  });
};
