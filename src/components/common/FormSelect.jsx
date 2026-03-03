import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { useController } from 'react-hook-form';

const FormSelect = ({
  control,
  name,
  label,
  options = [],
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
    <FormControl fullWidth error={!!error} required={required}>
      <InputLabel>{label}</InputLabel>
      <Select {...field} label={label} {...props}>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>{error.message}</FormHelperText>}
    </FormControl>
  );
};

export default FormSelect;
