
import AuthLayout from '@/components/layouts/AuthLayout';
import SignupForm from '@/components/auth/SignupForm';
import { APP_NAME } from '@/lib/constants';

export default function SignupPage() {
  return (
    <AuthLayout
      pageTitle={`Create ${APP_NAME} Account`}
      pageDescription="Join our library community. It's quick and easy."
    >
      <SignupForm />
    </AuthLayout>
  );
}
