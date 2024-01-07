const buildPayloadResponse = (
  payload: { code: string; message: string },
  data?: any
) => ({
  code: payload.code,
  message: payload.message,
  isotime: new Date(),
  ...(data && { data: data })
});

export default buildPayloadResponse;
