import { SignupForm } from '../components/SignupForm';

function SignupPage(): React.ReactElement {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-6 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
          <p className="mt-2 text-muted-foreground">Enter your details to create your account</p>
        </div>
        <SignupForm />
      </div>
    </div>
  );
}

export default SignupPage;
