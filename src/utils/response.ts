const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*'
};

export const successResponse = (data: unknown, statusCode = 200) => ({
  statusCode,
  headers,
  body: JSON.stringify({ success: true, data })
});

export const errorResponse = (code: string, message: string, statusCode = 500) => ({
  statusCode,
  headers,
  body: JSON.stringify({ success: false, error: { code, message } })
});
