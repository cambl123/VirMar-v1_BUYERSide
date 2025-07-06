import jwt from 'jsonwebtoken';
import 'dotenv/config';

const token = jwt.sign({ foo: 'bar' }, process.env.JWT_SECRET_SELLER, { expiresIn: '1d' });
console.log('Token:', token);

jwt.verify(token, process.env.JWT_SECRET_SELLER, (err, decoded) => {
  if (err) {
    console.error('Verify error:', err);
  } else {
    console.log('Decoded:', decoded);
  }
});




