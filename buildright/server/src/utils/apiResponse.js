// Identical response envelope across all 12 portfolio apps:
//   success → { success: true, data, message? }
//   failure → { success: false, message, errors: [] }

const ok = (res, data = null, message = '', status = 200) =>
  res.status(status).json({
    success: true,
    data,
    ...(message ? { message } : {}),
  });

const fail = (res, message = 'Something went wrong', status = 500, errors = []) =>
  res.status(status).json({ success: false, message, errors });

module.exports = { ok, fail };
