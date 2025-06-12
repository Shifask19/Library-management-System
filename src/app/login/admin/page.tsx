import AuthLayout from '@/components/layouts/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';

export default function AdminLoginPage() {
  return (
    <AuthLayout
      pageTitle="Admin Portal"
      pageDescription="Manage library resources and operations."
    >
      <LoginForm role="admin" />
    </AuthLayout>
  );
}
