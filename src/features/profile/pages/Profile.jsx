import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Divider,
} from '@mui/material';
import { useAppDispatch } from '@/store/hooks';
import { addNotification } from '@/store/slices/uiSlice';
import { userService } from '@/services/userService';
import { changePasswordSchema } from '@/utils/validators';
import FormTextField from '@/components/common/FormTextField';
import Loading from '@/components/common/Loading';
import { useAuth } from '@/features/auth/hooks/useAuth';

const Profile = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  const {
    control: profileControl,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: { isSubmitting: isSubmittingProfile },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
    },
  });

  const {
    control: passwordControl,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { isSubmitting: isSubmittingPassword },
  } = useForm({
    resolver: yupResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await userService.getProfile();
      setProfile(data);
      resetProfile({
        name: data.name || '',
        email: data.email || '',
      });
    } catch (error) {
      dispatch(
        addNotification({
          message: 'Failed to load profile',
          severity: 'error',
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const onProfileSubmit = async (data) => {
    try {
      await userService.updateProfile(data);
      dispatch(
        addNotification({
          message: 'Profile updated successfully',
          severity: 'success',
        })
      );
      fetchProfile();
    } catch (error) {
      dispatch(
        addNotification({
          message: 'Failed to update profile',
          severity: 'error',
        })
      );
    }
  };

  const onPasswordSubmit = async (data) => {
    try {
      await userService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      dispatch(
        addNotification({
          message: 'Password changed successfully',
          severity: 'success',
        })
      );
      resetPassword();
    } catch (error) {
      dispatch(
        addNotification({
          message: error.response?.data?.message || 'Failed to change password',
          severity: 'error',
        })
      );
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Profile
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              <Box
                component="form"
                onSubmit={handleProfileSubmit(onProfileSubmit)}
                sx={{ mt: 2 }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormTextField
                      control={profileControl}
                      name="name"
                      label="Name"
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormTextField
                      control={profileControl}
                      name="email"
                      label="Email"
                      type="email"
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 2,
                        justifyContent: 'flex-end',
                      }}
                    >
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmittingProfile}
                      >
                        {isSubmittingProfile ? 'Updating...' : 'Update Profile'}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Change Password
              </Typography>
              <Box
                component="form"
                onSubmit={handlePasswordSubmit(onPasswordSubmit)}
                sx={{ mt: 2 }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormTextField
                      control={passwordControl}
                      name="currentPassword"
                      label="Current Password"
                      type="password"
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormTextField
                      control={passwordControl}
                      name="newPassword"
                      label="New Password"
                      type="password"
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormTextField
                      control={passwordControl}
                      name="confirmPassword"
                      label="Confirm Password"
                      type="password"
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 2,
                        justifyContent: 'flex-end',
                      }}
                    >
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmittingPassword}
                      >
                        {isSubmittingPassword
                          ? 'Changing...'
                          : 'Change Password'}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
