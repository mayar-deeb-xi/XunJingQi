import * as yup from 'yup';
import { SwappableToken } from '~/services/token/useSwappableTokens';

export const formSchema = yup.object().shape({
  fromToken: yup.mixed<SwappableToken>().required('From token is required').label('From Token'),
  toToken: yup.mixed<SwappableToken>().required('To token is required').label('To Token'),
  fromAmount: yup
    .string()
    .required()
    .test('is-positive', 'Amount must be greater than 0', (value) => {
      if (!value) return false;
      const num = parseFloat(value);
      return !isNaN(num) && num > 0;
    })
    .test('is-valid-number', 'Please enter a valid number', (value) => {
      if (!value) return false;
      return !isNaN(parseFloat(value));
    })
    .label('From Amount'),
  toAmount: yup
    .string()
    .required()
    .test('is-positive', 'Amount must be greater than 0', (value) => {
      if (!value) return false;
      const num = parseFloat(value);
      return !isNaN(num) && num > 0;
    })
    .test('is-valid-number', 'Please enter a valid number', (value) => {
      if (!value) return false;
      return !isNaN(parseFloat(value));
    })
    .label('From Amount'),
});

export type FormSchema = yup.InferType<typeof formSchema>;
