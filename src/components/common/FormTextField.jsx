import { TextField } from '@mui/material';
import { useController } from 'react-hook-form';

const FormTextField = ({
  control,
  name,
  label,
  type = 'text',
  required = false,
  ...props
}) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: { required: required ? `${label} is required` : false },
  });

  return (
    <TextField
      {...field}
      label={label}
      type={type}
      error={!!error}
      helperText={error?.message}
      required={required}
      fullWidth
      {...props}
    />
  );
};

export default FormTextField;
