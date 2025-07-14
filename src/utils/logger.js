import axios from 'axios';

export const Log = async (stack, level, pkg, message, data = {}) => {
  try {
    const payload = {
      stack: stack.toLowerCase(),
      level: level.toLowerCase(),
      package: pkg.toLowerCase(),
      message: `${message}${Object.keys(data).length ? ` | ${JSON.stringify(data)}` : ''}`
    };

    const response = await axios.post(
      'http://20.244.56.144/evaluation-service/logs',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer evaluation-token'
        },
        timeout: 5000
      }
    );

    if (!response.data.success) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};