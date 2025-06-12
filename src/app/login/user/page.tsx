import AuthLayout from '@/components/layouts/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';

export default function UserLoginPage() {
  return (
    <AuthLayout
      pageTitle="User Portal"
      pageDescription="Access your library account and services."
    >
      <LoginForm role="user" />
    </AuthLayout>
  );
}
