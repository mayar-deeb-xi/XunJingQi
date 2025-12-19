import * as yup from 'yup';

export const addressSchema = yup
  .string()
  .required('Address is required')
  .test('is-address', 'Invalid Ethereum address format', (value) => {
    if (!value) return false;
    return /^0x[a-fA-F0-9]{40}$/.test(value);
  })
  .label('Address');

export const upgradeBeaconSchema = yup.object().shape({
  implementationAddress: addressSchema.label('Implementation Address'),
});

export const deleteBeaconProxySchema = yup.object().shape({
  beaconProxyAddress: addressSchema.label('Beacon Proxy Address'),
});

export const setAdminSchema = yup.object().shape({
  adminAddress: addressSchema.label('Admin Address'),
});

export type UpgradeBeaconFormSchema = yup.InferType<typeof upgradeBeaconSchema>;
export type DeleteBeaconProxyFormSchema = yup.InferType<typeof deleteBeaconProxySchema>;
export type SetAdminFormSchema = yup.InferType<typeof setAdminSchema>;
