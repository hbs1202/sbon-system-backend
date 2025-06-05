import crypto from 'crypto';

const serviceId = process.env.SMS_SERVICE_ID || '';
const accessKey = process.env.SMS_ACCESS_KEY || '';
const secretKey = process.env.SMS_SECRET_KEY || '';
const phoneNumber = process.env.SMS_PHONE_NUMBER || '';

// SMS 설정 검증
if (!serviceId || !accessKey || !secretKey || !phoneNumber) {
  console.error('SMS 설정 누락:', {
    serviceId: serviceId ? '설정됨' : '누락',
    accessKey: accessKey ? '설정됨' : '누락',
    secretKey: secretKey ? '설정됨' : '누락',
    phoneNumber: phoneNumber ? '설정됨' : '누락'
  });
}

const makeSignature = (timestamp: string) => {
  const space = " ";
  const newLine = "\n";
  const method = "POST";
  const url = `/sms/v2/services/${serviceId}/messages`;
  const message = [
    method,
    space,
    url,
    newLine,
    timestamp,
    newLine,
    accessKey,
  ].join("");

  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(message)
    .digest("base64");

  return signature;
};

export const sendSMS = async (content: string) => {
  const timestamp = Date.now().toString();
  const signature = makeSignature(timestamp);

  const headers = {
    "Content-Type": "application/json",
    "x-ncp-apigw-timestamp": timestamp,
    "x-ncp-iam-access-key": accessKey,
    "x-ncp-apigw-signature-v2": signature,
  };

  const body = {
    type: "SMS",
    from: phoneNumber,
    content: content,
    messages: [
      {
        to: "01022656886",
      },
    ],
  };

  try {
    const response = await fetch(
      `https://sens.apigw.ntruss.com/sms/v2/services/${serviceId}/messages`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      throw new Error(`SMS 전송 실패: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("SMS 전송 중 오류 발생:", error);
    throw error;
  }
}; 